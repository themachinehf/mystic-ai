// ========== 语言切换 ==========
let currentLang = 'en';

const translations = {
    en: {
        title: 'Enter Your Information',
        nameLabel: 'Your Name',
        namePlaceholder: 'Enter your name',
        genderLabel: 'Gender',
        male: 'Male',
        female: 'Female',
        birthDateLabel: 'Date of Birth',
        year: 'Year',
        month: 'Month',
        day: 'Day',
        zodiacLabel: 'Zodiac',
        birthTimeLabel: 'Birth Hour (Chinese)',
        submitBtn: 'Reveal My Fortune',
        personalityTitle: 'Personality Analysis',
        todayTitle: "Today's Horoscope",
        weekTitle: 'This Week',
        monthTitle: 'This Month',
        careerTitle: 'Career · Love · Wealth',
        loadingTexts: ['The stars are aligning...', 'Consulting the ancient wisdom...', 'Reading your celestial chart...', 'Weaving your fate...']
    },
    zh: {
        title: '填写您的信息',
        nameLabel: '您的姓名',
        namePlaceholder: '请输入姓名',
        genderLabel: '性别',
        male: '男',
        female: '女',
        birthDateLabel: '出生日期',
        year: '年',
        month: '月',
        day: '日',
        zodiacLabel: '星座',
        birthTimeLabel: '出生时辰',
        submitBtn: '揭示命运',
        personalityTitle: '性格分析',
        todayTitle: '今日运势',
        weekTitle: '本周运势',
        monthTitle: '本月运势',
        careerTitle: '事业 · 爱情 · 财运',
        loadingTexts: ['星辰正在排列...', '探寻古老智慧...', '解读你的星盘...', '编织你的命运...']
    }
};

function switchLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // 更新表单文本
    document.querySelector('.section-title').textContent = t.title;
    document.querySelector('label[for="name"]').textContent = t.nameLabel;
    document.getElementById('name').placeholder = t.namePlaceholder;
    document.querySelectorAll('.form-group label')[0].nextElementSibling.querySelector('label').textContent = t.genderLabel;
    
    // 更新性别选项
    const genderBtns = document.querySelectorAll('.gender-btn span:last-child');
    if (genderBtns.length >= 2) {
        genderBtns[0].textContent = t.male;
        genderBtns[1].textContent = t.female;
    }
    
    // 更新结果卡片标题
    document.querySelector('#personalityCard h3').textContent = t.personalityTitle;
    document.querySelector('#todayCard h3').textContent = t.todayTitle;
    document.querySelector('#weekCard h3').textContent = t.weekTitle;
    document.querySelector('#monthCard h3').textContent = t.monthTitle;
    document.querySelector('#careerCard h3').textContent = t.careerTitle;
    
    // 更新加载文字
    const loadingTexts = t.loadingTexts;
    const loadingTextEl = document.getElementById('loadingText');
    if (loadingTextEl) {
        loadingTextEl.innerHTML = loadingTexts.map(txt => `<span style="display:block;text-align:center;">${txt}</span>`).join('');
    }
    
    // 保存语言设置
    localStorage.setItem('mystic_lang', lang);
}

// ========== 创建星星背景 ==========
function createStars() {
    const container = document.getElementById('stars');
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(star);
    }
}

// ========== 粒子背景 ==========
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 25 + 's';
        particle.style.animationDuration = (20 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

// ========== 初始化年份选择器 ==========
function initYearSelector() {
    const yearSelect = document.getElementById('birthYear');
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= 1950; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

// ========== 初始化日期选择器 ==========
function initDaySelector() {
    const daySelect = document.getElementById('birthDay');
    daySelect.innerHTML = '<option value="">Day</option>';

    for (let day = 1; day <= 31; day++) {
        const option = document.createElement('option');
        option.value = day.toString().padStart(2, '0');
        option.textContent = day;
        daySelect.appendChild(option);
    }
}

// ========== 根据日期计算星座 ==========
function getZodiac(month, day) {
    const zodiacMap = [
        { sign: 'Capricorn', start: [12, 22], end: [1, 19] },
        { sign: 'Aquarius', start: [1, 20], end: [2, 18] },
        { sign: 'Pisces', start: [2, 19], end: [3, 20] },
        { sign: 'Aries', start: [3, 21], end: [4, 19] },
        { sign: 'Taurus', start: [4, 20], end: [5, 20] },
        { sign: 'Gemini', start: [5, 21], end: [6, 20] },
        { sign: 'Cancer', start: [6, 21], end: [7, 22] },
        { sign: 'Leo', start: [7, 23], end: [8, 22] },
        { sign: 'Virgo', start: [8, 23], end: [9, 22] },
        { sign: 'Libra', start: [9, 23], end: [10, 22] },
        { sign: 'Scorpio', start: [10, 23], end: [11, 21] },
        { sign: 'Sagittarius', start: [11, 22], end: [12, 21] }
    ];

    for (let zodiac of zodiacMap) {
        const [startMonth, startDay] = zodiac.start;
        const [endMonth, endDay] = zodiac.end;

        if (startMonth > endMonth) {
            if ((month === startMonth && day >= startDay) || (month <= endMonth && day <= endDay)) {
                return zodiac.sign;
            }
        } else {
            if ((month === startMonth && day >= startDay) || (month > startMonth && month < endMonth) || (month === endMonth && day <= endDay)) {
                return zodiac.sign;
            }
        }
    }

    return 'Capricorn';
}

// ========== 更新星座显示 ==========
function updateZodiac() {
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const zodiacDisplay = document.getElementById('zodiacDisplay');
    const zodiacInput = document.getElementById('zodiac');

    if (month && day) {
        const zodiac = getZodiac(month, day);
        zodiacDisplay.textContent = zodiac;
        zodiacInput.value = zodiac;
    } else {
        zodiacDisplay.textContent = '-';
        zodiacInput.value = '';
    }
}

// ========== 显示加载动画 ==========
function showLoading() {
    const inputCard = document.getElementById('inputCard');
    const loadingContainer = document.getElementById('loadingContainer');
    
    inputCard.style.display = 'none';
    loadingContainer.style.display = 'block';
    
    // 旋转加载文字
    const loadingTexts = [
        'The stars are aligning...',
        'Consulting the ancient wisdom...',
        'Reading your celestial chart...',
        'Weaving your fate...'
    ];
    const loadingTextEl = document.getElementById('loadingText');
    if (loadingTextEl) {
        loadingTextEl.innerHTML = loadingTexts.map(t => `<span style="display:block;text-align:center;">${t}</span>`).join('');
        loadingTextEl.classList.add('loading-text-rotating');
    }
}

// ========== 显示结果 ==========
function showResults(aiReading) {
    const loadingContainer = document.getElementById('loadingContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const footerSection = document.getElementById('footerSection');
    
    loadingContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    footerSection.style.display = 'block';
    
    // 塔罗牌翻转动画
    setTimeout(() => {
        const tarotCard = document.getElementById('tarotCard');
        tarotCard.classList.add('revealed');
        
        // 随机塔罗牌
        const tarotSymbols = ['🌟', '🌙', '☀️', '⚡', '🌊', '🔥'];
        const tarotNames = ['The Star', 'The Moon', 'The Sun', 'Strength', 'Wheel of Fortune', 'Temperance'];
        
        const randomIndex = Math.floor(Math.random() * tarotSymbols.length);
        document.getElementById('tarotImage').textContent = tarotSymbols[randomIndex];
        document.getElementById('tarotName').textContent = tarotNames[randomIndex];
    }, 600);
    
    // 填充结果
    if (aiReading) {
        document.getElementById('personalityContent').innerHTML = aiReading;
        // 保存到历史记录
        saveReadingHistory({
            name: formData.name,
            zodiac: formData.zodiac,
            reading: aiReading,
            date: new Date().toISOString()
        });
    } else {
        fillDefaultResults();
    }
    
    // 结果卡片入场动画
    animateResultCards();
}

// ========== 默认结果 ==========
function fillDefaultResults() {
    const name = document.getElementById('name').value || 'You';
    
    document.getElementById('personalityContent').innerHTML = `
        <p>Based on your birth information, ${name}, AI has analyzed your personality:</p>
        <p style="margin-top: 16px;">🔮 <strong>Core Traits:</strong> You are a creative soul with exceptional intuition and deep insight.</p>
        <p style="margin-top: 12px;">💫 <strong>Style:</strong> You think deeply and often find inspiration in moments of solitude.</p>
        <p style="margin-top: 12px;">🌟 <strong>Relationships:</strong> You value meaningful connections. Though your circle is small, each bond is genuine and lasting.</p>
    `;
    
    document.getElementById('todayContent').innerHTML = `
        <p>☀️ <strong>Overall:</strong> ★★★★☆</p>
        <p style="margin-top: 12px;">💼 <strong>Career:</strong> Excellent day for handling important matters.</p>
        <p style="margin-top: 12px;">💕 <strong>Love:</strong> Unexpected surprises await. Stay open-minded.</p>
        <p style="margin-top: 12px;">💰 <strong>Wealth:</strong> Stable finances. Conservative investments recommended.</p>
    `;
    
    document.getElementById('weekContent').innerHTML = `
        <p>☾ <strong>Overall:</strong> ★★★★☆</p>
        <p style="margin-top: 12px;">📅 This week brings adjustments and breakthroughs. Perfect for planning new ventures.</p>
        <p style="margin-top: 12px;">⚠️ Note: You may feel tired by the weekend. Rest when needed.</p>
    `;
    
    document.getElementById('monthContent').innerHTML = `
        <p>★ <strong>Overall:</strong> ★★★★★</p>
        <p style="margin-top: 12px;">🎯 This is your lucky month! Significant improvements in career, love, and finances are possible.</p>
        <p style="margin-top: 12px;">🔑 Advice: Seize opportunities and try new things.</p>
    `;
    
    document.getElementById('careerContent').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 10px;">💼</div>
                <h4 style="margin-bottom: 10px; color: var(--gold); font-size: 0.85rem;">Career</h4>
                <p style="font-size: 0.8rem; line-height: 1.6;">Promotions and raises are possible. Be proactive and showcase your abilities.</p>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 10px;">💕</div>
                <h4 style="margin-bottom: 10px; color: var(--gold); font-size: 0.85rem;">Love</h4>
                <p style="font-size: 0.8rem; line-height: 1.6;">Singles may find their match. Couples will experience deeper connection.</p>
            </div>
            <div style="text-align: center;">
                <div style="font-size: 2rem; margin-bottom: 10px;">💰</div>
                <h4 style="margin-bottom: 10px; color: var(--gold); font-size: 0.85rem;">Wealth</h4>
                <p style="font-size: 0.8rem; line-height: 1.6;">Financial growth continues. Investment is favorable, but avoid impulsive purchases.</p>
            </div>
        </div>
    `;
}

// ========== 结果卡片入场动画 ==========
function animateResultCards() {
    const cards = document.querySelectorAll('.result-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.classList.add('animate-in');
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150 + 800);
    });
}

// ========== 调用 AI API (支持流式) ==========
async function callAIAPI(data) {
    try {
        const response = await fetch('/api/mystic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('API call failed');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========== 流式调用 AI API ==========
async function callAIAPIStream(data, onChunk) {
    try {
        const response = await fetch('/api/mystic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('API call failed');
        }

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
                    try {
                        const data = JSON.parse(line.slice(5).trim());
                        if (data.type === 'done') {
                            return { success: true, done: true };
                        } else if (data.choices?.[0]?.delta?.content) {
                            onChunk(data.choices[0].delta.content);
                        }
                    } catch (e) {
                        // 忽略解析错误
                    }
                }
            }
        }
        return { success: true, done: true };
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ========== 格式化解读内容 ==========
function formatReadingContent(text) {
    // 将纯文本转换为 HTML 格式
    let html = text
        .replace(/\n\n/g, '</p><p>')  // 段落
        .replace(/\n/g, '<br>')  // 换行
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // 粗体
        .replace(/\*(.*?)\*/g, '<em>$1</em>');  // 斜体
    
    // 如果没有段落标签，加一个
    if (!html.includes('<p>')) {
        html = '<p>' + html + '</p>';
    }
    
    return html;
}

// ========== 表单提交 ==========
document.getElementById('mysticForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const year = document.getElementById('birthYear').value;
    const month = document.getElementById('birthMonth').value;
    const day = document.getElementById('birthDay').value;

    const formData = {
        name: document.getElementById('name').value,
        gender: document.querySelector('input[name="gender"]:checked')?.value,
        birthDate: `${year}-${month}-${day}`,
        birthTime: document.getElementById('birthTime').value,
        zodiac: document.getElementById('zodiac').value
    };

    if (!formData.name || !formData.gender || !formData.birthDate || !formData.zodiac) {
        alert('Please fill in all fields');
        return;
    }

    showLoading();

    try {
        // 等待 API 返回完整结果
        const result = await callAIAPI(formData);
        
        if (result.success && result.reading) {
            // 保存到历史记录
            saveReadingHistory({
                name: formData.name,
                zodiac: formData.zodiac,
                reading: result.reading,
                date: new Date().toISOString()
            });
            // 更新历史记录计数
            updateHistoryCount();
            // 显示结果
            showResults(result.reading);
        }
    } catch (error) {
        console.error('Error:', error);
        // API 失败时显示默认结果
        showResults();
    }
});

// ========== 重新测试 ==========
document.getElementById('restartBtn').addEventListener('click', function() {
    // 重置表单
    document.getElementById('mysticForm').reset();
    document.getElementById('zodiacDisplay').textContent = '-';
    
    // 隐藏结果，显示输入表单
    const resultsContainer = document.getElementById('resultsContainer');
    const footerSection = document.getElementById('footerSection');
    const inputCard = document.getElementById('inputCard');
    const tarotCard = document.getElementById('tarotCard');
    
    resultsContainer.style.display = 'none';
    footerSection.style.display = 'none';
    inputCard.style.display = 'block';
    
    // 移除塔罗牌翻转状态
    tarotCard.classList.remove('revealed');
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== 监听日期变化 ==========
document.getElementById('birthMonth').addEventListener('change', updateZodiac);
document.getElementById('birthDay').addEventListener('change', updateZodiac);

// ========== 复制钱包地址 ==========
const copyBtn = document.getElementById('copyBtn');
const walletAddress = '0x44B82c81d3f5c712ACFaf3C6e760779A41b2ACE6';

if (copyBtn) {
    copyBtn.addEventListener('click', async function() {
        try {
            await navigator.clipboard.writeText(walletAddress);
            
            // 复制成功反馈
            const originalIcon = this.innerHTML;
            this.innerHTML = '<span style="color: #22c55e;">✓</span>';
            this.style.borderColor = '#22c55e';
            
            setTimeout(() => {
                this.innerHTML = originalIcon;
                this.style.borderColor = '';
            }, 2000);
        } catch (err) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = walletAddress;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.innerHTML = '<span style="color: #22c55e;">✓</span>';
            setTimeout(() => {
                this.innerHTML = '<span class="copy-icon">📋</span>';
            }, 2000);
        }
    });
}

// ========== 历史记录 ==========
function saveReadingHistory(record) {
    let history = JSON.parse(localStorage.getItem('mystic_history') || '[]');
    history.unshift(record);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem('mystic_history', JSON.stringify(history));
}

function getReadingHistory() {
    return JSON.parse(localStorage.getItem('mystic_history') || '[]');
}

function clearReadingHistory() {
    localStorage.removeItem('mystic_history');
    renderHistory();
    updateHistoryCount();
}

// ========== 历史记录 UI ==========
function toggleHistory() {
    const panel = document.getElementById('historyPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    updateHistoryCount();
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    const history = getReadingHistory();
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-history">No readings yet</p>';
        return;
    }
    
    historyList.innerHTML = history.map((item, index) => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        const preview = item.reading.replace(/<[^>]*>/g, '').substring(0, 100);
        
        return `
            <div class="history-item" onclick="viewHistoryItem(${index})">
                <div class="history-item-header">
                    <span class="history-item-name">${escapeHtml(item.name)}</span>
                    <span class="history-item-date">${dateStr}</span>
                </div>
                <span class="history-item-zodiac">${item.zodiac}</span>
                <p class="history-item-preview">${preview}...</p>
            </div>
        `;
    }).join('');
}

function viewHistoryItem(index) {
    const history = getReadingHistory();
    if (history[index]) {
        const item = history[index];
        // 显示历史记录的解读内容
        showResults(item.reading);
        // 隐藏历史记录面板
        document.getElementById('historyPanel').style.display = 'none';
        // 显示返回按钮
        document.getElementById('backBtn').style.display = 'flex';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function updateHistoryCount() {
    const history = getReadingHistory();
    const countEl = document.getElementById('historyCount');
    if (countEl) countEl.textContent = history.length;
}

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    createParticles();
    initYearSelector();
    initDaySelector();
    console.log('✨ Mystic AI Ready - Version 2.0');
    
    // 初始化邮件订阅
    initNewsletter();
    
    // 历史记录事件（加 null 检查）
    const historyToggleBtn = document.getElementById('historyToggleBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (historyToggleBtn) {
        historyToggleBtn.addEventListener('click', toggleHistory);
    }
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            if (confirm('Clear all reading history?')) {
                clearReadingHistory();
            }
        });
    }
    updateHistoryCount();
    
    // 返回按钮事件
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            // 隐藏返回按钮
            this.style.display = 'none';
            // 打开历史记录面板
            toggleHistory();
        });
    }
    
    // 语言切换初始化
    const savedLang = localStorage.getItem('mystic_lang') || 'en';
    switchLanguage(savedLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });
});
