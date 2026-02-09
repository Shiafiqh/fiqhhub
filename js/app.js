// FiqhHub — Main Application Logic
// Encyclopedia of Shia Islamic Jurisprudence
(function(){
'use strict';

// ============================================================
// DATA AGGREGATION
// ============================================================
const MARAJA = window.MARAJA || [];
const CATEGORIES = window.CATEGORIES || [];

// Aggregate all fatwa arrays
const ALL_FATWAS = [].concat(
    window.FATWAS_TAHARAT||[], window.FATWAS_SALAT||[], window.FATWAS_SAWM||[],
    window.FATWAS_HAJJ||[], window.FATWAS_KHUMS||[], window.FATWAS_ZAKAT||[],
    window.FATWAS_NIKAH||[], window.FATWAS_TALAQ||[], window.FATWAS_TRADE||[],
    window.FATWAS_FOOD||[], window.FATWAS_CLOTHING||[], window.FATWAS_MUSIC||[],
    window.FATWAS_MEDICAL||[], window.FATWAS_DIGITAL||[], window.FATWAS_BANKING||[],
    window.FATWAS_DEATH||[], window.FATWAS_JIHAD||[], window.FATWAS_JUDICIARY||[],
    window.FATWAS_INHERITANCE||[], window.FATWAS_OATHS||[], window.FATWAS_WAQF||[],
    window.FATWAS_CUSTODY||[], window.FATWAS_TAQLID||[], window.FATWAS_AMR||[],
    window.FATWAS_HUNTING||[], window.FATWAS_IJARAH||[], window.FATWAS_INTERACTION||[],
    window.FATWAS_MISC||[], window.FATWAS_QURAN||[]
);

console.log(`FiqhHub loaded: ${MARAJA.length} Maraja, ${CATEGORIES.length} Categories, ${ALL_FATWAS.length} Fatwas`);

// ============================================================
// HELPERS
// ============================================================
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const app = () => $('#app');

function getMarja(id) { return MARAJA.find(m => m.id === id); }
function getCat(id) { return CATEGORIES.find(c => c.id === id); }
function getFatwasByCat(cat) { return ALL_FATWAS.filter(f => f.cat === cat); }
function getFatwasByMarja(mId) { return ALL_FATWAS.filter(f => f.marja === mId); }
function escH(s) { const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

function marjaColor(id) {
    const m = getMarja(id);
    return m ? m.color : '#0d7c45';
}

function marjaName(id) {
    const m = getMarja(id);
    return m ? m.name : id;
}

// Group fatwas by question to show comparative answers
function groupByQuestion(fatwas) {
    const map = {};
    fatwas.forEach(f => {
        const key = f.q.trim().toLowerCase();
        if (!map[key]) map[key] = { q: f.q, sub: f.sub, answers: [], tags: f.tags || [] };
        map[key].answers.push({ marja: f.marja, a: f.a, source: f.source, id: f.id });
    });
    return Object.values(map);
}

// ============================================================
// ROUTER
// ============================================================
function route() {
    const hash = location.hash || '#/';
    const parts = hash.replace('#/', '').split('/');
    const page = parts[0] || 'home';
    const param = parts[1] || '';
    const param2 = parts[2] || '';

    // Update active nav
    $$('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
    // Close mobile menu
    $('#mobile-menu')?.classList.add('hidden');

    window.scrollTo(0, 0);

    switch(page) {
        case 'home': renderHome(); break;
        case 'maraja': param ? renderMarjaDetail(param) : renderMarajaList(); break;
        case 'categories': param ? renderCategoryDetail(param) : renderCategoriesList(); break;
        case 'browse': renderBrowse(); break;
        case 'compare': renderCompare(); break;
        case 'ask': renderAskAI(); break;
        case 'fatwa': renderFatwaDetail(param); break;
        case 'marja-fatwas': renderMarjaFatwas(param, param2); break;
        default: renderHome();
    }
}

// ============================================================
// PAGE: HOME
// ============================================================
function renderHome() {
    const catCards = CATEGORIES.slice(0, 12).map(c => {
        const count = getFatwasByCat(c.id).length;
        return `<a href="#/categories/${c.id}" class="cat-card">
            <span class="cat-icon">${c.icon}</span>
            <h3>${escH(c.name)}</h3>
            <p>${escH(c.nameAr)}</p>
            <span class="cat-count">${count} rulings</span>
        </a>`;
    }).join('');

    const marjaCards = MARAJA.slice(0, 5).map(m => {
        const count = getFatwasByMarja(m.id).length;
        return `<a href="#/maraja/${m.id}" class="marja-card" style="border-left:4px solid ${m.color}">
            <div class="marja-card-info">
                <h3>${escH(m.name)}</h3>
                <p class="marja-card-ar">${escH(m.nameAr)}</p>
                <p class="marja-card-loc">${escH(m.location)}</p>
                <span class="marja-card-count">${count} fatwas</span>
            </div>
        </a>`;
    }).join('');

    const stats = {
        fatwas: ALL_FATWAS.length,
        maraja: MARAJA.length,
        cats: CATEGORIES.length,
        topics: new Set(ALL_FATWAS.map(f => f.sub)).size
    };

    app().innerHTML = `
    <section class="hero">
        <div class="hero-inner">
            <h1 class="hero-ar">بسم الله الرحمن الرحيم</h1>
            <h2 class="hero-title">FiqhHub</h2>
            <p class="hero-sub">The Comprehensive Encyclopedia of Shia Islamic Jurisprudence</p>
            <p class="hero-desc">Explore ${stats.fatwas} authentic rulings from ${stats.maraja} Grand Ayatollahs across ${stats.cats} categories of Islamic law. Compare opinions, understand reasoning, and deepen your knowledge of Shia fiqh.</p>
            <div class="hero-stats">
                <div class="stat"><span class="stat-num">${stats.fatwas}</span><span class="stat-label">Fatwas</span></div>
                <div class="stat"><span class="stat-num">${stats.maraja}</span><span class="stat-label">Maraja'</span></div>
                <div class="stat"><span class="stat-num">${stats.cats}</span><span class="stat-label">Categories</span></div>
                <div class="stat"><span class="stat-num">${stats.topics}</span><span class="stat-label">Topics</span></div>
            </div>
            <div class="hero-actions">
                <a href="#/browse" class="btn btn-primary">Browse All Fatwas</a>
                <a href="#/compare" class="btn btn-outline">Compare Rulings</a>
                <a href="#/ask" class="btn btn-ai">Ask AI Scholar</a>
            </div>
        </div>
    </section>
    <section class="section">
        <h2 class="section-title">Featured Categories</h2>
        <div class="cat-grid">${catCards}</div>
        <div class="section-more"><a href="#/categories" class="btn btn-outline">View All ${CATEGORIES.length} Categories →</a></div>
    </section>
    <section class="section section-alt">
        <h2 class="section-title">Grand Ayatollahs (Maraja' al-Taqlid)</h2>
        <div class="marja-list">${marjaCards}</div>
        <div class="section-more"><a href="#/maraja" class="btn btn-outline">View All ${MARAJA.length} Maraja' →</a></div>
    </section>
    <section class="section">
        <h2 class="section-title">How to Use FiqhHub</h2>
        <div class="how-grid">
            <div class="how-card"><span class="how-icon">📖</span><h3>Browse</h3><p>Explore fatwas by category or marja. Each ruling includes the source risalah reference.</p></div>
            <div class="how-card"><span class="how-icon">⚖️</span><h3>Compare</h3><p>See how different Maraja' rule on the same question side-by-side.</p></div>
            <div class="how-card"><span class="how-icon">🔍</span><h3>Search</h3><p>Find specific rulings instantly using the global search bar.</p></div>
            <div class="how-card"><span class="how-icon">🤖</span><h3>Ask AI</h3><p>Get AI-powered explanations of complex fiqhi concepts and rulings.</p></div>
        </div>
    </section>`;
}

// ============================================================
// PAGE: MARAJA LIST
// ============================================================
function renderMarajaList() {
    const cards = MARAJA.map(m => {
        const count = getFatwasByMarja(m.id).length;
        return `<a href="#/maraja/${m.id}" class="marja-full-card" style="--marja-color:${m.color}">
            <div class="marja-full-header" style="background:${m.color}">
                <h2>${escH(m.name)}</h2>
                <p class="marja-ar">${escH(m.nameAr)}</p>
            </div>
            <div class="marja-full-body">
                <p><strong>Born:</strong> ${m.birthYear}, ${escH(m.birthPlace)}</p>
                <p><strong>Location:</strong> ${escH(m.location)}</p>
                <p><strong>Hawza:</strong> ${escH(m.hawza)}</p>
                <p><strong>Followers:</strong> ${escH(m.followers)}</p>
                <p class="marja-bio-preview">${escH(m.bio.substring(0, 200))}...</p>
                <div class="marja-full-footer">
                    <span class="marja-fatwa-count">${count} fatwas</span>
                    <span class="marja-view-link">View Profile →</span>
                </div>
            </div>
        </a>`;
    }).join('');

    app().innerHTML = `
    <section class="page-header">
        <h1>Grand Ayatollahs (Maraja' al-Taqlid)</h1>
        <p>مراجع التقليد</p>
        <p class="page-desc">Explore the profiles, approaches, and rulings of the foremost Shia scholars of Islamic jurisprudence.</p>
    </section>
    <section class="section">
        <div class="marja-grid">${cards}</div>
    </section>`;
}

// ============================================================
// PAGE: MARJA DETAIL
// ============================================================
function renderMarjaDetail(id) {
    const m = getMarja(id);
    if (!m) { app().innerHTML = '<div class="error-page"><h2>Marja not found</h2><a href="#/maraja">← Back to Maraja</a></div>'; return; }

    const fatwas = getFatwasByMarja(id);
    const catMap = {};
    fatwas.forEach(f => { const c = getCat(f.cat); catMap[f.cat] = (catMap[f.cat]||0) + 1; });

    const catLinks = Object.entries(catMap).map(([cid, count]) => {
        const c = getCat(cid);
        return c ? `<a href="#/marja-fatwas/${id}/${cid}" class="marja-cat-link"><span>${c.icon} ${escH(c.name)}</span><span class="badge">${count}</span></a>` : '';
    }).join('');

    const recentFatwas = fatwas.slice(0, 6).map(f => fatwaCard(f)).join('');

    app().innerHTML = `
    <section class="marja-profile" style="--marja-color:${m.color}">
        <div class="marja-profile-header" style="background:linear-gradient(135deg, ${m.color}, ${m.color}cc)">
            <a href="#/maraja" class="back-link">← All Maraja'</a>
            <h1>${escH(m.name)}</h1>
            <p class="marja-ar-large">${escH(m.nameAr)}</p>
            <div class="marja-meta">
                <span>📍 ${escH(m.location)}</span>
                <span>🎓 ${escH(m.hawza)}</span>
                <span>📅 Born ${m.birthYear}</span>
                <span>📚 ${fatwas.length} fatwas in database</span>
            </div>
        </div>
        <div class="marja-profile-body">
            <div class="marja-section">
                <h2>Biography</h2>
                <p>${escH(m.bio)}</p>
            </div>
            <div class="marja-section">
                <h2>Jurisprudential Approach</h2>
                <p>${escH(m.approach)}</p>
            </div>
            <div class="marja-section">
                <h2>Key Details</h2>
                <div class="detail-grid">
                    <div><strong>Full Name:</strong> ${escH(m.fullName)}</div>
                    <div><strong>Teachers:</strong> ${m.teachers.map(t => escH(t)).join(', ')}</div>
                    <div><strong>Major Works:</strong> ${m.works.map(w => escH(w)).join(', ')}</div>
                    <div><strong>Followers:</strong> ${escH(m.followers)}</div>
                </div>
            </div>
            <div class="marja-section">
                <h2>Fatwas by Category</h2>
                <div class="marja-cat-grid">${catLinks}</div>
            </div>
            <div class="marja-section">
                <h2>Recent Fatwas</h2>
                <div class="fatwa-list">${recentFatwas}</div>
                ${fatwas.length > 6 ? `<a href="#/marja-fatwas/${id}" class="btn btn-outline">View All ${fatwas.length} Fatwas →</a>` : ''}
            </div>
        </div>
    </section>`;
    attachFatwaListeners();
}

// ============================================================
// PAGE: MARJA FATWAS
// ============================================================
function renderMarjaFatwas(marjaId, catId) {
    const m = getMarja(marjaId);
    if (!m) { app().innerHTML = '<div class="error-page"><h2>Marja not found</h2></div>'; return; }

    let fatwas = getFatwasByMarja(marjaId);
    let title = `All Fatwas by ${m.name}`;
    if (catId) {
        fatwas = fatwas.filter(f => f.cat === catId);
        const c = getCat(catId);
        title = `${c ? c.name : catId} — ${m.name}`;
    }

    const cards = fatwas.map(f => fatwaCard(f)).join('');

    app().innerHTML = `
    <section class="page-header" style="background:linear-gradient(135deg, ${m.color}, ${m.color}cc)">
        <a href="#/maraja/${marjaId}" class="back-link">← ${escH(m.name)}'s Profile</a>
        <h1>${escH(title)}</h1>
        <p>${fatwas.length} rulings</p>
    </section>
    <section class="section">
        <div class="fatwa-list">${cards}</div>
    </section>`;
    attachFatwaListeners();
}

// ============================================================
// PAGE: CATEGORIES LIST
// ============================================================
function renderCategoriesList() {
    const cards = CATEGORIES.map(c => {
        const count = getFatwasByCat(c.id).length;
        return `<a href="#/categories/${c.id}" class="cat-card-full">
            <span class="cat-icon-large">${c.icon}</span>
            <div class="cat-card-info">
                <h3>${escH(c.name)}</h3>
                <p class="cat-ar">${escH(c.nameAr)}</p>
                <p class="cat-desc">${escH(c.description)}</p>
                <span class="cat-count">${count} rulings</span>
            </div>
        </a>`;
    }).join('');

    app().innerHTML = `
    <section class="page-header">
        <h1>Categories of Islamic Law</h1>
        <p>أبواب الفقه الإسلامي</p>
        <p class="page-desc">${CATEGORIES.length} categories covering all aspects of Islamic jurisprudence.</p>
    </section>
    <section class="section">
        <div class="cat-list-full">${cards}</div>
    </section>`;
}

// ============================================================
// PAGE: CATEGORY DETAIL
// ============================================================
function renderCategoryDetail(catId) {
    const c = getCat(catId);
    if (!c) { app().innerHTML = '<div class="error-page"><h2>Category not found</h2><a href="#/categories">← Categories</a></div>'; return; }

    const fatwas = getFatwasByCat(catId);
    const grouped = groupByQuestion(fatwas);

    // Get unique subcategories
    const subs = [...new Set(fatwas.map(f => f.sub))];
    const subFilters = subs.map(s => `<button class="filter-btn sub-filter" data-sub="${escH(s)}">${escH(s)}</button>`).join('');

    // Get unique marjas in this category
    const marjasInCat = [...new Set(fatwas.map(f => f.marja))];
    const marjaFilters = marjasInCat.map(mId => {
        const m = getMarja(mId);
        return m ? `<button class="filter-btn marja-filter" data-marja="${mId}" style="--fc:${m.color}">${escH(m.name)}</button>` : '';
    }).join('');

    const cards = fatwas.map(f => fatwaCard(f)).join('');

    app().innerHTML = `
    <section class="page-header">
        <a href="#/categories" class="back-link">← All Categories</a>
        <span class="page-icon">${c.icon}</span>
        <h1>${escH(c.name)}</h1>
        <p>${escH(c.nameAr)}</p>
        <p class="page-desc">${escH(c.description)}</p>
        <p class="page-count">${fatwas.length} rulings from ${marjasInCat.length} Maraja' across ${subs.length} subtopics</p>
    </section>
    <section class="section">
        <div class="filters-bar">
            <div class="filter-group">
                <label>Subtopic:</label>
                <button class="filter-btn sub-filter active" data-sub="all">All</button>
                ${subFilters}
            </div>
            <div class="filter-group">
                <label>Marja:</label>
                <button class="filter-btn marja-filter active" data-marja="all">All</button>
                ${marjaFilters}
            </div>
        </div>
        <div class="fatwa-list" id="filtered-fatwas">${cards}</div>
    </section>`;

    attachFatwaListeners();
    attachFilterListeners(catId);
}

// ============================================================
// PAGE: BROWSE ALL
// ============================================================
function renderBrowse() {
    let currentPage = 1;
    const perPage = 30;
    let filtered = [...ALL_FATWAS];

    function render() {
        const start = (currentPage - 1) * perPage;
        const pageItems = filtered.slice(start, start + perPage);
        const totalPages = Math.ceil(filtered.length / perPage);

        const catOptions = CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        const marjaOptions = MARAJA.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

        const cards = pageItems.map(f => fatwaCard(f)).join('');

        app().innerHTML = `
        <section class="page-header">
            <h1>Browse All Fatwas</h1>
            <p>${ALL_FATWAS.length} rulings in the database</p>
        </section>
        <section class="section">
            <div class="browse-controls">
                <select id="browse-cat"><option value="">All Categories</option>${catOptions}</select>
                <select id="browse-marja"><option value="">All Maraja'</option>${marjaOptions}</select>
                <input type="text" id="browse-search" placeholder="Filter by keyword...">
            </div>
            <p class="browse-showing">Showing ${start + 1}–${Math.min(start + perPage, filtered.length)} of ${filtered.length}</p>
            <div class="fatwa-list">${cards}</div>
            <div class="pagination">
                ${currentPage > 1 ? '<button class="btn-page" id="prev-page">← Previous</button>' : ''}
                <span class="page-info">Page ${currentPage} of ${totalPages}</span>
                ${currentPage < totalPages ? '<button class="btn-page" id="next-page">Next →</button>' : ''}
            </div>
        </section>`;

        attachFatwaListeners();

        // Pagination
        $('#prev-page')?.addEventListener('click', () => { currentPage--; render(); window.scrollTo(0,200); });
        $('#next-page')?.addEventListener('click', () => { currentPage++; render(); window.scrollTo(0,200); });

        // Filters
        const applyFilters = () => {
            const cat = $('#browse-cat').value;
            const marja = $('#browse-marja').value;
            const kw = $('#browse-search').value.toLowerCase().trim();
            filtered = ALL_FATWAS.filter(f => {
                if (cat && f.cat !== cat) return false;
                if (marja && f.marja !== marja) return false;
                if (kw && !f.q.toLowerCase().includes(kw) && !f.a.toLowerCase().includes(kw) && !(f.tags||[]).some(t => t.includes(kw))) return false;
                return true;
            });
            currentPage = 1;
            render();
        };
        $('#browse-cat')?.addEventListener('change', applyFilters);
        $('#browse-marja')?.addEventListener('change', applyFilters);
        let debounce;
        $('#browse-search')?.addEventListener('input', () => { clearTimeout(debounce); debounce = setTimeout(applyFilters, 300); });
    }
    render();
}

// ============================================================
// PAGE: COMPARE
// ============================================================
function renderCompare() {
    // Find questions with multiple marja answers
    const grouped = groupByQuestion(ALL_FATWAS).filter(g => g.answers.length > 1).sort((a,b) => b.answers.length - a.answers.length);

    const topicSelect = CATEGORIES.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    let displayGrouped = grouped.slice(0, 20);

    function renderResults(items) {
        return items.map(g => {
            const answerCards = g.answers.map(ans => {
                const m = getMarja(ans.marja);
                return `<div class="compare-answer" style="border-left:4px solid ${m ? m.color : '#666'}">
                    <div class="compare-answer-header"><strong>${marjaName(ans.marja)}</strong></div>
                    <p>${escH(ans.a)}</p>
                    <small class="compare-source">📖 ${escH(ans.source)}</small>
                </div>`;
            }).join('');
            return `<div class="compare-group">
                <h3 class="compare-question">❓ ${escH(g.q)}</h3>
                <span class="compare-topic">${escH(g.sub)}</span>
                <div class="compare-answers">${answerCards}</div>
            </div>`;
        }).join('');
    }

    app().innerHTML = `
    <section class="page-header">
        <h1>Compare Rulings ⚖️</h1>
        <p>See how different Maraja' answer the same questions</p>
    </section>
    <section class="section">
        <div class="compare-filters">
            <select id="compare-cat"><option value="">All Categories</option>${topicSelect}</select>
        </div>
        <div id="compare-results">${renderResults(displayGrouped)}</div>
    </section>`;

    $('#compare-cat')?.addEventListener('change', (e) => {
        const catId = e.target.value;
        let items = grouped;
        if (catId) {
            const catFatwas = getFatwasByCat(catId);
            items = groupByQuestion(catFatwas).filter(g => g.answers.length > 1);
        }
        $('#compare-results').innerHTML = renderResults(items.slice(0, 30));
    });
}

// ============================================================
// PAGE: ASK AI
// ============================================================
function renderAskAI() {
    app().innerHTML = `
    <section class="page-header">
        <h1>🕌 AI Fiqh Scholar</h1>
        <p>Ask questions about Shia Islamic jurisprudence • Powered by AI</p>
    </section>
    <section class="section ai-full-page">
        <div class="ai-fullchat" id="ai-fullchat">
            <div class="ai-messages-full" id="ai-messages-full">
                <div class="ai-msg ai-msg-bot">
                    <p>Assalamu Alaikum! I'm your AI Fiqh research assistant. Ask me anything about Shia Islamic jurisprudence. I'll reference the Maraja' database and provide scholarly context.</p>
                    <p class="ai-disclaimer">⚠️ Educational information only. For binding rulings, refer to your Marja's official risalah.</p>
                </div>
            </div>
            <div class="ai-suggestions-full" id="ai-suggestions-full">
                <button class="ai-suggestion" data-q="What are the conditions for valid wudu according to Sistani?">Wudu conditions</button>
                <button class="ai-suggestion" data-q="Compare music rulings across the major Maraja">Music comparison</button>
                <button class="ai-suggestion" data-q="Is cryptocurrency permissible in Shia fiqh?">Crypto ruling</button>
                <button class="ai-suggestion" data-q="Explain the concept of ihtiyat wajib vs fatwa">Ihtiyat explained</button>
                <button class="ai-suggestion" data-q="What are the differences between Shia and Sunni prayer?">Shia-Sunni prayer</button>
                <button class="ai-suggestion" data-q="What is the ruling on organ donation?">Organ donation</button>
            </div>
            <div class="ai-input-row-full">
                <input type="text" id="ai-input-full" placeholder="Ask about any fiqh topic...">
                <button id="ai-send-full" class="btn btn-primary">Send</button>
            </div>
        </div>
    </section>`;

    // Send handlers
    const sendMsg = () => {
        const input = $('#ai-input-full');
        const q = input.value.trim();
        if (!q) return;
        input.value = '';
        $('#ai-suggestions-full').style.display = 'none';
        addAiMessage(q, 'user', '#ai-messages-full');
        askAI(q, '#ai-messages-full');
    };

    $('#ai-send-full')?.addEventListener('click', sendMsg);
    $('#ai-input-full')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });

    // Suggestions
    $$('#ai-suggestions-full .ai-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            $('#ai-input-full').value = btn.dataset.q;
            sendMsg();
        });
    });
}

// ============================================================
// FATWA CARD COMPONENT
// ============================================================
function fatwaCard(f) {
    const m = getMarja(f.marja);
    const c = getCat(f.cat);
    const tags = (f.tags || []).map(t => `<span class="tag">${escH(t)}</span>`).join('');
    return `<div class="fatwa-card" data-id="${f.id}" data-cat="${f.cat}" data-marja="${f.marja}">
        <div class="fatwa-card-header">
            <span class="fatwa-marja-badge" style="background:${m ? m.color : '#555'}">${marjaName(f.marja)}</span>
            <span class="fatwa-cat-badge">${c ? c.icon : '📋'} ${c ? escH(c.name) : f.cat}</span>
            <span class="fatwa-sub">${escH(f.sub)}</span>
        </div>
        <h3 class="fatwa-question">${escH(f.q)}</h3>
        <div class="fatwa-answer-preview">${escH(f.a.substring(0, 180))}${f.a.length > 180 ? '...' : ''}</div>
        <div class="fatwa-answer-full hidden">${escH(f.a)}</div>
        <div class="fatwa-card-footer">
            <span class="fatwa-source">📖 ${escH(f.source)}</span>
            <div class="fatwa-tags">${tags}</div>
            <div class="fatwa-actions">
                <button class="fatwa-expand-btn">Read Full ▾</button>
                <button class="fatwa-ai-btn" data-fid="${f.id}" title="Ask AI about this ruling">🤖 Ask AI</button>
            </div>
        </div>
    </div>`;
}

function attachFatwaListeners() {
    $$('.fatwa-expand-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.fatwa-card');
            const preview = card.querySelector('.fatwa-answer-preview');
            const full = card.querySelector('.fatwa-answer-full');
            if (full.classList.contains('hidden')) {
                full.classList.remove('hidden');
                preview.classList.add('hidden');
                this.textContent = 'Show Less ▴';
            } else {
                full.classList.add('hidden');
                preview.classList.remove('hidden');
                this.textContent = 'Read Full ▾';
            }
        });
    });
    // Ask AI about this fatwa
    $$('.fatwa-ai-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const fid = this.dataset.fid;
            const fatwa = ALL_FATWAS.find(f => f.id === fid);
            if (fatwa) openFatwaChat(fatwa);
        });
    });
}

function attachFilterListeners(catId) {
    $$('.sub-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            $$('.sub-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyPageFilters(catId);
        });
    });
    $$('.marja-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            $$('.marja-filter').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyPageFilters(catId);
        });
    });
}

function applyPageFilters(catId) {
    const activeSub = document.querySelector('.sub-filter.active')?.dataset.sub || 'all';
    const activeMarja = document.querySelector('.marja-filter.active')?.dataset.marja || 'all';

    let fatwas = getFatwasByCat(catId);
    if (activeSub !== 'all') fatwas = fatwas.filter(f => f.sub === activeSub);
    if (activeMarja !== 'all') fatwas = fatwas.filter(f => f.marja === activeMarja);

    const container = $('#filtered-fatwas');
    if (container) {
        container.innerHTML = fatwas.length ? fatwas.map(f => fatwaCard(f)).join('') : '<p class="no-results">No fatwas match your filters.</p>';
        attachFatwaListeners();
    }
}

// ============================================================
// GLOBAL SEARCH
// ============================================================
function initSearch() {
    const input = $('#global-search');
    const dropdown = $('#search-results-dropdown');
    if (!input || !dropdown) return;

    let debounce;
    input.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            const q = input.value.trim().toLowerCase();
            if (q.length < 2) { dropdown.classList.add('hidden'); return; }

            const results = ALL_FATWAS.filter(f =>
                f.q.toLowerCase().includes(q) ||
                f.a.toLowerCase().includes(q) ||
                (f.tags||[]).some(t => t.includes(q))
            ).slice(0, 10);

            if (results.length === 0) {
                dropdown.innerHTML = '<div class="search-no-result">No results found</div>';
            } else {
                dropdown.innerHTML = results.map(f => {
                    const c = getCat(f.cat);
                    return `<a href="#/categories/${f.cat}" class="search-result-item" data-id="${f.id}">
                        <span class="search-marja" style="color:${marjaColor(f.marja)}">${marjaName(f.marja)}</span>
                        <span class="search-q">${escH(f.q.substring(0, 80))}</span>
                        <span class="search-cat">${c ? c.icon + ' ' + c.name : f.cat}</span>
                    </a>`;
                }).join('');
            }
            dropdown.classList.remove('hidden');
        }, 250);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-search')) dropdown.classList.add('hidden');
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const q = input.value.trim();
            if (q) { location.hash = '#/browse'; setTimeout(() => { const s = $('#browse-search'); if(s){s.value=q;s.dispatchEvent(new Event('input'));} }, 100); }
        }
    });
}

// ============================================================
// AI INTEGRATION (via backend proxy)
// ============================================================
const API_URL = (window.FIQHHUB_CONFIG && window.FIQHHUB_CONFIG.API_URL) || '';

function addAiMessage(text, role, containerSel) {
    const container = $(containerSel || '#ai-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = `ai-msg ai-msg-${role === 'user' ? 'user' : 'bot'}`;
    div.innerHTML = `<p>${escH(text)}</p>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function addAiMessageHTML(html, containerSel) {
    const container = $(containerSel || '#ai-messages');
    if (!container) return;
    const div = document.createElement('div');
    div.className = 'ai-msg ai-msg-bot';
    div.innerHTML = html;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function buildSystemPrompt(contextFatwas) {
    let context = '';
    if (contextFatwas && contextFatwas.length > 0) {
        context = '\n\nRelevant fatwas from the database:\n' + contextFatwas.map(f =>
            `[${marjaName(f.marja)}] Q: ${f.q}\nA: ${f.a}\nSource: ${f.source}`
        ).join('\n\n');
    }
    return `You are an AI assistant specializing in Shia Islamic jurisprudence (fiqh). You have access to a database of authentic fatwas from major Maraja' al-Taqlid including Ayatollahs Sistani, Khamenei, Shirazi, Makarem Shirazi, Wahid Khorasani, Noori Hamedani, Safi Golpaygani, Bashir Najafi, al-Hakim, and Tabrizi.

Guidelines:
- Provide accurate, scholarly responses about Shia fiqh
- Reference specific Maraja' and their positions when relevant
- Explain the reasoning (dalil) behind rulings when possible
- Note areas of scholarly agreement (ijma') and disagreement (ikhtilaf)
- Always clarify this is educational — users should consult their own Marja' for binding rulings
- Use Arabic terms with translations where appropriate
- Be respectful and balanced when discussing differences between scholars
- If the database has relevant fatwas, reference them in your answer
${context}`;
}

async function askAI(question, containerSel, contextFatwas) {
    // Find relevant fatwas for context if not provided
    if (!contextFatwas) {
        const qLower = question.toLowerCase();
        contextFatwas = ALL_FATWAS.filter(f =>
            f.q.toLowerCase().includes(qLower) ||
            f.a.toLowerCase().includes(qLower) ||
            (f.tags||[]).some(t => qLower.includes(t))
        ).slice(0, 8);
    }

    const systemPrompt = buildSystemPrompt(contextFatwas);

    // Show loading
    const loadingId = 'ai-loading-' + Date.now();
    const container = $(containerSel || '#ai-messages');
    if (!container) return;
    const loadDiv = document.createElement('div');
    loadDiv.id = loadingId;
    loadDiv.className = 'ai-msg ai-msg-bot ai-loading';
    loadDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    container.appendChild(loadDiv);
    container.scrollTop = container.scrollHeight;

    try {
        const response = await fetch(API_URL + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: question }
                ]
            })
        });

        const data = await response.json();
        document.getElementById(loadingId)?.remove();

        if (data.error) {
            addAiMessage(`Error: ${data.error}`, 'bot', containerSel);
            return;
        }

        const answer = data.answer || 'No response received.';
        const html = answer
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
        addAiMessageHTML(`<p>${html}</p>`, containerSel);

    } catch (err) {
        document.getElementById(loadingId)?.remove();
        addAiMessage(`Connection error: ${err.message}. Make sure the server is running.`, 'bot', containerSel);
    }
}

// ============================================================
// FATWA-SPECIFIC AI CHAT MODAL
// ============================================================
function openFatwaChat(fatwa) {
    // Remove existing modal if any
    document.getElementById('fatwa-chat-modal')?.remove();

    const m = getMarja(fatwa.marja);
    const c = getCat(fatwa.cat);

    // Find related fatwas for context (same question from different marjas + same sub-topic)
    const related = ALL_FATWAS.filter(f =>
        (f.q === fatwa.q || f.sub === fatwa.sub) && f.cat === fatwa.cat
    ).slice(0, 10);

    const suggestedQs = [
        `Explain this ruling in simpler terms`,
        `What is the dalil (evidence) for this ruling?`,
        `How do other Maraja' differ on this?`,
        `What are the exceptions to this ruling?`,
        `Can you give a practical example?`
    ];

    const suggestionsHTML = suggestedQs.map(q =>
        `<button class="fchat-suggestion" data-q="${escH(q)}">${escH(q)}</button>`
    ).join('');

    const modal = document.createElement('div');
    modal.id = 'fatwa-chat-modal';
    modal.className = 'fchat-overlay';
    modal.innerHTML = `
        <div class="fchat-modal">
            <div class="fchat-header" style="background:${m ? m.color : 'var(--emerald)'}">
                <div class="fchat-header-info">
                    <h3>🤖 Ask AI about this ruling</h3>
                    <p>${marjaName(fatwa.marja)} — ${c ? c.name : fatwa.cat} — ${escH(fatwa.sub)}</p>
                </div>
                <button class="fchat-close" id="fchat-close">✕</button>
            </div>
            <div class="fchat-context">
                <div class="fchat-q"><strong>Q:</strong> ${escH(fatwa.q)}</div>
                <div class="fchat-a"><strong>A:</strong> ${escH(fatwa.a.substring(0, 200))}${fatwa.a.length > 200 ? '...' : ''}</div>
            </div>
            <div class="fchat-messages" id="fchat-messages"></div>
            <div class="fchat-suggestions" id="fchat-suggestions">${suggestionsHTML}</div>
            <div class="fchat-input-row">
                <input type="text" id="fchat-input" placeholder="Ask anything about this ruling...">
                <button id="fchat-send">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Close
    $('#fchat-close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    // Send
    const sendFatwaQ = () => {
        const input = $('#fchat-input');
        const q = input.value.trim();
        if (!q) return;
        input.value = '';
        $('#fchat-suggestions')?.remove();
        addAiMessage(q, 'user', '#fchat-messages');
        // Prepend fatwa context to the question
        const fullQ = `Regarding this specific ruling by ${marjaName(fatwa.marja)}:\n\nQuestion: ${fatwa.q}\nAnswer: ${fatwa.a}\n\nUser asks: ${q}`;
        askAI(fullQ, '#fchat-messages', related);
    };

    $('#fchat-send').addEventListener('click', sendFatwaQ);
    $('#fchat-input').addEventListener('keydown', e => { if (e.key === 'Enter') sendFatwaQ(); });

    // Suggestions
    $$('.fchat-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            $('#fchat-input').value = btn.dataset.q;
            sendFatwaQ();
        });
    });

    $('#fchat-input').focus();
}

// ============================================================
// FLOATING AI PANEL
// ============================================================
function initAIPanel() {
    const fab = $('#ai-fab');
    const panel = $('#ai-panel');
    const close = $('#ai-panel-close');

    fab?.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
            $('#ai-input')?.focus();
        }
    });
    close?.addEventListener('click', () => panel.classList.add('hidden'));

    // Panel send
    const sendPanel = () => {
        const input = $('#ai-input');
        const q = input.value.trim();
        if (!q) return;
        input.value = '';
        $('#ai-suggestions')?.remove();
        addAiMessage(q, 'user', '#ai-messages');
        askAI(q, '#ai-messages');
    };
    $('#ai-send')?.addEventListener('click', sendPanel);
    $('#ai-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') sendPanel(); });

    // Panel suggestions
    $$('#ai-suggestions .ai-suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            $('#ai-input').value = btn.dataset.q;
            sendPanel();
        });
    });
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobile() {
    $('#mobile-menu-btn')?.addEventListener('click', () => {
        $('#mobile-menu').classList.toggle('hidden');
    });
    $$('.mobile-link').forEach(l => {
        l.addEventListener('click', () => $('#mobile-menu').classList.add('hidden'));
    });
}

// ============================================================
// INIT
// ============================================================
function init() {
    route();
    initSearch();
    initAIPanel();
    initMobile();
    window.addEventListener('hashchange', route);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

})();
