// ========== 粒子背景 ==========
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 15) + 's';
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
    document.getElementById('inputSection').style.display = 'none';
    document.getElementById('loadingSection').style.display = 'block';
}

// ========== 显示结果 ==========
function showResults(aiReading) {
    document.getElementById('loadingSection').style.display = 'none';
    document.getElementById('resultSection').style.display = 'block';
    document.getElementById('paymentSection').style.display = 'block';

    setTimeout(() => {
        const tarotCard = document.getElementById('tarotCard');
        tarotCard.classList.add('revealed');

        const tarotSymbols = ['🌟', '🌙', '☀️', '⚡', '🌊', '🔥'];
        const tarotNames = ['The Star', 'The Moon', 'The Sun', 'Strength', 'Wheel of Fortune', 'Temperance'];

        const randomIndex = Math.floor(Math.random() * tarotSymbols.length);
        document.getElementById('tarotImage').textContent = tarotSymbols[randomIndex];
        document.getElementById('tarotName').textContent = tarotNames[randomIndex];
    }, 500);

    // 如果有 AI 解读，显示它
    if (aiReading) {
        document.getElementById('personalityContent').innerHTML = aiReading;
    }

    // 添加结果卡片动画
    const cards = document.querySelectorAll('.result-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
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
            showResults(result.reading);
        } else {
            // 如果 API 失败，使用默认结果
            showResults(null);
        }
    } catch (error) {
        console.error('Error:', error);
        // API 失败时显示默认结果
        showResults(null);
    }
});

// ========== 重新测试 ==========
document.getElementById('restartBtn').addEventListener('click', function() {
    document.getElementById('mysticForm').reset();
    document.getElementById('zodiacDisplay').textContent = '-';

    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('inputSection').style.display = 'block';

    document.getElementById('tarotCard').classList.remove('revealed');
});

// ========== 监听日期变化 ==========
document.getElementById('birthMonth').addEventListener('change', updateZodiac);
document.getElementById('birthDay').addEventListener('change', updateZodiac);

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    initYearSelector();
    initDaySelector();
    console.log('✨ Mystic AI Ready');
});
