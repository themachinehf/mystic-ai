// Vercel Serverless Function - 优化版
const crypto = require('crypto');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, gender, birthDate, birthTime, zodiac, lang } = req.body;

    // MiniMax API 配置
    const API_KEY = process.env.MINIMAX_API_KEY || '';
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    // 生成请求缓存 key（相同输入返回缓存结果）
    const cacheKey = crypto.createHash('md5')
        .update(`${name}${gender}${birthDate}${birthTime}${zodiac}${lang}`)
        .digest('hex');
    
    // 简单内存缓存（生产环境可用 Redis）
    const cache = new Map();
    const cacheExpiry = 5 * 60 * 1000; // 5分钟缓存
    
    // 检查缓存
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.time < cacheExpiry) {
            console.log('Cache hit:', cacheKey);
            return res.status(200).json({ ...cached.data, cached: true });
        }
    }

    try {
        const isChinese = lang === 'zh';
        
        const systemPrompt = isChinese 
            ? `你是专业的塔罗牌占卜师。你的解读风格：
- 神秘、优雅、富有诗意
- 使用美好的词汇和意象
- 避免直白的现代用语
- 让人感到温暖和希望`
            : `You are a professional tarot reader. Your style:
- Mysterious, elegant, poetic
- Use beautiful words and imagery
- Avoid casual modern language
- Make people feel warm and hopeful`;

        const userContent = isChinese
            ? `请为以下用户进行塔罗牌解读：

基本信息
姓名：${name}
性别：${gender === 'male' ? '男' : '女'}
出生日期：${birthDate}
出生时辰：${birthTime}
星座：${zodiac}

请用神秘、诗意风格撰写，包含：
1. 性格分析
2. 今日运势（事业、爱情、财运），用★★★☆评分
3. 本周运势分析
4. 本月运势走向

用优美的散文风格，每段空行分隔。`
            : `Tarot reading:

Name: ${name}
Gender: ${gender}
Birth: ${birthDate}
Birth Time: ${birthTime}
Zodiac: ${zodiac}

Include:
1) Personality
2) Today (career, love, wealth) with ★★★☆ rating
3) This week outlook
4) This month fortune

Write in mystical, poetic English.`;

        // 调用 API（带重试）
        let attempts = 0;
        let data;
        const maxAttempts = 2;
        
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
                        tokens_to_generate: 1500, // 优化：减少 tokens
                        temperature: 0.7,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userContent }
                        ]
                    }),
                    signal: AbortSignal.timeout(30000) // 30秒超时
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`MiniMax API Error (attempt ${attempts}):`, response.status, errorText);
                    
                    if (attempts >= maxAttempts) {
                        throw new Error(`API error: ${response.status}`);
                    }
                    await new Promise(r => setTimeout(r, 1000)); // 等待1秒重试
                    continue;
                }

                data = await response.json();
                break;
            } catch (err) {
                if (attempts >= maxAttempts) throw err;
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        const content = data.choices?.[0]?.message?.content || data.message || data.content;

        // 保存缓存
        const result = { success: true, reading: content };
        cache.set(cacheKey, { time: Date.now(), data: result });
        
        // 清理旧缓存（最多50条）
        if (cache.size > 50) {
            const oldest = [...cache.entries()].sort((a, b) => a[1].time - b[1].time)[0];
            cache.delete(oldest[0]);
        }

        console.log('API success, cache key:', cacheKey);
        res.status(200).json(result);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to generate reading' });
    }
};
