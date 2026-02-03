// Vercel Serverless Function
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
            ? '你是专业的占卜师和塔罗牌解读师，用神秘、诗意的方式提供详细的中文解读。'
            : 'You are a professional astrologer and tarot reader. Provide detailed, mystical readings in English.';
            
        const userContent = isChinese
            ? `请根据以下信息给出塔罗牌占卜解读：
姓名：${name}
性别：${gender}
出生日期：${birthDate}
出生时辰：${birthTime}
星座：${zodiac}

请包含：
1. 性格分析
2. 今日运势（事业、爱情、财运）
3. 本周运势
4. 本月运势

用神秘、诗意风格的中文撰写。保持简洁。`
            : `You are a professional astrologer and tarot reader. Give a mystical fortune reading in English.
            
Name: ${name}
Gender: ${gender}
Birth Date: ${birthDate}
Birth Time (Chinese): ${birthTime}
Zodiac: ${zodiac}

Include: 1) Personality analysis, 2) Today's horoscope (career, love, wealth), 3) This week's outlook, 4) This month's fortune. Write in mystical, poetic style. Keep it concise.`;

        // 调用 MiniMax API
        const response = await fetch('https://api.minimax.chat/v1/text/chatcompletion_v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'MiniMax-M2.1',
                tokens_to_generate: 1500,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('MiniMax API Error:', response.status, errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
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
