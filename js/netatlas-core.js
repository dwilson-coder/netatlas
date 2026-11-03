// ============================================================
// NetAtlas - Core helpers (no DOM; shared by app.js and tests)
// ============================================================

(function (root) {

const PROGRESS_KEY = 'netatlas:progress:v1';
const STATUSES = ['known', 'review'];

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ------------------------------------------------------------
// Routing
//   #/topic/<topicId>[/<cardId>]  -> topic view
//   anything else (#, #model, #about, #topics) -> home view
// ------------------------------------------------------------

function parseRoute(hash) {
    const raw = (hash || '').replace(/^#/, '');
    if (raw.startsWith('/')) {
        const parts = raw.split('/').filter(Boolean).map(decodeURIComponent);
        if (parts[0] === 'topic' && parts[1]) {
            return { name: 'topic', topicId: parts[1], cardId: parts[2] || null };
        }
        return { name: 'home', anchor: parts[0] === 'topics' ? 'topics' : null };
    }
    return { name: 'home', anchor: raw || null };
}

function topicHref(topicId, cardId) {
    return `#/topic/${encodeURIComponent(topicId)}${cardId ? '/' + encodeURIComponent(cardId) : ''}`;
}

// ------------------------------------------------------------
// Progress store
//   Saved as { "<topicId>/<cardId>": "known" | "review" }.
//   Storage may be missing or throw (private mode); the store
//   then keeps working in memory for the current visit.
// ------------------------------------------------------------

function createProgressStore(storage, key = PROGRESS_KEY) {
    let data = {};
    try {
        const parsed = JSON.parse(storage && storage.getItem(key));
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) data = parsed;
    } catch (e) {
        data = {};
    }

    function save() {
        try {
            if (storage) storage.setItem(key, JSON.stringify(data));
        } catch (e) {
            // Storage full or blocked: progress stays in memory only.
        }
    }

    return {
        get(topicId, cardId) {
            const status = data[`${topicId}/${cardId}`];
            return STATUSES.includes(status) ? status : null;
        },
        set(topicId, cardId, status) {
            const cardKey = `${topicId}/${cardId}`;
            if (STATUSES.includes(status)) data[cardKey] = status;
            else delete data[cardKey];
            save();
        },
        resetTopic(topicId) {
            Object.keys(data).forEach(k => {
                if (k.startsWith(`${topicId}/`)) delete data[k];
            });
            save();
        },
        stats(topic) {
            let known = 0;
            let review = 0;
            topic.cards.forEach(card => {
                const status = this.get(topic.id, card.id);
                if (status === 'known') known++;
                else if (status === 'review') review++;
            });
            const total = topic.cards.length;
            return { total, known, review, fresh: total - known - review };
        }
    };
}

// ------------------------------------------------------------
// Deck helpers
// ------------------------------------------------------------

// Returns card indexes for a filter: 'all' | 'review' | 'new'
function filterCards(topic, store, filter) {
    return topic.cards.reduce((acc, card, i) => {
        const status = store.get(topic.id, card.id);
        if (filter === 'all' ||
            (filter === 'review' && status === 'review') ||
            (filter === 'new' && status === null)) {
            acc.push(i);
        }
        return acc;
    }, []);
}

function shuffle(list, random = Math.random) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// ------------------------------------------------------------
// Search: matches topic text and card text (case-insensitive,
// every word must appear somewhere in the topic or card).
// ------------------------------------------------------------

function searchTopics(topics, query) {
    const terms = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return topics.map(topic => ({ topic, topicMatch: true, cards: [] }));

    const matches = text => terms.every(t => text.includes(t));

    return topics.reduce((results, topic) => {
        const topicText = [topic.title, topic.summary, topic.description].join(' ').toLowerCase();
        const cards = topic.cards.filter(card => matches(`${card.q} ${card.a}`.toLowerCase()));
        const topicMatch = matches(topicText);
        if (topicMatch || cards.length) results.push({ topic, topicMatch, cards });
        return results;
    }, []);
}

// ------------------------------------------------------------
// Data validation (used by tests; handy when adding topics)
// ------------------------------------------------------------

function validateTopics(data) {
    const errors = [];
    const ids = new Set();
    const categoryIds = new Set(data.CATEGORIES.map(c => c.id));

    data.TOPICS.forEach(topic => {
        const where = `topic "${topic.id}"`;
        if (!/^[a-z0-9-]+$/.test(topic.id || '')) errors.push(`${where}: id must be a lowercase slug`);
        if (ids.has(topic.id)) errors.push(`${where}: duplicate id`);
        ids.add(topic.id);

        ['title', 'short', 'color', 'summary', 'description'].forEach(field => {
            if (!topic[field]) errors.push(`${where}: missing ${field}`);
        });
        if (!categoryIds.has(topic.category)) errors.push(`${where}: unknown category "${topic.category}"`);
        if (!data.LEVELS[topic.level]) errors.push(`${where}: invalid level`);
        if (!Array.isArray(topic.cards) || !topic.cards.length) errors.push(`${where}: no cards`);

        const cardIds = new Set();
        (topic.cards || []).forEach(card => {
            if (!card.id || !/^[a-z0-9-]+$/.test(card.id)) errors.push(`${where}: card id "${card.id}" must be a lowercase slug`);
            if (cardIds.has(card.id)) errors.push(`${where}: duplicate card id "${card.id}"`);
            cardIds.add(card.id);
            if (!card.q || !card.a) errors.push(`${where}: card "${card.id}" needs q and a`);
            if (!data.LEVELS[card.level]) errors.push(`${where}: card "${card.id}" has invalid level`);
        });

        (topic.reference || []).forEach(table => {
            table.rows.forEach((row, i) => {
                if (row.length !== table.columns.length) {
                    errors.push(`${where}: table "${table.title}" row ${i + 1} has ${row.length} cells, expected ${table.columns.length}`);
                }
            });
        });
    });

    data.TOPICS.forEach(topic => {
        (topic.related || []).forEach(rel => {
            if (rel === topic.id) errors.push(`topic "${topic.id}": relates to itself`);
            else if (!ids.has(rel)) errors.push(`topic "${topic.id}": related topic "${rel}" does not exist`);
        });
    });

    return errors;
}

const core = {
    PROGRESS_KEY,
    escapeHTML,
    parseRoute,
    topicHref,
    createProgressStore,
    filterCards,
    shuffle,
    searchTopics,
    validateTopics
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = core;
} else {
    root.NetAtlasCore = core;
}

})(typeof window !== 'undefined' ? window : globalThis);
