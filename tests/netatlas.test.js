// Run with: node --test tests/
const test = require('node:test');
const assert = require('node:assert/strict');

const data = require('../js/topics.js');
const core = require('../js/netatlas-core.js');

function memoryStorage(initial = {}) {
    const store = { ...initial };
    return {
        getItem: k => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v); },
        dump: () => store
    };
}

// ------------------------------------------------------------
// Content data
// ------------------------------------------------------------

test('topic data passes validation', () => {
    assert.deepEqual(core.validateTopics(data), []);
});

test('all 15 requested topic areas exist, OSI first', () => {
    assert.deepEqual(data.TOPICS.map(t => t.id), [
        'osi-tcpip', 'ports-protocols', 'ip-addressing', 'cabling-media', 'topologies',
        'network-devices', 'routing', 'switching-vlans', 'wireless', 'network-services',
        'security', 'troubleshooting', 'qos', 'wan-vpn', 'automation'
    ]);
});

test('every topic has a meaningful deck and related links', () => {
    data.TOPICS.forEach(topic => {
        assert.ok(topic.cards.length >= 10, `${topic.id} has only ${topic.cards.length} cards`);
        assert.ok(topic.related.length >= 2, `${topic.id} needs related topics`);
    });
});

test('ports deck covers the required well-known ports', () => {
    const ports = data.TOPICS.find(t => t.id === 'ports-protocols');
    const text = ports.cards.map(c => c.q + c.a).join(' ');
    ['80', '443', '53', '22'].forEach(p => assert.match(text, new RegExp(`\\b${p}\\b`)));
});

test('validateTopics reports broken data', () => {
    const broken = {
        CATEGORIES: data.CATEGORIES,
        LEVELS: data.LEVELS,
        TOPICS: [{
            id: 'x', title: 'X', short: 'X', color: 'c', summary: 's', description: 'd',
            category: 'nope', level: 9, related: ['missing', 'x'],
            cards: [{ id: 'a', level: 1, q: 'q', a: 'a' }, { id: 'a', level: 1, q: '', a: 'a' }],
            reference: [{ title: 'T', columns: ['a', 'b'], rows: [['1']] }]
        }]
    };
    const errors = core.validateTopics(broken).join('\n');
    assert.match(errors, /unknown category/);
    assert.match(errors, /invalid level/);
    assert.match(errors, /duplicate card id/);
    assert.match(errors, /needs q and a/);
    assert.match(errors, /expected 2/);
    assert.match(errors, /"missing" does not exist/);
    assert.match(errors, /relates to itself/);
});

// ------------------------------------------------------------
// Routing (old anchors must keep working)
// ------------------------------------------------------------

test('parseRoute keeps legacy anchors on the home view', () => {
    assert.deepEqual(core.parseRoute(''), { name: 'home', anchor: null });
    assert.deepEqual(core.parseRoute('#'), { name: 'home', anchor: null });
    assert.deepEqual(core.parseRoute('#model'), { name: 'home', anchor: 'model' });
    assert.deepEqual(core.parseRoute('#about'), { name: 'home', anchor: 'about' });
    assert.deepEqual(core.parseRoute('#/topics'), { name: 'home', anchor: 'topics' });
});

test('parseRoute reads topic and card routes', () => {
    assert.deepEqual(core.parseRoute('#/topic/routing'), { name: 'topic', topicId: 'routing', cardId: null });
    assert.deepEqual(core.parseRoute('#/topic/routing/ospf'), { name: 'topic', topicId: 'routing', cardId: 'ospf' });
    assert.equal(core.topicHref('routing', 'ospf'), '#/topic/routing/ospf');
    assert.equal(core.topicHref('routing'), '#/topic/routing');
});

// ------------------------------------------------------------
// Progress store
// ------------------------------------------------------------

test('progress store saves, toggles, and resets per topic', () => {
    const storage = memoryStorage();
    const store = core.createProgressStore(storage);
    const topic = data.TOPICS[0];

    store.set(topic.id, topic.cards[0].id, 'known');
    store.set(topic.id, topic.cards[1].id, 'review');
    store.set('routing', 'ospf', 'known');
    assert.deepEqual(store.stats(topic), { total: topic.cards.length, known: 1, review: 1, fresh: topic.cards.length - 2 });

    // Survives a reload
    const reloaded = core.createProgressStore(storage);
    assert.equal(reloaded.get(topic.id, topic.cards[0].id), 'known');

    reloaded.set(topic.id, topic.cards[0].id, null);
    assert.equal(reloaded.get(topic.id, topic.cards[0].id), null);

    reloaded.resetTopic(topic.id);
    assert.equal(reloaded.get(topic.id, topic.cards[1].id), null);
    assert.equal(reloaded.get('routing', 'ospf'), 'known', 'other topics untouched');
});

test('progress store tolerates corrupt or unavailable storage', () => {
    const corrupt = core.createProgressStore(memoryStorage({ [core.PROGRESS_KEY]: '{not json' }));
    assert.equal(corrupt.get('a', 'b'), null);

    const throwing = {
        getItem() { throw new Error('blocked'); },
        setItem() { throw new Error('blocked'); }
    };
    const store = core.createProgressStore(throwing);
    store.set('a', 'b', 'known');
    assert.equal(store.get('a', 'b'), 'known', 'falls back to memory');

    const none = core.createProgressStore(null);
    none.set('a', 'b', 'review');
    assert.equal(none.get('a', 'b'), 'review');
});

test('progress store ignores unknown status values', () => {
    const store = core.createProgressStore(memoryStorage({ [core.PROGRESS_KEY]: '{"a/b":"weird"}' }));
    assert.equal(store.get('a', 'b'), null);
});

// ------------------------------------------------------------
// Deck helpers & search
// ------------------------------------------------------------

test('filterCards returns indexes for all / review / new', () => {
    const topic = { id: 't', cards: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
    const store = core.createProgressStore(memoryStorage());
    store.set('t', 'a', 'known');
    store.set('t', 'b', 'review');
    assert.deepEqual(core.filterCards(topic, store, 'all'), [0, 1, 2]);
    assert.deepEqual(core.filterCards(topic, store, 'review'), [1]);
    assert.deepEqual(core.filterCards(topic, store, 'new'), [2]);
});

test('shuffle keeps every item and does not mutate input', () => {
    const input = [1, 2, 3, 4, 5];
    const out = core.shuffle(input, () => 0);
    assert.deepEqual(input, [1, 2, 3, 4, 5]);
    assert.deepEqual([...out].sort(), [1, 2, 3, 4, 5]);
});

test('searchTopics matches topic text and card text', () => {
    const all = core.searchTopics(data.TOPICS, '');
    assert.equal(all.length, data.TOPICS.length);

    const ospf = core.searchTopics(data.TOPICS, 'OSPF');
    assert.ok(ospf.some(r => r.topic.id === 'routing' && r.cards.length > 0));

    const multi = core.searchTopics(data.TOPICS, 'port 443');
    assert.ok(multi.some(r => r.topic.id === 'ports-protocols'));

    assert.deepEqual(core.searchTopics(data.TOPICS, 'zzzz-no-match'), []);
});

test('escapeHTML neutralizes markup', () => {
    assert.equal(core.escapeHTML('<a href="x">\'&'), '&lt;a href=&quot;x&quot;&gt;&#39;&amp;');
});
