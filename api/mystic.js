// Vercel Serverless Function - Mystic AI V2.2 Optimized
const crypto = require('crypto');

// ========== 限流配置 ==========
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟窗口
const MAX_REQUESTS_PER_WINDOW = 10; // 每分钟最多10次
const requestCounts = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const counts = requestCounts.get(ip) || { count: 0, windowStart: now };
    
    if (now - counts.windowStart > RATE_LIMIT_WINDOW) {
        counts.count = 1;
        counts.windowStart = now;
    } else {
        counts.count++;
    }
    
    requestCounts.set(ip, counts);
    
    if (counts.count > MAX_REQUESTS_PER_WINDOW) {
        return false;
    }
    return true;
}

// ========== 缓存配置 ==========
const CACHE_EXPIRY = 10 * 60 * 1000; // 10分钟
function getCache(req) {
    const { name, gender, birthDate, birthTime, zodiac, lang } = req.body;
    const key = crypto.createHash('md5')
        .update(`${name}${gender}${birthDate}${birthTime}${zodiac}${lang}`)
        .digest('hex');
    
    if (!global.mysticCache) global.mysticCache = new Map();
    const cache = global.mysticCache;
    
    if (lang !== 'zh' && cache.has(key)) {
        const cached = cache.get(key);
        if (Date.now() - cached.time < CACHE_EXPIRY) {
            return { data: cached.data, key };
        }
    }
    return { key };
}

function setCache(key, data) {
    if (!global.mysticCache) global.mysticCache = new Map();
    const cache = global.mysticCache;
    
    cache.set(key, { time: Date.now(), data });
    
    // 限制缓存大小
    if (cache.size > 100) {
        const oldest = [...cache.entries()].sort((a, b) => a[1].time - b[1].time)[0];
        cache.delete(oldest[0]);
    }
}

module.exports = async function handler(req, res) {
    // 健康检查
    if (req.method === 'GET') {
        return res.status(200).json({ status: 'ok', version: '2.2' });
    }
    
    // 方法检查
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // 限流检查
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIP)) {
        return res.status(429).json({ error: 'Too many requests. Please wait.' });
    }
    
    const { name, gender, birthDate, birthTime, zodiac, lang } = req.body;
    
    // 参数验证
    if (!name || !birthDate || !birthTime || !zodiac) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // API Key 检查
    const API_KEY = process.env.MINIMAX_API_KEY || '';
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }
    
    // 缓存检查
    const { data: cachedData, key: cacheKey } = getCache(req);
    if (cachedData) {
        console.log('Cache hit for:', cacheKey);
        return res.status(200).json({ ...cachedData, cached: true });
    }
    
    try {
        const isChinese = lang === 'zh';
        
        // 提示词优化
        const systemPrompt = isChinese 
            ? `你是专业的塔罗牌占卜师。请用简体中文回复，风格神秘、优雅、富有诗意。使用美好的中文词汇和意象，让人感到温暖和希望。`
            : `You are a professional tarot reader. Your style is mysterious, elegant, and poetic. Use beautiful words to make people feel warm and hopeful.`;

        const userContent = isChinese
            ? `请为以下用户进行塔罗牌解读：

【基本信息】
姓名：${name}
性别：${gender === 'male' ? '男' : '女'}
出生日期：${birthDate}
出生时辰：${birthTime}
星座：${zodiac}

【要求】
1. 性格分析
2. 今日运势（事业、爱情、财运），用★★★☆评分
3. 本周运势分析
4. 本月运势走向

用优美的中文散文风格撰写。`
            : `Tarot reading for ${name} (${gender}, ${birthDate}, ${birthTime}, ${zodiac}):

1. Personality
2. Today (career, love, wealth) with ★★★☆ rating
3. This week outlook
4. This month fortune

Write in mystical, poetic English.`;

        // API 调用（带重试）
        let attempts = 0;
        const maxAttempts = 2;
        let responseData;
        
        while (attempts < maxAttempts) {
            attempts++;
            try {
                const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'MiniMax-M2.1',
                        tokens_to_generate: 1500,
                        temperature: 0.7,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userContent }
                        ]
                    }),
                    signal: AbortSignal.timeout(30000)
                });

                if (!response.ok) {
                    console.error(`MiniMax API Error (${attempts}):`, response.status);
                    if (attempts >= maxAttempts) {
                        return res.status(502).json({ error: 'AI service unavailable' });
                    }
                    await new Promise(r => setTimeout(r, 1000));
                    continue;
                }

                responseData = await response.json();
                break;
            } catch (err) {
                if (attempts >= maxAttempts) throw err;
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        let content = responseData.choices?.[0]?.message?.content || responseData.message || '';
        
        // 修复英文词
        if (isChinese && /[a-zA-Z]/.test(content)) {
            content = content
                .replace(/\bPersonality\b/gi, '性格分析')
                .replace(/\bCareer\b/gi, '事业')
                .replace(/\bLove\b/gi, '爱情')
                .replace(/\bWealth\b/gi, '财运')
                .replace(/\bToday\b/gi, '今日')
                .replace(/\bWeek\b/gi, '周')
                .replace(/\bMonth\b/gi, '月')
                .replace(/★+/g, '★★★☆');
        }

        const result = { success: true, reading: content };
        
        // 保存缓存（非中文）
        if (lang !== 'zh') {
            setCache(cacheKey, result);
        }

        console.log('API success, cached:', lang !== 'zh');
        res.status(200).json(result);
        
    } catch (error) {
        console.error('API Error:', error.message);
        res.status(500).json({ error: 'Failed to generate reading' });
    }
};
