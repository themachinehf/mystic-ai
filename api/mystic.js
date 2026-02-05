// Vercel Serverless Function - 强制中文
const crypto = require('crypto');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, gender, birthDate, birthTime, zodiac, lang } = req.body;

    const API_KEY = process.env.MINIMAX_API_KEY || '';
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    const cacheKey = crypto.createHash('md5')
        .update(`${name}${gender}${birthDate}${birthTime}${zodiac}${lang}`)
        .digest('hex');
    
    if (!global.mysticCache) global.mysticCache = new Map();
    const cache = global.mysticCache;
    const cacheExpiry = 10 * 60 * 1000;
    
    if (lang !== 'zh' && cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.time < cacheExpiry) {
            return res.status(200).json({ ...cached.data, cached: true });
        }
    }

    try {
        const isChinese = lang === 'zh';
        
        // 强化版中文提示词
        const systemPrompt = isChinese 
            ? `IMPORTANT: You MUST respond in SIMPLIFIED CHINESE only. Do NOT use any English words, phrases, or sentences. All output must be Chinese characters.

你是专业的塔罗牌占卜师。请严格遵守以下规则：
1. 必须用**简体中文**回复，一个英文词都不能有
2. 风格：神秘、优雅、富有诗意
3. 使用美好的中文词汇和意象
4. 让人感到温暖和希望

IMPORTANT: Reply ONLY in Chinese. No English whatsoever.`
            : `You are a professional tarot reader. Your style:
- Mysterious, elegant, poetic
- Use beautiful words and imagery
- Make people feel warm and hopeful`;

        const userContent = isChinese
            ? `IMPORTANT: Reply in SIMPLIFIED CHINESE only. No English.

请为以下用户进行塔罗牌解读：

【基本信息】
姓名：${name}
性别：${gender === 'male' ? '男' : '女'}
出生日期：${birthDate}
出生时辰：${birthTime}
星座：${zodiac}

【必须严格遵守】
- 全篇使用简体中文
- 一个英文词都不能出现
- 风格要神秘、诗意

【包含内容】
1. 性格分析
2. 今日运势（事业、爱情、财运），用★★★☆评分
3. 本周运势分析
4. 本月运势走向

请用优美的中文散文风格撰写，每段之间用空行分隔。`
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
                    if (attempts >= maxAttempts) throw new Error(`API error: ${response.status}`);
                    await new Promise(r => setTimeout(r, 1000));
                    continue;
                }

                data = await response.json();
                break;
            } catch (err) {
                if (attempts >= maxAttempts) throw err;
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        let content = data.choices?.[0]?.message?.content || data.message || data.content;
        
        // 修复：如果检测到英文，翻译成中文
        if (isChinese && /[a-zA-Z]/.test(content)) {
            console.log('Detected English in response, attempting fix...');
            // 替换常见英文词
            content = content
                .replace(/\bPersonality\b/g, '性格分析')
                .replace(/\bCareer\b/g, '事业')
                .replace(/\bLove\b/g, '爱情')
                .replace(/\bWealth\b/g, '财运')
                .replace(/\bToday\b/g, '今日')
                .replace(/\bWeek\b/g, '周')
                .replace(/\bMonth\b/g, '月')
                .replace(/★+/g, '★★★☆');
        }

        const result = { success: true, reading: content };

        if (lang !== 'zh') {
            cache.set(cacheKey, { time: Date.now(), data: result });
            if (cache.size > 100) {
                const oldest = [...cache.entries()].sort((a, b) => a[1].time - b[1].time)[0];
                cache.delete(oldest[0]);
            }
        }

        console.log('API success, lang:', lang);
        res.status(200).json(result);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to generate reading' });
    }
};
