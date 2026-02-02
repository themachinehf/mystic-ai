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
    
    // 模拟加载时间
    setTimeout(() => {
        showResults();
    }, 3500);
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

// ========== 调用 AI API ==========
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
        // 调用 AI API
        const result = await callAIAPI(formData);
        
        if (result.success && result.reading) {
            // 如果有 AI 解读，可以更新显示
            console.log('AI Reading:', result.reading);
        }
    } catch (error) {
        console.error('Error:', error);
        // API 失败时显示默认结果（已在 showResults 中处理）
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

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    createStars();
    createParticles();
    initYearSelector();
    initDaySelector();
    console.log('✨ Mystic AI Ready - Version 2.0');
    
    // 初始化邮件订阅
    initNewsletter();
});

// ========== 邮件订阅 ==========
function initNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('newsletterEmail').value;
        const btn = form.querySelector('.newsletter-btn');
        
        if (!email) return;
        
        // 禁用按钮
        btn.disabled = true;
        btn.innerHTML = '<span>Subscribing...</span>';
        
        // 模拟订阅（实际应该发送到后端）
        try {
            // 这里可以添加实际的 API 调用
            // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
            
            // 模拟延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // 显示成功
            const card = document.querySelector('.newsletter-card');
            card.classList.add('success');
            
            // 保存到 localStorage
            saveEmail(email);
            
            console.log('📧 Email subscribed:', email);
        } catch (error) {
            console.error('Subscription error:', error);
            btn.disabled = false;
            btn.innerHTML = '<span>Subscribe</span><span class="btn-icon">→</span>';
        }
    });
}

function saveEmail(email) {
    let emails = JSON.parse(localStorage.getItem('mystic_subscribers') || '[]');
    if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('mystic_subscribers', JSON.stringify(emails));
    }
}
