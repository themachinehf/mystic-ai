// ========== 翻译数据 ==========
const i18nData = {
    en: {
        formTitle: 'Enter Your Information',
        nameLabel: 'Your Name',
        namePlaceholder: 'Enter your name',
        genderLabel: 'Gender',
        male: 'Male',
        female: 'Female',
        birthDateLabel: 'Date of Birth',
        yearLabel: 'Year',
        monthLabel: 'Month',
        dayLabel: 'Day',
        zodiacLabel: 'Zodiac',
        birthTimeLabel: 'Birth Hour (Chinese)',
        submitBtn: 'Reveal My Fortune',
        personalityTitle: 'Personality Analysis',
        todayTitle: "Today's Horoscope",
        weekTitle: 'This Week',
        monthTitle: 'This Month',
        careerTitle: 'Career · Love · Wealth',
        restartBtn: 'Read Again',
        backBtn: 'Back to History',
        historyTitle: 'Reading History',
        historyListTitle: 'Your Readings',
        clearHistory: 'Clear All',
        emptyHistory: 'No readings yet',
        newsletterTitle: 'Stay Updated',
        newsletterSubtitle: 'Get notified about new readings',
        newsletterBtn: 'Subscribe',
        newsletterNote: 'We respect your privacy',
        donateTitle: 'Support This Reading',
        donateSubtitle: 'If this resonated with you, consider a tip',
        donateLabel: 'Ethereum (ERC-20)',
        donateNote: 'Your support keeps the stars aligned ✨',
        loadingTexts: ['The stars are aligning...', 'Consulting the ancient wisdom...', 'Reading your celestial chart...', 'Weaving your fate...']
    },
    zh: {
        formTitle: '填写您的信息',
        nameLabel: '您的姓名',
        namePlaceholder: '请输入姓名',
        genderLabel: '性别',
        male: '男',
        female: '女',
        birthDateLabel: '出生日期',
        yearLabel: '年',
        monthLabel: '月',
        dayLabel: '日',
        zodiacLabel: '星座',
        birthTimeLabel: '出生时辰',
        submitBtn: '揭示命运',
        personalityTitle: '性格分析',
        todayTitle: '今日运势',
        weekTitle: '本周运势',
        monthTitle: '本月运势',
        careerTitle: '事业 · 爱情 · 财运',
        restartBtn: '再次解读',
        backBtn: '返回历史',
        historyTitle: '历史记录',
        historyListTitle: '您的解读',
        clearHistory: '清空',
        emptyHistory: '暂无解读记录',
        newsletterTitle: '订阅更新',
        newsletterSubtitle: '获取最新解读通知',
        newsletterBtn: '订阅',
        newsletterNote: '我们尊重您的隐私',
        donateTitle: '支持我们',
        donateSubtitle: '如果对您有启发，欢迎打赏',
        donateLabel: 'ETH (ERC-20)',
        donateNote: '您的支持是我们前进的动力 ✨',
        loadingTexts: ['星辰正在排列...', '探寻古老智慧...', '解读你的星盘...', '编织你的命运...']
    }
};

let currentLang = 'en';

// ========== 语言切换 ==========
function switchLanguage(lang) {
    currentLang = lang;
    const t = i18nData[lang];
    
    // 更新按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    
    // 更新所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    // 更新 placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // 更新加载文字
    const loadingTextEl = document.getElementById('loadingText');
    if (loadingTextEl && t.loadingTexts) {
        loadingTextEl.innerHTML = t.loadingTexts.map(txt => `<span style="display:block;text-align:center;">${txt}</span>`).join('');
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

// ========== 计算星座 ==========
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
            if ((month === startMonth && day >= startDay) || (month <= endMonth && day <= endDay)) return zodiac.sign;
        } else {
            if ((month === startMonth && day >= startDay) || (month > startMonth && month < endMonth) || (month === endMonth && day <= endDay)) return zodiac.sign;
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
}

// ========== 显示结果 ==========
function showResults(aiReading) {
    const loadingContainer = document.getElementById('loadingContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const footerSection = document.getElementById('footerSection');
    loadingContainer.style.display = 'none';
    resultsContainer.style.display = 'block';
    footerSection.style.display = 'block';
    
    setTimeout(() => {
        const tarotCard = document.getElementById('tarotCard');
        tarotCard.classList.add('revealed');
        const tarotSymbols = ['🌟', '🌙', '☀️', '⚡', '🌊', '🔥'];
        const tarotNames = ['The Star', 'The Moon', 'The Sun', 'Strength', 'Wheel of Fortune', 'Temperance'];
        const randomIndex = Math.floor(Math.random() * tarotSymbols.length);
        document.getElementById('tarotImage').textContent = tarotSymbols[randomIndex];
        document.getElementById('tarotName').textContent = tarotNames[randomIndex];
    }, 600);
    
    if (aiReading) {
        document.getElementById('personalityContent').innerHTML = aiReading;
    } else {
        fillDefaultResults();
    }
    animateResultCards();
}

// ========== 默认结果 ==========
function fillDefaultResults() {
    const name = document.getElementById('name').value || 'You';
    document.getElementById('personalityContent').innerHTML = `
        <p>Based on your birth information, ${name}, AI has analyzed your personality:</p>
        <p style="margin-top: 16px;">🔮 <strong>Core Traits:</strong> You are a creative soul with exceptional intuition.</p>
        <p style="margin-top: 12px;">💫 <strong>Style:</strong> You think deeply and often find inspiration in solitude.</p>
    `;
    document.getElementById('todayContent').innerHTML = `
        <p>☀️ <strong>Overall:</strong> ★★★★☆</p>
        <p style="margin-top: 12px;">💼 <strong>Career:</strong> Excellent day for important matters.</p>
        <p style="margin-top: 12px;">💕 <strong>Love:</strong> Unexpected surprises await.</p>
    `;
    document.getElementById('weekContent').innerHTML = `
        <p>☾ <strong>Overall:</strong> ★★★★☆</p>
        <p style="margin-top: 12px;">📅 This week brings adjustments and breakthroughs.</p>
    `;
    document.getElementById('monthContent').innerHTML = `
        <p>★ <strong>Overall:</strong> ★★★★★</p>
        <p style="margin-top: 12px;">🎯 This is your lucky month!</p>
    `;
    document.getElementById('careerContent').innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="text-align: center;"><div style="font-size: 2rem; margin-bottom: 10px;">💼</div><strong>Career</strong></div>
            <div style="text-align: center;"><div style="font-size: 2rem; margin-bottom: 10px;">💕</div><strong>Love</strong></div>
            <div style="text-align: center;"><div style="font-size: 2rem; margin-bottom: 10px;">💰</div><strong>Wealth</strong></div>
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

// ========== 调用 AI API ==========
async function callAIAPI(data) {
    try {
        const response = await fetch('/api/mystic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('API call failed');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
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
        zodiac: document.getElementById('zodiac').value,
        lang: currentLang
    };
    if (!formData.name || !formData.gender || !formData.birthDate || !formData.zodiac) {
        alert('Please fill in all fields');
        return;
    }
    showLoading();
    try {
        const result = await callAIAPI(formData);
        if (result.success && result.reading) {
            saveReadingHistory({ name: formData.name, zodiac: formData.zodiac, reading: result.reading, date: new Date().toISOString(), lang: currentLang });
            updateHistoryCount();
            showResults(result.reading);
        }
    } catch (error) {
        console.error('Error:', error);
        showResults();
    }
});

// ========== 重新测试 ==========
document.getElementById('restartBtn').addEventListener('click', function() {
    document.getElementById('mysticForm').reset();
    document.getElementById('zodiacDisplay').textContent = '-';
    const resultsContainer = document.getElementById('resultsContainer');
    const footerSection = document.getElementById('footerSection');
    const inputCard = document.getElementById('inputCard');
    const tarotCard = document.getElementById('tarotCard');
    resultsContainer.style.display = 'none';
    footerSection.style.display = 'none';
    inputCard.style.display = 'block';
    tarotCard.classList.remove('revealed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== 复制钱包地址 ==========
document.getElementById('copyBtn')?.addEventListener('click', async function() {
    const walletAddress = '0x44B82c81d3f5c712ACFaf3C6e760779A41b2ACE6';
    try {
        await navigator.clipboard.writeText(walletAddress);
        this.innerHTML = '<span style="color: #22c55e;">✓</span>';
        setTimeout(() => { this.innerHTML = '<span class="copy-icon">📋</span>'; }, 2000);
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = walletAddress;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.innerHTML = '<span style="color: #22c55e;">✓</span>';
        setTimeout(() => { this.innerHTML = '<span class="copy-icon">📋</span>'; }, 2000);
    }
});

// ========== 邮件订阅 ==========
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value;
        const btn = newsletterForm.querySelector('.newsletter-btn');
        if (!email) return;
        btn.disabled = true;
        btn.innerHTML = '<span>Subscribing...</span>';
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const card = document.querySelector('.newsletter-card');
            card.classList.add('success');
            let emails = JSON.parse(localStorage.getItem('mystic_subscribers') || '[]');
            if (!emails.includes(email)) { emails.push(email); localStorage.setItem('mystic_subscribers', JSON.stringify(emails)); }
            console.log('📧 Email subscribed:', email);
        } catch (error) {
            console.error('Subscription error:', error);
            btn.disabled = false;
            btn.innerHTML = '<span>Subscribe</span><span class="btn-icon">→</span>';
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
        historyList.innerHTML = `<p class="empty-history">${i18nData[currentLang]?.emptyHistory || 'No readings yet'}</p>`;
        return;
    }
    historyList.innerHTML = history.map((item, index) => {
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        const preview = item.reading?.replace(/<[^>]*>/g, '').substring(0, 100) || '';
        return `<div class="history-item" onclick="viewHistoryItem(${index})">
            <div class="history-item-header">
                <span class="history-item-name">${escapeHtml(item.name)}</span>
                <span class="history-item-date">${dateStr}</span>
            </div>
            <span class="history-item-zodiac">${item.zodiac}</span>
            <p class="history-item-preview">${preview}...</p>
        </div>`;
    }).join('');
}

function viewHistoryItem(index) {
    const history = getReadingHistory();
    if (history[index]) {
        const item = history[index];
        // 临时切换到记录的语言
        const prevLang = currentLang;
        if (item.lang) switchLanguage(item.lang);
        showResults(item.reading);
        document.getElementById('historyPanel').style.display = 'none';
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
    
    // 语言切换初始化
    const savedLang = localStorage.getItem('mystic_lang') || 'en';
    switchLanguage(savedLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });
    
    // 历史记录
    const historyToggleBtn = document.getElementById('historyToggleBtn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    if (historyToggleBtn) historyToggleBtn.addEventListener('click', toggleHistory);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', () => { if (confirm('Clear all reading history?')) clearReadingHistory(); });
    updateHistoryCount();
    
    // 返回按钮
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            this.style.display = 'none';
            toggleHistory();
        });
    }
    
    // 初始化月份和日选项
    const monthSelect = document.getElementById('birthMonth');
    if (monthSelect) {
        monthSelect.addEventListener('change', updateZodiac);
    
    // 初始化月份和日选项
    const monthSelect = document.getElementById('birthMonth');
    if (monthSelect) {
        monthSelect.addEventListener('change', updateZodiac);
    }
    const daySelect = document.getElementById('birthDay');
    if (daySelect) {
        daySelect.addEventListener('change', updateZodiac);
    }
});
