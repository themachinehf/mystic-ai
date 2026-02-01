// Vercel Serverless Function
const https = require('https');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, gender, birthDate, birthTime, zodiac } = req.body;

    // MiniMax API 配置
    const API_KEY = process.env.MINIMAX_API_KEY || '';
    const API_URL = 'https://api.minimaxi.com/anthropic/messages';

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        // 调用 MiniMax API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
                'X-API-Version': 'v1'
            },
            body: JSON.stringify({
                model: 'MiniMax-M2.1',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional astrologer and tarot reader. Provide detailed, mystical readings in English.'
                    },
                    {
                        role: 'user',
                        content: `Give me a fortune reading based on:
                            Name: ${name}
                            Gender: ${gender}
                            Birth Date: ${birthDate}
                            Birth Time (Chinese): ${birthTime}
                            Zodiac: ${zodiac}
                            
                            Include:
                            1. Personality analysis
                            2. Today's horoscope (career, love, wealth)
                            3. This week's outlook
                            4. This month's fortune
                            
                            Write in mystical, poetic English.`
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.content || data.message || data.choices?.[0]?.message?.content;

        res.status(200).json({
            success: true,
            reading: content
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to generate reading' });
    }
};
