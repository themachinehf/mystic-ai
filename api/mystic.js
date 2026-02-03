// Vercel Serverless Function - Streaming version
const https = require('https');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, gender, birthDate, birthTime, zodiac } = req.body;

    // MiniMax API 配置
    const API_KEY = process.env.MINIMAX_API_KEY || '';
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        // 设置 SSE 响应头
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        // 发送初始消息
        res.write(`data: {"type":"start"}\n\n`);

        // 调用 MiniMax API - 流式模式
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
                    {
                        role: 'user',
                        content: `You are a professional astrologer and tarot reader. Give a mystical fortune reading in English.
                        
Name: ${name}
Gender: ${gender}
Birth Date: ${birthDate}
Birth Time (Chinese): ${birthTime}
Zodiac: ${zodiac}

Include: 1) Personality analysis, 2) Today's horoscope (career, love, wealth), 3) This week's outlook, 4) This month's fortune. Write in mystical, poetic style.`
                    }
                ],
                stream: true
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('MiniMax API Error:', response.status, errorText);
            res.write(`data: {"error":"API error: ${response.status}"}\n\n`);
            res.end();
            return;
        }

        // 获取流式响应
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';
            
            for (const line of lines) {
                if (line.startsWith('data:')) {
                    const data = line.slice(5).trim();
                    // 过滤心跳和空数据
                    if (data && data !== '[DONE]') {
                        res.write(`data: ${data}\n\n`);
                    }
                }
            }
        }

        // 发送完成消息
        res.write(`data: {"type":"done"}\n\n`);
        res.end();

    } catch (error) {
        console.error('API Error:', error);
        res.write(`data: {"error":"${error.message}"}\n\n`);
        res.end();
    }
};
