# NetAtlas (formerly OSIFlow)
*Explore networking, one layer at a time.*

Welcome, I hope you find this tool helpful. Please be sure to share it, fork, and give me a star if you like it. 😊

![OSI Flow](https://raw.githubusercontent.com/dwilson-coder/osiflow/refs/heads/main/og.jpg)


## Project Overview
OSI Flow is an interactive educational tool developed to help students visualize the network assets at each layer, how packets move through the layers, and what information is added or removed at each layer.

NetAtlas keeps the OSI Flow explorer at its heart and adds 15 topic decks covering the wider networking curriculum.

## Features
### OSI Flow explorer (home page)
- Up and Down arrows show the flow of packets through the OSI layers.
- Expand feature on the OSI flashcards, reveals network assets at each layer
- Each layer shows its TCP/IP model equivalent and links to related topic decks.

### Topic decks
- 15 topics: OSI & TCP/IP, Ports & Protocols, IP Addressing, Cabling & Media, Topologies, Devices, Routing, Switching & VLANs, Wireless, Network Services, Security, Troubleshooting, QoS, WAN & VPN, and Automation.
- Flash cards with reveal, previous/next, and **Got it** / **Needs review** marking.
- Filters (All / Needs review / New), shuffle, and per-topic progress reset.
- Quick-reference tables (ports, CIDR, cable categories, 802.11 standards, and more) and related-topic links.
- Searchable topic dashboard with category filters and progress bars.
- Progress is saved in your browser's `localStorage`. There are no accounts and no backend.

### Navigating
- **Topics** in the nav bar (or scroll down on the home page) opens the dashboard. Search matches topic and card text.
- Topic pages live at `#/topic/<topic-id>`, and a specific card at `#/topic/<topic-id>/<card-id>`, so links can be bookmarked and shared.
- On a topic page, use the sidebar (desktop) or the **All topics** menu (mobile) to switch topics.
- Keyboard shortcuts in a deck: `←`/`→` move between cards, `Space` reveals the answer, `K` marks it as known, `R` marks it for review.
- Existing links (`#model`, `#about`) still go to the same sections of the home page.

## Prerequisites
None. This was built using HTML, JavaScript, and some CSS. The UI is powered by Tailwind CSS (via CDN).

## Project structure
| File | Purpose |
| --- | --- |
| `index.html` | Page shell: nav, home view (hero, OSI Flow, topic dashboard, about), topic view container |
| `js/script.js` | OSI Flow carousel |
| `js/topics.js` | All topic content: cards, reference tables, related links |
| `js/netatlas-core.js` | DOM-free logic: routing, search, progress storage, data validation |
| `js/app.js` | Dashboard, topic pages, flash-card decks, hash routing |
| `tests/netatlas.test.js` | Unit tests for content and core logic |

## Adding a topic
Add an object to `TOPICS` in `js/topics.js` with an `id`, `title`, `short` (badge text), `color`, `category`, `level`, `summary`, `description`, `related`, optional `reference` tables, and `cards` (each card needs a stable `id`, `level`, `q`, and `a`). The dashboard, sidebar, and deck pick it up automatically. Keep card ids stable, because saved progress is keyed by `topicId/cardId`.

## Tests
Requires Node.js 18+ (no packages needed):

    node --test "tests/*.test.js"

The tests validate all topic data (unique ids, valid related links, table shapes) and the routing, search, and progress logic.

## Installation
1. Clone the repo:

n   git clone <repo-url>
   cd OSIFlow

2. Install dependencies:
None.

## Contributing
1. Fork the repository
2. Create a branch: `feature/your-feature`
3. Open a pull request describing your changes

## License
OSI Flow © 2026 CodeBox LLC  
Licensed under CC BY-NC 4.0  
You may use this project for personal and educational purposes only.  
Commercial use is strictly prohibited.


## Contact
Project maintainer: Damion Wilson  — (https://github.com/dwilson-coder)[https://github.com/dwilson-coder].
