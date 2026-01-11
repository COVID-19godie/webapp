/* =========================================
   配置区域：在此处手动添加新实验文件夹
   ========================================= */
const DATA = [
    // === 力学 (Mechanics) ===
    { id: 'pendulum', title: '交互式单摆', cat: 'mechanics', path: './pendulum/index.html', desc: '自定义重力与阻尼的单摆仿真' },
    { id: 'shm', title: '简谐运动与能量', cat: 'mechanics', path: './shm/index.html', desc: 'SHM 运动受力分析与能量转化' },
    { id: 'collision', title: '碰撞实验', cat: 'mechanics', path: './collision/index.html', desc: '动量守恒与弹性/非弹性碰撞' },
    { id: 'conveyor', title: '传送带模型', cat: 'mechanics', path: './conveyor/index.html', desc: '牛顿定律在传送带上的应用' },
    { id: 'block', title: '板块模型', cat: 'mechanics', path: './block_system/index.html', desc: '多物体摩擦力与相对运动' },
    { id: 'pursuit', title: '追及相遇', cat: 'mechanics', path: './pursuit/index.html', desc: '运动学图像与追及问题可视化' },
    { id: 'energy', title: '机械能守恒', cat: 'mechanics', path: './energy/index.html', desc: '势能与动能转化的实时图表' },
    { id: 'vibrator', title: '振子与波', cat: 'mechanics', path: './vibrator/index.html', desc: '机械波的产生与传播' },
    { id: 'ang_freq', title: '角频率演示', cat: 'mechanics', path: './Angular_Frequency/index.html', desc: '圆周运动与简谐运动的关系' },

    // === 电磁学 (Electricity) ===
    { id: 'part_2d', title: '带电粒子运动 (2D)', cat: 'electricity', path: './electrodynamics_2D/index.html', desc: '复合场中的粒子轨迹全屏仿真' },
    { id: 'part_3d', title: '带电粒子 (3D)', cat: 'electricity', path: './electrodynamics_3D/index.html', desc: '三维空间中的洛伦兹力螺旋运动' },
    { id: 'part_1', title: '电场运动基础', cat: 'electricity', path: './electrodynamics_1/index.html', desc: '电场力作用下的基础运动模型' },
    { id: 'gen', title: '交流发电机', cat: 'electricity', path: './generator/index.html', desc: '磁通量变化与感应电动势原理' },
    { id: 'rod1', title: '动杆问题 I', cat: 'electricity', path: './Moving_rod_problem_1/index.html', desc: '电磁感应中的单杆切割模型' },
    { id: 'rod2', title: '动杆问题 II', cat: 'electricity', path: './Moving_rod_problem_2/index.html', desc: '双杆模型与复杂电路分析' },

    // === 天体物理 (Astrophysics) ===
    { id: 'sat_track', title: '卫星星下点轨迹', cat: 'astrophysics', path: './1_6_7/index.html', desc: '地球同步与中轨道卫星轨迹投影' },
    { id: 'multi_star', title: '星际指挥官', cat: 'astrophysics', path: './Subpoint/index.html', desc: '多卫星轨道参数自定义与3D视图' },
    { id: 'blackhole', title: '黑洞引力透镜', cat: 'astrophysics', path: './black_hole/index.html', desc: '广义相对论光线追踪渲染' },
    { id: 'star_low', title: '恒星演化 (低质量)', cat: 'astrophysics', path: './star_evolution_low/index.html', desc: '红矮星到白矮星的演化过程' },
    { id: 'star_mid', title: '恒星演化 (中质量)', cat: 'astrophysics', path: './star_evolution_mid/mid.html', desc: '太阳类恒星的主序演化' },
    { id: 'star_high', title: '恒星演化 (高质量)', cat: 'astrophysics', path: './star_evolution_high/index.html', desc: '超新星爆发与中子星/黑洞' },

    // === 声学与波 (Acoustics) ===
    { id: 'audio', title: '物理声音实验室', cat: 'acoustics', path: './audio/index.html', desc: '声波合成、频谱分析与虚拟乐器' },
    { id: '8bit', title: '8-Bit vs 钢琴', cat: 'acoustics', path: './8bit_vs_piano/index.html', desc: '不同波形的音色对比实验' },

    // === 化学 (Chemistry) ===
    { id: 'chem', title: 'ChemSim 多金属', cat: 'others', path: './Metal-Acid/index.html', desc: '金属与酸盐溶液反应的微观模拟' }
];

/* =========================================
   系统逻辑 (通常无需修改)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderGrid(DATA);
    initFilters();
    initSearch();
});

// 1. 渲染网格
function renderGrid(data) {
    const grid = document.getElementById('moduleGrid');
    grid.innerHTML = '';

    if (data.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#888;">无匹配实验</div>`;
        return;
    }

    data.forEach(item => {
        const conf = getCategoryConfig(item.cat);
        const card = document.createElement('a');
        card.className = 'card';
        card.href = item.path;
        card.target = '_blank';
        // 设置 CSS 变量供 hover 效果使用
        card.style.setProperty('--card-color', conf.color);

        card.innerHTML = `
            <div class="card-icon" style="color:${conf.color}">
                <i class="${conf.icon}"></i>
            </div>
            <h3>${item.title}</h3>
            <p>${item.desc || '虚拟仿真实验模块'}</p>
            <div class="tags">
                <span class="tag" style="color:${conf.color};border-color:${conf.color}44">
                    ${conf.label}
                </span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 2. 筛选功能
function initFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI 更新
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 数据过滤
            const filter = btn.dataset.filter;
            const filteredData = filter === 'all' 
                ? DATA 
                : DATA.filter(d => d.cat === filter);
            
            renderGrid(filteredData);
        });
    });
}

// 3. 搜索功能
function initSearch() {
    const input = document.getElementById('searchInput');
    input.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = DATA.filter(d => 
            d.title.toLowerCase().includes(term) || 
            (d.desc && d.desc.toLowerCase().includes(term))
        );
        renderGrid(filtered);
    });
}

// 4. 主题切换
function initTheme() {
    const btn = document.getElementById('themeToggle');
    const html = document.documentElement;
    const icon = btn.querySelector('i');

    // 读取本地存储
    const saved = localStorage.getItem('zmg-theme') || 'dark';
    setTheme(saved);

    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    });

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('zmg-theme', theme);
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// 配置中心
function getCategoryConfig(cat) {
    const map = {
        'mechanics':    { label: '经典力学', color: '#3b82f6', icon: 'fas fa-cogs' },
        'electricity':  { label: '电磁学',   color: '#eab308', icon: 'fas fa-bolt' },
        'optics':       { label: '光学',     color: '#a855f7', icon: 'fas fa-lightbulb' },
        'acoustics':    { label: '声学',     color: '#ec4899', icon: 'fas fa-music' },
        'astrophysics': { label: '天体物理', color: '#06b6d4', icon: 'fas fa-globe-asia' },
        'others':       { label: '综合实验', color: '#94a3b8', icon: 'fas fa-flask' }
    };
    return map[cat] || map['others'];
}