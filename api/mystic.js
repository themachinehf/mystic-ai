// Vercel Serverless Function - 双语支持
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

    try {
        // 根据语言选择提示词
        const isChinese = lang === 'zh';
        
        const systemPrompt = isChinese 
            ? `你是专业的塔罗牌占卜师，拥有深厚的玄学知识和诗意表达能力。你的解读风格：
- 神秘、优雅、富有诗意
- 使用美好的词汇和意象
- 避免直白的现代用语
- 让人感到温暖和希望`
            : `You are a professional tarot reader with deep mystical knowledge and poetic expression. Your reading style:
- Mysterious, elegant, poetic
- Use beautiful words and imagery
- Avoid casual modern language
- Make people feel warm and hopeful`;
            
        const userContent = isChinese
            ? `请为以下用户进行塔罗牌解读：

【基本信息】
姓名：${name}
性别：${gender === 'male' ? '男' : '女'}
出生日期：${birthDate}
出生时辰：${birthTime}
星座：${zodiac}

【解读要求】
请用神秘、诗意风格的中文撰写，包含以下四个部分：

1. 【性格分析】
分析用户的核心性格特质，用温暖鼓励的语言

2. 【今日运势】
包含事业、爱情、财运三个方面，用★★★☆评分

3. 【本周运势】
整体运势分析和具体建议

4. 【本月运势】
本月的整体走向和重要提醒

请用优美的中文散文风格撰写，每段之间用空行分隔。`
            : `Please give a tarot reading:

Name: ${name}
Gender: ${gender}
Birth Date: ${birthDate}
Birth Time (Chinese): ${birthTime}
Zodiac: ${zodiac}

Include:
1) Personality analysis
2) Today's horoscope (career, love, wealth) with ★★★☆ rating
3) This week's outlook
4) This month's fortune

Write in mystical, poetic English.`;

        // 调用 MiniMax API
        const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'MiniMax-M2.1',
                tokens_to_generate: 2000,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('MiniMax API Error:', response.status, errorText);
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || data.message || data.content;

        res.status(200).json({
            success: true,
            reading: content
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to generate reading' });
    }
};
