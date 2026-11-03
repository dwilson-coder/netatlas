// ============================================================
// NetAtlas - Topic navigation, dashboard & flash-card decks
// (OSI Flow carousel lives in script.js and is left untouched)
// ============================================================

(function () {

const { CATEGORIES, LEVELS, TOPICS } = window.NetAtlasData;
const Core = window.NetAtlasCore;
const esc = Core.escapeHTML;

function safeStorage() {
    try {
        return window.localStorage;
    } catch (e) {
        return null;
    }
}

const progress = Core.createProgressStore(safeStorage());
const topicById = id => TOPICS.find(t => t.id === id);
const DEFAULT_TITLE = document.title;
const MAX_CARD_HITS = 30;

const dashboard = { query: '', category: 'all' };

// Active deck: { topic, filter, shuffled, order: [cardIndex], pos, revealed }
let deck = null;

// ============================================================
// Shared render helpers
// ============================================================

function levelBadge(level) {
    const l = LEVELS[level];
    return `<span class="inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold ${l.className}">${l.name}</span>`;
}

function statusBadge(status) {
    if (status === 'known') return '<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400">✓ Known</span>';
    if (status === 'review') return '<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400">↻ Needs review</span>';
    return '';
}

function topicBadge(topic, size = 'w-10 h-10 text-sm') {
    return `<div class="${size} rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0" aria-hidden="true">${esc(topic.short)}</div>`;
}

function progressBar(stats) {
    const pct = stats.total ? Math.round((stats.known / stats.total) * 100) : 0;
    return `
        <div class="h-1.5 rounded-full bg-slate-700/50 overflow-hidden" aria-hidden="true">
            <div class="h-full rounded-full bg-gradient-to-r from-osi-cyan to-osi-violet transition-all" style="width:${pct}%"></div>
        </div>`;
}

function progressText(stats) {
    return `${stats.known} of ${stats.total} known${stats.review ? ` · ${stats.review} to review` : ''}`;
}

function plural(n, word) {
    return `${n} ${word}${n === 1 ? '' : 's'}`;
}

const ICONS = {
    search: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"/></svg>',
    left: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>',
    right: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>',
    chevron: '<svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>'
};

// ============================================================
// Dashboard (home view)
// ============================================================

function renderDashboardShell() {
    const root = document.getElementById('topic-dashboard');
    root.innerHTML = `
        <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-5">
            <div>
                <h2 id="topics-heading" class="text-xl sm:text-2xl font-bold gradient-text">Explore topics</h2>
                <p id="overall-progress" class="text-sm text-slate-400 mt-1"></p>
            </div>
            <div class="w-full md:w-80">
                <label for="topic-search" class="sr-only">Search topics and flash cards</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">${ICONS.search}</span>
                    <input id="topic-search" type="search" autocomplete="off" spellcheck="false"
                           placeholder="Search topics & cards (e.g. 443, OSPF)"
                           class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-osi-card border border-osi-border text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-osi-cyan transition-colors">
                </div>
            </div>
        </div>
        <div role="group" aria-label="Filter by category" class="flex flex-wrap gap-2 mb-6">
            ${[{ id: 'all', name: 'All topics' }, ...CATEGORIES].map(c => `
                <button type="button" class="filter-chip" data-category="${c.id}" aria-pressed="${c.id === dashboard.category}">${esc(c.name)}</button>
            `).join('')}
        </div>
        <p id="topic-results-status" class="sr-only" aria-live="polite"></p>
        <div id="topic-results"></div>
    `;

    const search = document.getElementById('topic-search');
    search.addEventListener('input', () => {
        dashboard.query = search.value.trim();
        renderDashboardResults(true);
    });

    root.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            dashboard.category = btn.dataset.category;
            root.querySelectorAll('[data-category]').forEach(b => {
                b.setAttribute('aria-pressed', String(b === btn));
            });
            renderDashboardResults(true);
        });
    });
}

function topicCardHTML(topic, matchCount) {
    const stats = progress.stats(topic);
    return `
        <li>
            <a href="${Core.topicHref(topic.id)}" class="card-glow flex flex-col h-full bg-osi-card border border-osi-border rounded-2xl p-5">
                <div class="flex items-start justify-between gap-3 mb-3">
                    ${topicBadge(topic)}
                    ${levelBadge(topic.level)}
                </div>
                <h4 class="text-base font-bold text-white mb-1">${esc(topic.title)}</h4>
                <p class="text-sm text-slate-400 leading-relaxed mb-4 flex-1">${esc(topic.summary)}</p>
                ${matchCount ? `<p class="text-xs text-osi-cyan mb-2">${plural(matchCount, 'matching card')}</p>` : ''}
                ${progressBar(stats)}
                <p class="text-xs text-slate-500 mt-2">${progressText(stats)}</p>
            </a>
        </li>`;
}

function renderDashboardResults(announce = false) {
    const container = document.getElementById('topic-results');
    if (!container) return;

    const totals = TOPICS.reduce((acc, t) => {
        const s = progress.stats(t);
        acc.known += s.known;
        acc.total += s.total;
        return acc;
    }, { known: 0, total: 0 });
    document.getElementById('overall-progress').textContent =
        `${TOPICS.length} topics · ${totals.total} flash cards · ${totals.known} known`;

    const results = Core.searchTopics(TOPICS, dashboard.query)
        .filter(r => dashboard.category === 'all' || r.topic.category === dashboard.category);
    const cardHits = results.flatMap(r => r.cards.map(card => ({ topic: r.topic, card })));
    const gridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';

    if (!results.length) {
        container.innerHTML = `
            <div class="bg-osi-card border border-osi-border rounded-2xl p-8 text-center text-sm text-slate-400">
                No topics or cards match “${esc(dashboard.query)}”.
            </div>`;
    } else if (!dashboard.query) {
        // Grouped by category
        container.innerHTML = CATEGORIES
            .filter(cat => results.some(r => r.topic.category === cat.id))
            .map(cat => `
                <div class="mb-10">
                    <h3 class="text-sm font-semibold text-white">${esc(cat.name)}</h3>
                    <p class="text-xs text-slate-500 mb-4">${esc(cat.description)}</p>
                    <ul class="${gridClass}">
                        ${results.filter(r => r.topic.category === cat.id).map(r => topicCardHTML(r.topic)).join('')}
                    </ul>
                </div>`).join('');
    } else {
        container.innerHTML = `
            <ul class="${gridClass}">
                ${results.map(r => topicCardHTML(r.topic, r.cards.length)).join('')}
            </ul>
            ${cardHits.length ? `
                <h3 class="text-sm font-semibold text-white mt-10 mb-3">Matching flash cards</h3>
                <ul class="space-y-2">
                    ${cardHits.slice(0, MAX_CARD_HITS).map(({ topic, card }) => `
                        <li>
                            <a href="${Core.topicHref(topic.id, card.id)}" class="block p-3 rounded-xl bg-osi-card/60 border border-osi-border hover:border-osi-cyan/50 transition-colors">
                                <span class="block text-[11px] font-medium text-slate-500 mb-0.5">${esc(topic.title)}</span>
                                <span class="block text-sm text-slate-200">${esc(card.q)}</span>
                            </a>
                        </li>`).join('')}
                </ul>
                ${cardHits.length > MAX_CARD_HITS ? `<p class="text-xs text-slate-500 mt-3">Showing the first ${MAX_CARD_HITS} of ${cardHits.length} cards. Refine your search to see more.</p>` : ''}
            ` : ''}`;
    }

    if (announce) {
        document.getElementById('topic-results-status').textContent = dashboard.query
            ? `${plural(results.length, 'topic')} and ${plural(cardHits.length, 'card')} match.`
            : `Showing ${plural(results.length, 'topic')}.`;
    }
}

// ============================================================
// Topic view
// ============================================================

function topicNavHTML(currentId) {
    return CATEGORIES.map(cat => `
        <div class="mb-5">
            <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2 px-2">${esc(cat.name)}</p>
            <ul class="space-y-0.5">
                ${TOPICS.filter(t => t.category === cat.id).map(t => {
                    const s = progress.stats(t);
                    const current = t.id === currentId;
                    return `
                        <li>
                            <a href="${Core.topicHref(t.id)}" class="topic-nav-link" ${current ? 'aria-current="page"' : ''}>
                                <span class="truncate">${esc(t.title)}</span>
                                <span class="text-[11px] text-slate-500 flex-shrink-0">${s.known}/${s.total}<span class="sr-only"> known</span></span>
                            </a>
                        </li>`;
                }).join('')}
            </ul>
        </div>`).join('');
}

function referenceHTML(topic) {
    if (!topic.reference || !topic.reference.length) return '';
    return `
        <section aria-labelledby="reference-heading" class="mb-12">
            <h2 id="reference-heading" class="text-lg font-bold text-white mb-4">Quick reference</h2>
            ${topic.reference.map(table => `
                <div class="mb-6">
                    <div class="overflow-x-auto rounded-xl border border-osi-border bg-osi-card">
                        <table class="ref-table ${table.columns.length > 3 ? 'ref-table-wide' : ''} w-full text-left text-sm">
                            <caption class="text-left px-4 pt-4 pb-2">
                                <span class="block font-semibold text-white">${esc(table.title)}</span>
                                ${table.caption ? `<span class="block text-xs text-slate-500 mt-1">${esc(table.caption)}</span>` : ''}
                            </caption>
                            <thead>
                                <tr>${table.columns.map(c => `<th scope="col">${esc(c)}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${table.rows.map(row => `
                                    <tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${esc(cell)}</th>` : `<td>${esc(cell)}</td>`).join('')}</tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    ${table.footnote ? `<p class="text-xs text-slate-500 mt-2">${esc(table.footnote)}</p>` : ''}
                </div>`).join('')}
        </section>`;
}

function relatedHTML(topic) {
    const related = (topic.related || []).map(topicById).filter(Boolean);
    if (!related.length) return '';
    return `
        <section aria-labelledby="related-heading" class="mb-12">
            <h2 id="related-heading" class="text-lg font-bold text-white mb-4">Related topics</h2>
            <ul class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                ${related.map(t => `
                    <li>
                        <a href="${Core.topicHref(t.id)}" class="card-glow flex items-center gap-3 h-full p-3 rounded-xl bg-osi-card border border-osi-border">
                            ${topicBadge(t, 'w-9 h-9 text-xs')}
                            <span class="min-w-0">
                                <span class="block text-sm font-semibold text-white">${esc(t.title)}</span>
                                <span class="block text-xs text-slate-500 truncate">${esc(t.summary)}</span>
                            </span>
                        </a>
                    </li>`).join('')}
            </ul>
        </section>`;
}

function sequenceHTML(topic) {
    const i = TOPICS.indexOf(topic);
    const prev = TOPICS[i - 1];
    const next = TOPICS[i + 1];
    const link = (t, label, align) => `
        <a href="${Core.topicHref(t.id)}" class="block p-4 rounded-xl border border-osi-border hover:border-osi-cyan/50 transition-colors ${align}">
            <span class="block text-xs text-slate-500">${label}</span>
            <span class="block text-sm font-semibold text-slate-200">${esc(t.title)}</span>
        </a>`;
    return `
        <nav aria-label="Topic sequence" class="grid grid-cols-2 gap-3 pt-6 border-t border-osi-border/50">
            <div>${prev ? link(prev, '← Previous topic', '') : ''}</div>
            <div>${next ? link(next, 'Next topic →', 'text-right') : ''}</div>
        </nav>`;
}

function osiLayersHTML(topic) {
    if (topic.id === 'osi-tcpip' || !topic.osiLayers) return '';
    return `
        <p class="flex flex-wrap items-center gap-1.5 mt-4 text-xs text-slate-500">
            <span>OSI layers:</span>
            ${topic.osiLayers.map(n => `<a href="${Core.topicHref('osi-tcpip')}" class="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-300 hover:text-osi-cyan transition-colors" aria-label="Layer ${n}, open the OSI and TCP/IP topic">L${n}</a>`).join('')}
        </p>`;
}

function renderTopicView(topic, cardId) {
    const view = document.getElementById('view-topic');
    const category = CATEGORIES.find(c => c.id === topic.category);

    view.innerHTML = `
        <div class="pt-24 pb-16 px-4">
            <div class="max-w-6xl mx-auto lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
                <aside class="hidden lg:block">
                    <nav aria-label="All topics" class="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2" data-topic-nav>
                        ${topicNavHTML(topic.id)}
                    </nav>
                </aside>

                <div class="min-w-0">
                    <details class="topic-drawer lg:hidden mb-6 bg-osi-card border border-osi-border rounded-xl">
                        <summary class="flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-300 cursor-pointer">
                            <span>All topics</span>${ICONS.chevron}
                        </summary>
                        <nav aria-label="All topics" class="px-2 pb-2" data-topic-nav>
                            ${topicNavHTML(topic.id)}
                        </nav>
                    </details>

                    <nav aria-label="Breadcrumb" class="mb-4">
                        <ol class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                            <li><a href="#topics" class="hover:text-osi-cyan transition-colors">Topics</a></li>
                            <li aria-hidden="true">/</li>
                            <li>${esc(category.name)}</li>
                            <li aria-hidden="true">/</li>
                            <li aria-current="page" class="text-slate-300">${esc(topic.title)}</li>
                        </ol>
                    </nav>

                    <header class="mb-8">
                        <div class="flex items-center gap-4 mb-4">
                            ${topicBadge(topic, 'w-12 h-12 text-base')}
                            <div>
                                <h1 id="topic-title" tabindex="-1" class="text-2xl sm:text-3xl font-extrabold text-white">${esc(topic.title)}</h1>
                                <div class="flex flex-wrap items-center gap-2 mt-1">
                                    ${levelBadge(topic.level)}
                                    <span class="text-xs text-slate-500" id="topic-progress-text"></span>
                                </div>
                            </div>
                        </div>
                        <p class="text-slate-400 leading-relaxed max-w-3xl">${esc(topic.description)}</p>
                        ${topic.id === 'osi-tcpip' ? `
                            <a href="#model" class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-osi-cyan hover:underline">
                                Open the OSI Flow layer explorer ${ICONS.right.replace('w-5 h-5', 'w-4 h-4')}
                            </a>` : ''}
                        ${osiLayersHTML(topic)}
                    </header>

                    <section aria-labelledby="deck-heading" class="mb-12">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <h2 id="deck-heading" class="text-lg font-bold text-white">Flash cards</h2>
                            <div class="flex flex-wrap items-center gap-2">
                                <div role="group" aria-label="Show cards" class="flex flex-wrap gap-2" id="deck-filters"></div>
                                <button type="button" class="filter-chip" id="deck-shuffle" aria-pressed="false">Shuffle</button>
                                <button type="button" class="text-xs text-slate-500 hover:text-rose-400 px-2 py-1.5 transition-colors" id="deck-reset">Reset progress</button>
                            </div>
                        </div>
                        <div class="mb-4" id="deck-progress"></div>
                        <div id="deck"></div>
                        <p id="deck-status" class="sr-only" aria-live="polite"></p>
                        <p class="hidden sm:block text-center text-xs text-slate-500 mt-4">
                            Keyboard: <kbd>←</kbd> <kbd>→</kbd> move · <kbd>Space</kbd> reveal · <kbd>K</kbd> got it · <kbd>R</kbd> needs review
                        </p>
                    </section>

                    ${referenceHTML(topic)}
                    ${relatedHTML(topic)}
                    ${sequenceHTML(topic)}
                </div>
            </div>
        </div>
    `;

    document.getElementById('deck-shuffle').addEventListener('click', () => {
        deck.shuffled = !deck.shuffled;
        document.getElementById('deck-shuffle').setAttribute('aria-pressed', String(deck.shuffled));
        setFilter(deck.filter);
        announce(deck.shuffled ? 'Cards shuffled.' : 'Cards back in order.');
    });

    document.getElementById('deck-reset').addEventListener('click', () => {
        if (!window.confirm(`Reset your progress for “${topic.title}”?`)) return;
        progress.resetTopic(topic.id);
        refreshProgressUI();
        setFilter('all');
        announce('Progress reset.');
    });

    document.getElementById('deck').addEventListener('click', onDeckClick);

    startDeck(topic, cardId);
}

function renderNotFound(topicId) {
    document.getElementById('view-topic').innerHTML = `
        <div class="pt-28 pb-20 px-4">
            <div class="max-w-xl mx-auto bg-osi-card border border-osi-border rounded-2xl p-8 text-center">
                <h1 id="topic-title" tabindex="-1" class="text-xl font-bold text-white mb-2">Topic not found</h1>
                <p class="text-sm text-slate-400 mb-6">There’s no topic called “${esc(topicId)}”.</p>
                <a href="#topics" class="btn-primary">Browse all topics</a>
            </div>
        </div>`;
}

// ============================================================
// Flash-card deck
// ============================================================

function startDeck(topic, cardId) {
    deck = { topic, filter: 'all', shuffled: false, order: [], pos: 0, revealed: false };
    deck.order = Core.filterCards(topic, progress, 'all');
    if (cardId) {
        const index = topic.cards.findIndex(c => c.id === cardId);
        if (index >= 0) deck.pos = deck.order.indexOf(index);
    }
    refreshProgressUI();
    renderDeck(false);
}

function setFilter(filter) {
    deck.filter = filter;
    const order = Core.filterCards(deck.topic, progress, filter);
    deck.order = deck.shuffled ? Core.shuffle(order) : order;
    deck.pos = 0;
    deck.revealed = false;
    renderDeckFilters();
    renderDeck(true);
}

function currentCard() {
    if (!deck || deck.pos >= deck.order.length) return null;
    return deck.topic.cards[deck.order[deck.pos]];
}

function announce(message) {
    const el = document.getElementById('deck-status');
    if (el) el.textContent = message;
}

function renderDeckFilters() {
    const stats = progress.stats(deck.topic);
    const filters = [
        { id: 'all', label: `All (${stats.total})` },
        { id: 'review', label: `Needs review (${stats.review})` },
        { id: 'new', label: `New (${stats.fresh})` }
    ];
    const el = document.getElementById('deck-filters');
    el.innerHTML = filters.map(f => `
        <button type="button" class="filter-chip" data-filter="${f.id}" aria-pressed="${deck.filter === f.id}">${f.label}</button>
    `).join('');
    el.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}

function refreshProgressUI() {
    const stats = progress.stats(deck.topic);
    document.getElementById('topic-progress-text').textContent = `${plural(stats.total, 'card')} · ${progressText(stats)}`;
    document.getElementById('deck-progress').innerHTML = progressBar(stats);
    document.querySelectorAll('[data-topic-nav]').forEach(nav => {
        nav.innerHTML = topicNavHTML(deck.topic.id);
    });
    renderDeckFilters();
}

function cardHTML(card) {
    const status = progress.get(deck.topic.id, card.id);
    const revealed = deck.revealed;
    return `
        <article class="card-glow bg-osi-card border border-osi-border rounded-2xl overflow-hidden" aria-roledescription="flash card" aria-labelledby="flash-q">
            <div class="p-5 sm:p-6">
                <div class="flex items-center justify-between gap-3 mb-5">
                    <div class="flex flex-wrap items-center gap-2">
                        <span class="text-xs font-medium text-slate-500">Card ${deck.pos + 1} of ${deck.order.length}</span>
                        ${levelBadge(card.level)}
                        ${statusBadge(status)}
                    </div>
                    <div class="flex gap-1.5 flex-shrink-0">
                        <button type="button" class="arrow-btn w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400 disabled:opacity-30 disabled:pointer-events-none"
                                data-deck="prev" data-focus-key="prev" aria-label="Previous card" ${deck.pos === 0 ? 'disabled' : ''}>${ICONS.left}</button>
                        <button type="button" class="arrow-btn w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-400"
                                data-deck="next" data-focus-key="next" aria-label="Next card">${ICONS.right}</button>
                    </div>
                </div>

                <p class="text-[11px] font-semibold uppercase tracking-wider text-osi-cyan mb-2">Question</p>
                <p id="flash-q" class="text-lg sm:text-xl font-semibold text-white leading-snug">${esc(card.q)}</p>

                <div id="flash-answer" class="expanded-content flash-answer ${revealed ? 'open' : ''}">
                    <div class="mt-5 pt-5 border-t border-osi-border">
                        <p class="text-[11px] font-semibold uppercase tracking-wider text-osi-violet mb-2">Answer</p>
                        <p class="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-line">${esc(card.a)}</p>
                    </div>
                </div>
            </div>

            <button type="button" id="reveal-btn" data-deck="reveal" data-focus-key="reveal"
                    aria-expanded="${revealed}" aria-controls="flash-answer"
                    class="w-full px-4 py-3 text-sm font-medium text-slate-400 hover:text-osi-cyan border-t border-osi-border transition-colors flex items-center justify-center gap-1.5">
                <span id="reveal-label">${revealed ? 'Hide answer' : 'Reveal answer'}</span>
                <span id="reveal-icon" class="${revealed ? 'rotate-180' : ''} transition-transform">${ICONS.chevron}</span>
            </button>

            <div class="grid grid-cols-2 border-t border-osi-border">
                <button type="button" class="mark-btn mark-review" data-mark="review" data-focus-key="review" aria-pressed="${status === 'review'}">↻ Needs review</button>
                <button type="button" class="mark-btn mark-known border-l border-osi-border" data-mark="known" data-focus-key="known" aria-pressed="${status === 'known'}">✓ Got it</button>
            </div>
        </article>`;
}

function completeHTML() {
    const stats = progress.stats(deck.topic);
    const next = TOPICS[TOPICS.indexOf(deck.topic) + 1];
    return `
        <div class="bg-osi-card border border-osi-border rounded-2xl p-6 sm:p-8 text-center">
            <h3 class="text-lg font-bold gradient-text mb-2">End of deck</h3>
            <p class="text-sm text-slate-400 mb-6">${progressText(stats)}</p>
            <div class="flex flex-wrap justify-center gap-2">
                <button type="button" class="btn-primary" data-deck="restart" data-focus-key="restart">Start over</button>
                ${stats.review ? `<button type="button" class="btn-secondary" data-deck="filter-review">Study ${stats.review} needing review</button>` : ''}
                <button type="button" class="btn-secondary" data-deck="prev" data-focus-key="prev">Back to last card</button>
                ${next ? `<a href="${Core.topicHref(next.id)}" class="btn-secondary">Next topic: ${esc(next.title)}</a>` : ''}
            </div>
        </div>`;
}

function emptyHTML() {
    const message = deck.filter === 'review'
        ? 'No cards are marked “Needs review”. Nice work.'
        : 'You’ve marked every card in this deck.';
    return `
        <div class="bg-osi-card border border-osi-border rounded-2xl p-6 sm:p-8 text-center">
            <p class="text-sm text-slate-400 mb-5">${message}</p>
            <button type="button" class="btn-primary" data-deck="show-all" data-focus-key="show-all">Show all cards</button>
        </div>`;
}

function renderDeck(animate) {
    const el = document.getElementById('deck');
    const active = document.activeElement;
    const focusKey = active && el.contains(active) ? active.dataset.focusKey : null;
    const card = currentCard();

    let html;
    if (!deck.order.length) html = emptyHTML();
    else if (!card) html = completeHTML();
    else html = cardHTML(card);

    const enterClass = animate ? 'card-enter-up' : 'card-active';
    el.innerHTML = `<div class="card-transition ${enterClass}">${html}</div>`;
    if (animate) {
        const wrapper = el.firstElementChild;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            wrapper.classList.remove('card-enter-up');
            wrapper.classList.add('card-active');
        }));
    }

    // Re-rendering replaces the focused button; put focus back on its counterpart.
    if (focusKey) {
        let target = el.querySelector(`[data-focus-key="${focusKey}"]:not([disabled])`);
        if (!target) target = el.querySelector('[data-focus-key="next"], [data-focus-key="restart"], [data-focus-key="show-all"]');
        if (target) target.focus({ preventScroll: true });
    }

    // Keep the URL pointing at the current card so it can be bookmarked or shared.
    const href = Core.topicHref(deck.topic.id, card ? card.id : null);
    if (location.hash !== href) history.replaceState(null, '', href);
}

function goTo(pos, message) {
    deck.pos = Math.max(0, Math.min(pos, deck.order.length));
    deck.revealed = false;
    renderDeck(true);
    const card = currentCard();
    announce(card
        ? `${message ? message + ' ' : ''}Card ${deck.pos + 1} of ${deck.order.length}: ${card.q}`
        : `${message ? message + ' ' : ''}End of deck. ${progressText(progress.stats(deck.topic))}.`);
}

function toggleReveal() {
    if (!currentCard()) return;
    deck.revealed = !deck.revealed;
    document.getElementById('flash-answer').classList.toggle('open', deck.revealed);
    document.getElementById('reveal-btn').setAttribute('aria-expanded', String(deck.revealed));
    document.getElementById('reveal-label').textContent = deck.revealed ? 'Hide answer' : 'Reveal answer';
    document.getElementById('reveal-icon').classList.toggle('rotate-180', deck.revealed);
}

function mark(status) {
    const card = currentCard();
    if (!card) return;
    const next = progress.get(deck.topic.id, card.id) === status ? null : status;
    progress.set(deck.topic.id, card.id, next);
    refreshProgressUI();

    if (next) {
        goTo(deck.pos + 1, next === 'known' ? 'Marked as known.' : 'Marked for review.');
    } else {
        renderDeck(false);
        announce('Mark cleared.');
    }
}

function deckAction(action) {
    if (!deck || !deck.order.length) {
        if (action === 'show-all') setFilter('all');
        return;
    }
    switch (action) {
        case 'prev': if (deck.pos > 0) goTo(deck.pos - 1); break;
        case 'next': if (deck.pos < deck.order.length) goTo(deck.pos + 1); break;
        case 'reveal': toggleReveal(); break;
        case 'restart': goTo(0); break;
        case 'filter-review': setFilter('review'); break;
        case 'show-all': setFilter('all'); break;
    }
}

function onDeckClick(e) {
    const actionBtn = e.target.closest('[data-deck]');
    if (actionBtn) {
        deckAction(actionBtn.dataset.deck);
        return;
    }
    const markBtn = e.target.closest('[data-mark]');
    if (markBtn) mark(markBtn.dataset.mark);
}

document.addEventListener('keydown', (e) => {
    if (!deck || document.getElementById('view-topic').hidden) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;

    switch (e.key) {
        case 'ArrowLeft': deckAction('prev'); break;
        case 'ArrowRight': deckAction('next'); break;
        case ' ':
            // Let focused buttons/links handle Space natively.
            if (e.target.closest('button, a, summary')) return;
            e.preventDefault();
            toggleReveal();
            break;
        case 'k': case 'K': mark('known'); break;
        case 'r': case 'R': mark('review'); break;
    }
});

// ============================================================
// Routing
// ============================================================

function showView(name) {
    document.getElementById('view-home').hidden = name !== 'home';
    document.getElementById('view-topic').hidden = name !== 'topic';
    document.body.dataset.view = name;
}

function handleRoute() {
    const route = Core.parseRoute(location.hash);
    const home = document.getElementById('view-home');

    if (route.name === 'topic') {
        const topic = topicById(route.topicId);
        showView('topic');
        if (topic) {
            renderTopicView(topic, route.cardId);
            document.title = `${topic.title} | NetAtlas`;
        } else {
            deck = null;
            renderNotFound(route.topicId);
            document.title = `Topic not found | NetAtlas`;
        }
        window.scrollTo(0, 0);
        document.getElementById('topic-title').focus({ preventScroll: true });
        return;
    }

    const wasHidden = home.hidden;
    deck = null;
    showView('home');
    document.getElementById('view-topic').innerHTML = '';
    document.title = DEFAULT_TITLE;
    renderDashboardResults();

    // Coming back from a topic: the browser couldn't scroll to an anchor
    // inside the hidden home view, so do it now and move focus there.
    if (wasHidden) {
        const target = route.anchor && document.getElementById(route.anchor);
        if (target) {
            target.scrollIntoView();
            target.focus({ preventScroll: true });
        } else {
            window.scrollTo(0, 0);
        }
    }
}

// ============================================================
// Initialize
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    renderDashboardShell();

    document.getElementById('skip-link').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('main-content').focus();
    });

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
});

})();
