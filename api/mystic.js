// Vercel Serverless Function - 修复缓存问题
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

    // 修复：lang 参数必须参与缓存 key
    const cacheKey = crypto.createHash('md5')
        .update(`${name}${gender}${birthDate}${birthTime}${zodiac}${lang}`)
        .digest('hex');
    
    // 缓存池（全局）
    if (!global.mysticCache) global.mysticCache = new Map();
    const cache = global.mysticCache;
    const cacheExpiry = 10 * 60 * 1000; // 10分钟
    
    // 修复：如果 lang=zh 或 noCache=true，跳过缓存
    if (lang !== 'zh' && !req.query.noCache && cache.has(cacheKey)) {
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
- 使用美好的中文词汇和意象
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

请用**神秘、诗意风格的中文**撰写，包含：
1. 性格分析
2. 今日运势（事业、爱情、财运），用★★★☆评分
3. 本周运势分析
4. 本月运势走向

用优美的中文散文风格，每段空行分隔。`
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
                    const errorText = await response.text();
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

        const content = data.choices?.[0]?.message?.content || data.message || data.content;
        const result = { success: true, reading: content };

        // 只缓存英文查询
        if (lang !== 'zh') {
            cache.set(cacheKey, { time: Date.now(), data: result });
            if (cache.size > 100) {
                const oldest = [...cache.entries()].sort((a, b) => a[1].time - b[1].time)[0];
                cache.delete(oldest[0]);
            }
        }

        console.log('API success, lang:', lang, 'cached:', lang !== 'zh');
        res.status(200).json(result);
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to generate reading' });
    }
};
