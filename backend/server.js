const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// MiniMax API 配置
const MINIMAX_API_URL = 'https://api.minimaxi.com/anthropic/messages';
const API_KEY = process.env.MINIMAX_API_KEY || 'your-api-key-here';

// 调用 MiniMax API
async function callMiniMax(prompt, systemPrompt = '你是一个专业的命理师，精通八字、星座、塔罗牌等领域。请用专业但通俗易懂的语言为用户解答。') {
    try {
        const response = await fetch(MINIMAX_API_URL, {
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
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API 调用失败: ${response.status}`);
        }

        const data = await response.json();
        return data.content || data.message || data.choices?.[0]?.message?.content;
    } catch (error) {
        console.error('MiniMax API 错误:', error);
        throw error;
    }
}

// API 路由
app.post('/api/mystic', async (req, res) => {
    try {
        const { name, gender, birthDate, birthTime, zodiac } = req.body;

        // 生成性格分析提示
        const personalityPrompt = `
            请为以下信息进行综合性格分析：

            姓名：${name}
            性别：${gender}
            出生日期：${birthDate}
            出生时辰：${birthTime}
            星座：${zodiac}

            请从以下几个方面分析：
            1. 核心性格特质
            2. 优点与缺点
            3. 行事风格
            4. 人际相处模式
            5. 职业发展建议

            请用温暖专业但不说教的方式回答，控制在500字以内。
        `;

        // 生成运势提示
        const fortunePrompt = `
            请为以下信息生成今日运势：

            姓名：${name}
            出生日期：${birthDate}
            出生时辰：${birthTime}
            星座：${zodiac}

            请从事业、感情、财运三个方面给出今日运势评分和建议，用星级表示（1-5星）。
        `;

        // 生成塔罗牌解读
        const tarotPrompt = `
            请为用户抽取并解读一张塔罗牌：

            用户信息：${name}，${zodiac}座

            请：
            1. 抽取一张塔罗牌
            2. 解释牌面含义
            3. 结合用户星座给出针对性建议
            4. 控制在300字以内
        `;

        // 并行调用多个 API
        const [personality, todayFortune, weekFortune, monthFortune, career, tarot] = await Promise.all([
            callMiniMax(personalityPrompt, '你是一个专业的性格分析师，擅长结合星座和命理知识分析个人特质。'),
            callMiniMax(fortunePrompt, '你是一个专业的运势分析师，精通星座和八字。'),
            callMiniMax(fortunePrompt.replace('今日运势', '本周运势'), '你是一个专业的运势分析师，精通星座和八字。'),
            callMiniMax(fortunePrompt.replace('今日运势', '本月运势'), '你是一个专业的运势分析师，精通星座和八字。'),
            callMiniMax(`
                请为以下信息分析事业、感情、财运：

                姓名：${name}
                出生日期：${birthDate}
                出生时辰：${birthTime}
                星座：${zodiac}

                请分别从事业、感情、财运三个方面给出详细分析和具体建议。
            `, '你是一个专业的运势分析师，精通八字和星座。'),
            callMiniMax(tarotPrompt, '你是一个专业的塔罗牌师，精通塔罗牌解读。')
        ]);

        res.json({
            success: true,
            data: {
                personality,
                todayFortune,
                weekFortune,
                monthFortune,
                career,
                tarot
            }
        });
    } catch (error) {
        console.error('处理请求错误:', error);
        res.status(500).json({
            success: false,
            error: '系统繁忙，请稍后再试'
        });
    }
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
    ✨ AI Mystic 服务器已启动
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📡 端口: ${PORT}
    🌐 地址: http://localhost:${PORT}
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});
