// ============================================================
// NetAtlas - Topic & Flash-Card Data
// ------------------------------------------------------------
// To add a topic, append an object to TOPICS. The UI (dashboard,
// sidebar, deck, reference tables) is generated from this data.
//   id        stable slug, used in URLs and saved progress
//   cards[].id stable per topic; changing it resets that card's progress
//   level     1 Beginner, 2 Intermediate, 3 Advanced
// ============================================================

(function (root) {

const CATEGORIES = [
    { id: 'foundations', name: 'Foundations', description: 'Models, addressing, media, and the building blocks every network uses.' },
    { id: 'infrastructure', name: 'Core Infrastructure', description: 'How traffic is switched, routed, carried over the air, and served.' },
    { id: 'operations', name: 'Operations & Security', description: 'Protecting, troubleshooting, optimizing, extending, and automating networks.' }
];

const LEVELS = {
    1: { name: 'Beginner', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    2: { name: 'Intermediate', className: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    3: { name: 'Advanced', className: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
};

const TOPICS = [
    // --------------------------------------------------------
    {
        id: 'osi-tcpip',
        title: 'OSI & TCP/IP Models',
        short: 'OSI',
        color: 'from-pink-500 to-rose-500',
        category: 'foundations',
        level: 1,
        summary: 'The seven OSI layers, how they map to TCP/IP, PDUs, and encapsulation.',
        description: 'The OSI model is a conceptual framework that splits network communication into seven layers. The TCP/IP model is the practical stack the internet is built on. Learning how the two line up, and what each layer adds during encapsulation, gives you the vocabulary used everywhere else in networking. Pair this deck with the OSI Flow explorer on the home page.',
        related: ['ports-protocols', 'network-devices', 'troubleshooting', 'ip-addressing', 'cabling-media'],
        osiLayers: [1, 2, 3, 4, 5, 6, 7],
        reference: [
            {
                title: 'OSI ↔ TCP/IP mapping',
                caption: 'The four-layer TCP/IP model is shown; some texts use five layers by splitting Network Access into Data Link and Physical.',
                columns: ['OSI layer', 'TCP/IP layer', 'PDU', 'Example protocols', 'Example devices'],
                rows: [
                    ['7 Application', 'Application', 'Data', 'HTTP, DNS, SMTP, SSH', 'End hosts, servers'],
                    ['6 Presentation', 'Application', 'Data', 'TLS*, JPEG, ASCII', 'End hosts'],
                    ['5 Session', 'Application', 'Data', 'RPC, NetBIOS', 'End hosts'],
                    ['4 Transport', 'Transport', 'Segment (TCP) / Datagram (UDP)', 'TCP, UDP', 'Firewalls, load balancers'],
                    ['3 Network', 'Internet', 'Packet', 'IPv4, IPv6, ICMP', 'Routers, Layer 3 switches'],
                    ['2 Data Link', 'Network Access', 'Frame', 'Ethernet, 802.11 MAC, PPP', 'Switches, bridges, NICs'],
                    ['1 Physical', 'Network Access', 'Bits', 'Ethernet PHY, 802.11 radio', 'Cables, hubs, repeaters']
                ],
                footnote: '*TLS does not fit neatly into one layer; it is commonly placed at Layer 6 or described as sitting between Transport and Application.'
            },
            {
                title: 'Encapsulation of a web request',
                caption: 'Sender side, top to bottom. The receiver reverses the process (decapsulation).',
                columns: ['Step', 'Layer', 'What is added', 'Result'],
                rows: [
                    ['1', 'Application', 'HTTP request', 'Data'],
                    ['2', 'Transport', 'TCP header (ports, sequence numbers)', 'Segment'],
                    ['3', 'Network', 'IP header (source/destination IP, TTL)', 'Packet'],
                    ['4', 'Data Link', 'Ethernet header (MACs) + FCS trailer', 'Frame'],
                    ['5', 'Physical', 'Line coding into signals', 'Bits on the wire']
                ]
            }
        ],
        cards: [
            { id: 'layers', level: 1, q: 'What are the seven OSI layers, from Layer 7 down to Layer 1?', a: '7 Application\n6 Presentation\n5 Session\n4 Transport\n3 Network\n2 Data Link\n1 Physical\n\nMnemonic (top-down): “All People Seem To Need Data Processing.”' },
            { id: 'conceptual', level: 1, q: 'Do networks actually “run” the OSI model?', a: 'No. OSI is a conceptual reference model used to describe and teach network functions. The internet runs the TCP/IP protocol suite, but OSI layer numbers remain the shared vocabulary (e.g., “that’s a Layer 2 problem”).' },
            { id: 'tcpip-layers', level: 1, q: 'What are the layers of the TCP/IP model?', a: 'Commonly taught as four layers: Application, Transport, Internet, and Network Access (also called Link).\n\nSome textbooks use a five-layer version that splits Network Access into Data Link and Physical.' },
            { id: 'mapping', level: 1, q: 'How do the OSI layers map to the four-layer TCP/IP model?', a: 'OSI 5–7 (Session, Presentation, Application) → Application\nOSI 4 (Transport) → Transport\nOSI 3 (Network) → Internet\nOSI 1–2 (Physical, Data Link) → Network Access' },
            { id: 'pdus', level: 1, q: 'What is the PDU (protocol data unit) name at each layer?', a: 'Layers 5–7: Data\nLayer 4: Segment (TCP) or Datagram (UDP)\nLayer 3: Packet\nLayer 2: Frame\nLayer 1: Bits' },
            { id: 'encapsulation', level: 1, q: 'What is encapsulation?', a: 'On the sending host, each layer wraps the data from the layer above with its own header (and, at Layer 2, a trailer) before passing it down.\n\nExample: data → TCP segment → IP packet → Ethernet frame → bits.' },
            { id: 'decapsulation', level: 1, q: 'What is decapsulation?', a: 'The reverse process on the receiving host: each layer reads and removes its own header/trailer, then passes the remaining payload up, until the application receives the original data.' },
            { id: 'devices', level: 1, q: 'Which devices are typically associated with Layers 1, 2, and 3?', a: 'Layer 1: cables, hubs, repeaters, transceivers\nLayer 2: switches, bridges, NICs\nLayer 3: routers, Layer 3 switches\n\nMany modern devices work across several layers. Next-generation firewalls, for example, inspect Layers 3–7.' },
            { id: 'why-layers', level: 1, q: 'Why do troubleshooters think in layers?', a: 'Isolating a problem to a layer narrows the possible causes: Layer 1 = cable or link light, Layer 2 = VLAN or MAC issues, Layer 3 = IP addressing or routing, Layer 4 = ports or firewall rules, Layer 7 = the application or DNS.' },
            { id: 'transport-role', level: 2, q: 'What are the main responsibilities of the Transport layer?', a: 'Process-to-process delivery using port numbers, plus segmentation and reassembly.\n\nTCP adds reliability: acknowledgments, retransmission, ordering, flow control, and congestion control. UDP provides only ports and a checksum.' },
            { id: 'l4-header', level: 2, q: 'What key fields does the TCP header add?', a: 'Source and destination ports, sequence and acknowledgment numbers, flags (SYN, ACK, FIN, RST…), window size, and a checksum. The UDP header is much smaller: ports, length, and checksum.' },
            { id: 'mac-vs-ip', level: 2, q: 'How do Layer 2 (MAC) and Layer 3 (IP) addresses differ?', a: 'MAC address: 48-bit hardware address identifying an interface on the local segment; used hop by hop, so it changes at each router.\n\nIP address: logical address identifying a host across networks; source and destination normally stay the same end to end (unless NAT rewrites them).' },
            { id: 'router-hop', level: 2, q: 'What happens to the frame and packet headers as traffic crosses a router?', a: 'The router removes the incoming frame, reads the destination IP, decrements TTL (Hop Limit in IPv6), then builds a new frame with new source/destination MAC addresses for the next hop. The IP addresses are unchanged unless NAT is applied.' },
            { id: 'fcs', level: 2, q: 'What is in the Ethernet trailer, and what is it for?', a: 'The Frame Check Sequence (FCS), a CRC-32 value. The receiver recalculates it; frames that don’t match are discarded. Ethernet detects errors but does not retransmit. Recovery, if any, is left to higher layers such as TCP.' },
            { id: 'protocol-examples', level: 2, q: 'Give example protocols at Layers 7, 4, 3, and 2.', a: 'Layer 7: HTTP, DNS, SMTP, SSH\nLayer 4: TCP, UDP\nLayer 3: IPv4, IPv6, ICMP\nLayer 2: Ethernet (802.3), 802.11 MAC, PPP\n\nSome protocols don’t fit neatly. ARP, for example, works between Layers 2 and 3.' },
            { id: 'mtu', level: 3, q: 'What is MTU, and how does encapsulation affect it?', a: 'Maximum Transmission Unit: the largest Layer 3 packet a link carries in one frame. It is 1500 bytes on standard Ethernet.\n\nHeaders consume part of it: 1500 − 20 (IPv4, minimum) − 20 (TCP, minimum) = 1460-byte maximum TCP payload (MSS). Tunnels add headers, which lowers the effective MTU.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'ports-protocols',
        title: 'Ports & Protocols',
        short: 'PT',
        color: 'from-cyan-500 to-teal-500',
        category: 'foundations',
        level: 1,
        summary: 'Well-known ports like 80, 443, 53, and 22, and the protocols behind them.',
        description: 'Port numbers let one host run many network services at once. Transport-layer headers carry source and destination ports, so recognizing common ports helps with firewall rules, troubleshooting, and exam questions. These are IANA-registered defaults: services can be configured to listen on other ports.',
        related: ['osi-tcpip', 'network-services', 'security', 'troubleshooting'],
        osiLayers: [4, 7],
        reference: [
            {
                title: 'Common well-known ports',
                caption: 'Default assignments registered with IANA. Administrators can run services on non-standard ports.',
                columns: ['Port', 'Transport', 'Protocol', 'Purpose'],
                rows: [
                    ['20 / 21', 'TCP', 'FTP', 'File transfer (data / control)'],
                    ['22', 'TCP', 'SSH, SFTP, SCP', 'Encrypted remote login and file transfer'],
                    ['23', 'TCP', 'Telnet', 'Unencrypted remote login (avoid)'],
                    ['25', 'TCP', 'SMTP', 'Mail relay between servers'],
                    ['53', 'UDP / TCP', 'DNS', 'Name resolution'],
                    ['67 / 68', 'UDP', 'DHCP', 'Server / client address assignment'],
                    ['69', 'UDP', 'TFTP', 'Simple file transfer, no authentication'],
                    ['80', 'TCP', 'HTTP', 'Unencrypted web'],
                    ['110', 'TCP', 'POP3', 'Mail retrieval'],
                    ['123', 'UDP', 'NTP', 'Time synchronization'],
                    ['143', 'TCP', 'IMAP', 'Mail retrieval and sync'],
                    ['161 / 162', 'UDP', 'SNMP', 'Polling / traps'],
                    ['389', 'TCP / UDP', 'LDAP', 'Directory services'],
                    ['443', 'TCP (UDP for HTTP/3)', 'HTTPS', 'HTTP over TLS'],
                    ['445', 'TCP', 'SMB', 'File and printer sharing'],
                    ['514', 'UDP', 'Syslog', 'Log forwarding'],
                    ['587', 'TCP', 'SMTP submission', 'Client mail submission'],
                    ['636', 'TCP', 'LDAPS', 'LDAP over TLS'],
                    ['993 / 995', 'TCP', 'IMAPS / POP3S', 'Mail retrieval over TLS'],
                    ['3389', 'TCP / UDP', 'RDP', 'Remote Desktop']
                ]
            }
        ],
        cards: [
            { id: 'p80', level: 1, q: 'Which protocol uses port 80?', a: 'HTTP (Hypertext Transfer Protocol) over TCP: unencrypted web traffic.' },
            { id: 'p443', level: 1, q: 'Which protocol uses port 443?', a: 'HTTPS (HTTP over TLS), traditionally over TCP. HTTP/3 also uses port 443, but over UDP via the QUIC protocol.' },
            { id: 'p53', level: 1, q: 'Which protocol uses port 53, and over which transport?', a: 'DNS. Most queries use UDP 53. TCP 53 is used for zone transfers and for responses too large for UDP, and DNS servers are expected to support both.' },
            { id: 'p22', level: 1, q: 'Which protocol uses port 22?', a: 'SSH (Secure Shell) over TCP: encrypted remote command-line access. SFTP and SCP file transfers also run over SSH.' },
            { id: 'tcp-udp', level: 1, q: 'What is the difference between TCP and UDP?', a: 'TCP: connection-oriented (three-way handshake), reliable, ordered delivery with flow and congestion control. Used for web, email, and file transfer.\n\nUDP: connectionless, no delivery guarantees, lower overhead. Used for DNS queries, VoIP, streaming, and DHCP.' },
            { id: 'p67', level: 1, q: 'Which protocol uses UDP ports 67 and 68?', a: 'DHCP. The server listens on UDP 67 and the client uses UDP 68.' },
            { id: 'p25-587', level: 1, q: 'What is the difference between SMTP on port 25 and port 587?', a: 'Port 25: server-to-server mail relay.\nPort 587: message submission from mail clients, with authentication and usually STARTTLS.\n\nPort 465 (SMTP with implicit TLS) is also used for submission.' },
            { id: 'ranges', level: 1, q: 'What are the three IANA port number ranges?', a: 'Well-known: 0–1023\nRegistered: 1024–49151\nDynamic/private (ephemeral): 49152–65535\n\nOperating systems choose their own ephemeral range. Windows uses the IANA range; Linux commonly uses 32768–60999.' },
            { id: 'p23', level: 2, q: 'What uses port 23, and why should it be avoided?', a: 'Telnet (TCP). It sends everything, including usernames and passwords, in cleartext. Use SSH (port 22) instead.' },
            { id: 'p3389', level: 2, q: 'What uses port 3389?', a: 'Microsoft Remote Desktop Protocol (RDP), over TCP and UDP. Best practice is not to expose it directly to the internet: put it behind a VPN or remote desktop gateway and require MFA.' },
            { id: 'p161', level: 2, q: 'What are UDP ports 161 and 162 used for?', a: 'SNMP. Agents on managed devices receive queries on UDP 161, and management stations receive traps/notifications on UDP 162. Prefer SNMPv3, which adds authentication and encryption.' },
            { id: 'mail-ports', level: 2, q: 'Which ports do POP3, IMAP, and their TLS versions use?', a: 'POP3: 110, POP3S: 995\nIMAP: 143, IMAPS: 993' },
            { id: 'p123-514', level: 2, q: 'What uses UDP 123 and UDP 514?', a: 'UDP 123: NTP (Network Time Protocol).\nUDP 514: Syslog. Syslog can also run over TCP, and syslog over TLS commonly uses 6514.' },
            { id: 'p445', level: 2, q: 'What uses TCP 445?', a: 'SMB (Server Message Block) for Windows file and printer sharing. It should be blocked at the internet edge.' },
            { id: 'ftp-tftp', level: 2, q: 'How do FTP and TFTP differ in their ports and use?', a: 'FTP: TCP 21 for control; active mode uses TCP 20 for data, passive mode uses a negotiated high port. Credentials are unencrypted unless FTPS or SFTP is used.\n\nTFTP: UDP 69, no authentication. Mostly used on trusted networks to transfer device images and configs.' },
            { id: 'socket', level: 3, q: 'What is a socket, and what identifies a TCP connection?', a: 'A socket is an endpoint: an IP address plus a transport protocol and port. A connection is uniquely identified by the 5-tuple: source IP, source port, destination IP, destination port, and protocol.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'ip-addressing',
        title: 'IP Addressing',
        short: 'IP',
        color: 'from-emerald-500 to-green-500',
        category: 'foundations',
        level: 2,
        summary: 'IPv4 classes, subnetting, CIDR, private ranges, and IPv6 notation.',
        description: 'IP addresses identify hosts across networks at Layer 3. Start with IPv4 structure and private ranges, then practice subnet math with CIDR, and finish with IPv6 notation and address types. Classful addressing is historical but still appears in exams and documentation.',
        related: ['osi-tcpip', 'routing', 'network-services', 'troubleshooting'],
        osiLayers: [3],
        reference: [
            {
                title: 'Historical IPv4 classes',
                caption: 'Classful addressing was replaced by CIDR in 1993; the terms are still widely used.',
                columns: ['Class', 'First octet', 'Default mask', 'Use'],
                rows: [
                    ['A', '1–126', '/8 (255.0.0.0)', 'Unicast, large networks'],
                    ['B', '128–191', '/16 (255.255.0.0)', 'Unicast, medium networks'],
                    ['C', '192–223', '/24 (255.255.255.0)', 'Unicast, small networks'],
                    ['D', '224–239', 'n/a', 'Multicast'],
                    ['E', '240–255', 'n/a', 'Reserved / experimental']
                ],
                footnote: '0.x.x.x and 127.x.x.x (loopback) are reserved, which is why Class A is usually listed as 1–126.'
            },
            {
                title: 'Special IPv4 ranges',
                columns: ['Range', 'Purpose', 'Defined in'],
                rows: [
                    ['10.0.0.0/8', 'Private', 'RFC 1918'],
                    ['172.16.0.0/12 (172.16–172.31)', 'Private', 'RFC 1918'],
                    ['192.168.0.0/16', 'Private', 'RFC 1918'],
                    ['127.0.0.0/8', 'Loopback', 'RFC 1122'],
                    ['169.254.0.0/16', 'Link-local (APIPA)', 'RFC 3927'],
                    ['100.64.0.0/10', 'Shared address space (carrier-grade NAT)', 'RFC 6598']
                ]
            },
            {
                title: 'CIDR quick reference (last octet)',
                columns: ['Prefix', 'Mask', 'Addresses', 'Usable hosts'],
                rows: [
                    ['/24', '255.255.255.0', '256', '254'],
                    ['/25', '255.255.255.128', '128', '126'],
                    ['/26', '255.255.255.192', '64', '62'],
                    ['/27', '255.255.255.224', '32', '30'],
                    ['/28', '255.255.255.240', '16', '14'],
                    ['/29', '255.255.255.248', '8', '6'],
                    ['/30', '255.255.255.252', '4', '2'],
                    ['/31', '255.255.255.254', '2', '2 (point-to-point, RFC 3021)'],
                    ['/32', '255.255.255.255', '1', 'Single host route']
                ]
            }
        ],
        cards: [
            { id: 'ipv4-format', level: 1, q: 'How long is an IPv4 address, and how is it written?', a: '32 bits, written as four decimal octets separated by dots (dotted decimal), e.g. 192.168.1.10. Each octet ranges from 0 to 255.' },
            { id: 'mask', level: 1, q: 'What does a subnet mask do?', a: 'It marks which bits of an address are the network portion and which are the host portion. 255.255.255.0 means the first 24 bits identify the network and the last 8 identify hosts.' },
            { id: 'cidr', level: 1, q: 'What does CIDR notation like /24 mean?', a: 'The prefix length: the number of leading network bits. 192.168.1.0/24 has the mask 255.255.255.0. CIDR (Classless Inter-Domain Routing) allows any prefix length, replacing fixed classful boundaries.' },
            { id: 'private', level: 1, q: 'What are the RFC 1918 private IPv4 ranges?', a: '10.0.0.0/8\n172.16.0.0/12 (172.16.0.0–172.31.255.255)\n192.168.0.0/16\n\nThey are not routed on the public internet; hosts using them typically reach the internet through NAT.' },
            { id: 'classes', level: 1, q: 'What are the first-octet ranges of IPv4 Classes A, B, and C?', a: 'Class A: 1–126 (default /8)\nClass B: 128–191 (default /16)\nClass C: 192–223 (default /24)\n\nClass D (224–239) is multicast and Class E (240–255) is reserved. Modern networks use CIDR rather than classes.' },
            { id: 'loopback', level: 1, q: 'What is 127.0.0.1?', a: 'The IPv4 loopback address (from 127.0.0.0/8). Traffic sent to it never leaves the host, so it is used to test the local TCP/IP stack and local services. The IPv6 equivalent is ::1.' },
            { id: 'hosts-26', level: 2, q: 'How many usable host addresses are in a /26?', a: '2^(32−26) = 64 addresses. Subtract the network and broadcast addresses: 62 usable hosts.' },
            { id: 'subnet-27', level: 2, q: 'For 192.168.10.77/27, what are the network address, broadcast address, and usable range?', a: 'A /27 has a block size of 32, so subnets start at .0, .32, .64, .96…\n.77 falls in the .64 block.\n\nNetwork: 192.168.10.64\nBroadcast: 192.168.10.95\nUsable: 192.168.10.65 – 192.168.10.94' },
            { id: 'subnets-in-24', level: 2, q: 'How many /26 subnets fit in a /24?', a: 'Four. Going from /24 to /26 borrows 2 bits, and 2² = 4 subnets of 64 addresses each (.0, .64, .128, .192).' },
            { id: 'apipa', level: 2, q: 'A host has an address in 169.254.0.0/16. What does that usually mean?', a: 'It self-assigned an IPv4 link-local (APIPA) address because it didn’t get a response from a DHCP server. It can only talk to other hosts on the same link. Check connectivity, the VLAN, and DHCP availability.' },
            { id: 'ipv6-format', level: 2, q: 'How long is an IPv6 address, and how is it written?', a: '128 bits, written as eight groups of four hexadecimal digits separated by colons, e.g.\n2001:0db8:0000:0000:0000:ff00:0042:8329' },
            { id: 'ipv6-shorten', level: 2, q: 'What are the rules for shortening an IPv6 address?', a: '1. Drop leading zeros in any group (0db8 → db8).\n2. Replace one run of consecutive all-zero groups with “::”, and only once per address.\n\n2001:0db8:0000:0000:0000:ff00:0042:8329 → 2001:db8::ff00:42:8329' },
            { id: 'ipv6-types', level: 2, q: 'What are the common IPv6 address types and prefixes?', a: 'Global unicast: 2000::/3\nLink-local: fe80::/10 (every IPv6 interface has one)\nUnique local: fc00::/7 (fd00::/8 in practice)\nMulticast: ff00::/8\nLoopback: ::1\n\nIPv6 has no broadcast; multicast fills that role.' },
            { id: 'ipv6-64', level: 3, q: 'What prefix length is normally used for an IPv6 LAN subnet?', a: '/64. Stateless address autoconfiguration (SLAAC) depends on a 64-bit interface identifier. Organizations commonly receive a /48 or /56 from which to carve /64 subnets.' },
            { id: 'slash31', level: 3, q: 'Why might a point-to-point link use a /31?', a: 'RFC 3021 allows both addresses in a /31 to be used on point-to-point links, since no broadcast address is needed. This saves addresses compared with a /30, but platform support should be confirmed.' },
            { id: 'summarize', level: 3, q: 'What single route summarizes 192.168.0.0/24 through 192.168.3.0/24?', a: '192.168.0.0/22. Four contiguous /24s share their first 22 bits, so one /22 covers .0.0 through .3.255. Summarization shrinks routing tables.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'cabling-media',
        title: 'Cabling & Media',
        short: 'CB',
        color: 'from-red-500 to-pink-500',
        category: 'foundations',
        level: 1,
        summary: 'UTP/STP categories, single-mode and multimode fiber, connectors, and distances.',
        description: 'Physical media carries the bits at Layer 1. This deck covers twisted-pair categories, shielding, fiber types, connectors, and transceivers. Distance limits depend on the standard, the cable grade, the optics, and installation quality. Treat the figures here as common reference values, not guarantees.',
        related: ['osi-tcpip', 'network-devices', 'topologies', 'troubleshooting'],
        osiLayers: [1],
        reference: [
            {
                title: 'Twisted-pair categories',
                caption: 'Typical Ethernet support per TIA/IEEE specifications. Channel length is 100 m (90 m permanent link + patch cords) unless noted.',
                columns: ['Category', 'Rated bandwidth', 'Typical Ethernet support', 'Distance notes'],
                rows: [
                    ['Cat5e', '100 MHz', '1000BASE-T; 2.5GBASE-T', '100 m'],
                    ['Cat6', '250 MHz', '1000BASE-T; 10GBASE-T on short runs', '100 m for 1G; ~37–55 m for 10G depending on crosstalk'],
                    ['Cat6a', '500 MHz', '10GBASE-T', '100 m'],
                    ['Cat8', '2000 MHz', '25GBASE-T / 40GBASE-T', '30 m (data center)']
                ]
            },
            {
                title: 'Fiber types',
                caption: 'Reach depends on the specific optic, fiber grade, and link loss budget. Check the transceiver datasheet.',
                columns: ['Type', 'Core', 'Typical light source', 'Example reach'],
                rows: [
                    ['Multimode OM3', '50 µm', '850 nm VCSEL', '10GBASE-SR ≈ 300 m'],
                    ['Multimode OM4', '50 µm', '850 nm VCSEL', '10GBASE-SR ≈ 400 m'],
                    ['Single-mode OS2', '~9 µm', '1310 / 1550 nm laser', '10GBASE-LR 10 km; 10GBASE-ER 40 km']
                ]
            },
            {
                title: 'Common connectors',
                columns: ['Connector', 'Media', 'Notes'],
                rows: [
                    ['RJ45 (8P8C)', 'Twisted pair', 'Ethernet; T568A / T568B pinouts'],
                    ['LC', 'Fiber', 'Small form factor latch; common on SFP modules'],
                    ['SC', 'Fiber', 'Square push-pull'],
                    ['ST', 'Fiber', 'Round bayonet; largely legacy'],
                    ['MPO/MTP', 'Fiber', 'Multi-fiber; parallel optics for 40/100G+'],
                    ['F-type', 'Coax', 'Cable broadband and TV'],
                    ['RJ11', 'Twisted pair', 'Telephone / DSL']
                ]
            }
        ],
        cards: [
            { id: 'copper-100m', level: 1, q: 'What is the maximum channel length for twisted-pair Ethernet?', a: '100 meters total: 90 m of permanent (horizontal) cabling plus up to 10 m of patch cords, per TIA-568. This applies to 10BASE-T through 10GBASE-T when the cable category supports the speed.' },
            { id: 'utp-stp', level: 1, q: 'What is the difference between UTP and STP?', a: 'UTP (unshielded twisted pair) has no shielding. It is cheaper and the most common type.\n\nSTP/FTP adds foil or braided shielding to reduce EMI and crosstalk. It needs proper grounding and is used near electrical noise sources and in industrial settings.' },
            { id: 'twist', level: 1, q: 'Why are the wire pairs in Ethernet cable twisted?', a: 'Twisting causes interference to affect both wires of a pair almost equally, so it cancels out with differential signaling. It also reduces crosstalk between neighboring pairs.' },
            { id: 'cat6a', level: 1, q: 'Which copper category supports 10GBASE-T at the full 100 m?', a: 'Cat6a (or better). Cat6 supports 10GBASE-T only over shorter runs, commonly cited as about 37–55 m, depending on alien crosstalk in the installation.' },
            { id: 'smf-mmf', level: 1, q: 'How do single-mode and multimode fiber differ?', a: 'Single-mode: ~9 µm core, one light path, 1310/1550 nm lasers, reach of kilometers to tens of kilometers.\n\nMultimode: 50 µm (or legacy 62.5 µm) core, many light paths, usually 850 nm VCSELs, reach of hundreds of meters, cheaper optics.' },
            { id: 'rj45', level: 1, q: 'Which connector is used for twisted-pair Ethernet?', a: 'The RJ45 (technically 8P8C) modular connector, wired to the T568A or T568B pinout.' },
            { id: 'fiber-connectors', level: 2, q: 'Name four common fiber connectors.', a: 'LC: small latch connector, common on SFP transceivers\nSC: square push-pull\nST: round bayonet twist-lock, mostly legacy\nMPO/MTP: multi-fiber, used for parallel 40/100G+ optics' },
            { id: 'modal', level: 2, q: 'What limits the distance of multimode fiber?', a: 'Modal dispersion. Light travels down many paths (modes) that arrive at slightly different times, smearing pulses together. Higher speeds tolerate less dispersion, which is why fiber grade (OM3, OM4, OM5) matters.' },
            { id: 'fiber-reach', level: 2, q: 'What are typical reaches for 10G fiber optics?', a: '10GBASE-SR (multimode, 850 nm): about 300 m on OM3 and 400 m on OM4.\n10GBASE-LR (single-mode, 1310 nm): 10 km.\n\nActual reach depends on the optic and the link’s loss budget.' },
            { id: 'crossover', level: 2, q: 'What is the difference between straight-through and crossover cables?', a: 'Straight-through: same pinout on both ends (e.g. T568B–T568B), traditionally host-to-switch.\nCrossover: T568A on one end and T568B on the other, traditionally for like devices (switch-to-switch).\n\nMost modern ports support Auto-MDI-X, so either cable usually works.' },
            { id: 'sfp', level: 2, q: 'What is an SFP module?', a: 'A hot-swappable Small Form-factor Pluggable transceiver. It lets one switch port use different media (copper, multimode, single-mode) and reaches. Variants: SFP (1G), SFP+ (10G), SFP28 (25G), QSFP+/QSFP28 (40/100G).' },
            { id: 'plenum', level: 2, q: 'What is plenum-rated cable?', a: 'Cable whose jacket produces low smoke and resists flame spread (CMP rating). Building and fire codes require it in air-handling spaces such as drop ceilings used for return air. Requirements vary by jurisdiction.' },
            { id: 'coax', level: 2, q: 'Where is coaxial cable still common?', a: 'Cable broadband (DOCSIS) and TV distribution, usually RG-6 with F-type connectors. Early Ethernet (10BASE2/10BASE5) also used coax in a bus topology.' },
            { id: 'poe', level: 3, q: 'What are the IEEE Power over Ethernet standards?', a: '802.3af (PoE): up to 15.4 W at the switch port\n802.3at (PoE+): up to 30 W\n802.3bt Type 3: up to 60 W; Type 4: up to 90 W\n\nThe powered device receives somewhat less because of loss in the cable.' },
            { id: 'attenuation', level: 3, q: 'What is attenuation, and how does it compare between copper and fiber?', a: 'Attenuation is signal loss over distance. Copper loses signal faster, and loss rises with frequency. Fiber has far lower loss per kilometer and is immune to electromagnetic interference, which allows much longer runs.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'topologies',
        title: 'Network Topologies',
        short: 'TP',
        color: 'from-violet-500 to-purple-500',
        category: 'foundations',
        level: 1,
        summary: 'Star, mesh, bus, ring, and hybrid layouts, plus LAN, WAN, MAN, and PAN.',
        description: 'Topology describes how devices are connected (physical) and how data flows (logical). This deck covers the classic topology shapes, the network types defined by geographic scope, and the design patterns used in modern campuses and data centers.',
        related: ['network-devices', 'cabling-media', 'switching-vlans', 'wan-vpn'],
        osiLayers: [1, 2],
        reference: [
            {
                title: 'Topology comparison',
                columns: ['Topology', 'Redundancy', 'Cost / cabling', 'Typical use'],
                rows: [
                    ['Star', 'Low (central device is a single point of failure)', 'Moderate', 'Most Ethernet LANs'],
                    ['Full mesh', 'Very high', 'High: n(n−1)/2 links', 'Small cores, critical links'],
                    ['Partial mesh', 'High', 'Moderate–high', 'WAN cores'],
                    ['Bus', 'None (a break disrupts the segment)', 'Low', 'Legacy coax Ethernet'],
                    ['Ring', 'Low; dual rings add redundancy', 'Moderate', 'Legacy LANs, carrier SONET rings'],
                    ['Hybrid', 'Varies', 'Varies', 'Campus (extended star)']
                ]
            },
            {
                title: 'Network types by scope',
                columns: ['Type', 'Scope', 'Examples'],
                rows: [
                    ['PAN', 'A few meters around a person', 'Bluetooth, USB'],
                    ['LAN', 'Building or campus', 'Ethernet, Wi-Fi'],
                    ['MAN', 'City or metro area', 'Metro Ethernet, municipal fiber'],
                    ['WAN', 'Regions to global', 'Leased lines, MPLS, the internet']
                ]
            }
        ],
        cards: [
            { id: 'star', level: 1, q: 'What is a star topology?', a: 'Every node connects to a central device, usually a switch. It is easy to add devices and isolate faults, but the central device is a single point of failure. This is the most common LAN topology today.' },
            { id: 'mesh', level: 1, q: 'What is a mesh topology?', a: 'Nodes have multiple interconnections. In a full mesh every node links to every other node, which gives high redundancy but is expensive. In a partial mesh only some nodes interconnect, which is common in WAN cores.' },
            { id: 'bus', level: 1, q: 'What is a bus topology?', a: 'All devices share a single backbone cable with terminators at each end. Devices compete for the medium (collisions), and one break can take down the whole segment. Legacy, e.g. 10BASE2 coax Ethernet.' },
            { id: 'ring', level: 1, q: 'What is a ring topology?', a: 'Each node connects to two neighbors, forming a closed loop that data travels around. A single break can disrupt it unless a dual ring is used (as in FDDI). Carrier SONET/SDH networks still use rings.' },
            { id: 'lan', level: 1, q: 'What is a LAN?', a: 'A local area network covers a limited area such as a home, office, or campus and is usually owned by one organization. It is typically built with Ethernet and Wi-Fi.' },
            { id: 'wan', level: 1, q: 'What is a WAN?', a: 'A wide area network connects geographically separated sites, often over carrier services or the internet. The internet is the largest WAN.' },
            { id: 'man', level: 1, q: 'What is a MAN?', a: 'A metropolitan area network spans a city or metro region, larger than a LAN but smaller than a WAN. Examples include a city’s fiber ring connecting government buildings and metro Ethernet services.' },
            { id: 'pan', level: 1, q: 'What is a PAN?', a: 'A personal area network connects devices within a few meters of a person, such as a phone paired with earbuds over Bluetooth or a USB-connected peripheral.' },
            { id: 'mesh-math', level: 2, q: 'How many links does a full mesh of 6 nodes need?', a: 'n(n−1)/2 = 6 × 5 / 2 = 15 links.' },
            { id: 'hybrid', level: 2, q: 'What is a hybrid topology?', a: 'A combination of topologies. A common example is an extended star (star of stars), where access switches connect to distribution switches, which connect to a core.' },
            { id: 'physical-logical', level: 2, q: 'What is the difference between physical and logical topology?', a: 'Physical topology is how cables and devices are laid out. Logical topology is how data actually flows. Example: an Ethernet hub network is physically a star but logically a bus, because every frame reaches every port.' },
            { id: 'three-tier', level: 2, q: 'What are the layers of the hierarchical campus design?', a: 'Access (end devices connect), distribution (aggregation and policy), and core (high-speed backbone). Smaller networks often use a collapsed core, which merges core and distribution.' },
            { id: 'hub-spoke', level: 2, q: 'What are the trade-offs of a hub-and-spoke WAN?', a: 'Branches (spokes) connect to a central hub site. It is simple and inexpensive, but the hub is a bottleneck and single point of failure, and branch-to-branch traffic must pass through the hub.' },
            { id: 'spine-leaf', level: 3, q: 'What is a spine-leaf topology?', a: 'A data center design where every leaf (access) switch connects to every spine switch. Any server-to-server path is leaf–spine–leaf, giving predictable latency. It scales by adding spines or leaves.' },
            { id: 'san', level: 3, q: 'What is a SAN?', a: 'A storage area network is a dedicated high-speed network that gives servers block-level access to shared storage, using Fibre Channel or IP-based protocols such as iSCSI.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'network-devices',
        title: 'Network Devices',
        short: 'DV',
        color: 'from-amber-500 to-orange-500',
        category: 'foundations',
        level: 1,
        summary: 'Routers, switches, firewalls, access points, hubs, and what each one does.',
        description: 'Each network device makes forwarding or filtering decisions using information from a particular layer. Knowing which layer a device works at explains what it can see, what it can control, and where it fits in a design. Many modern devices combine several roles.',
        related: ['osi-tcpip', 'switching-vlans', 'routing', 'security', 'wireless'],
        osiLayers: [1, 2, 3, 4, 7],
        reference: [
            {
                title: 'Device roles',
                caption: 'Typical primary layer. Feature sets vary by product.',
                columns: ['Device', 'Typical layer', 'Forwards / decides based on', 'Key function'],
                rows: [
                    ['Hub / repeater', 'L1', 'Nothing (repeats bits)', 'Regenerates signal to all ports'],
                    ['Switch', 'L2', 'Destination MAC', 'Forwards frames within a LAN/VLAN'],
                    ['Access point', 'L2', 'MAC (bridges 802.11 ↔ Ethernet)', 'Connects wireless clients'],
                    ['Router', 'L3', 'Destination IP', 'Forwards packets between networks'],
                    ['Layer 3 switch', 'L2 / L3', 'MAC and IP', 'Fast inter-VLAN routing'],
                    ['Firewall', 'L3–L7', 'Security policy rules', 'Permits or denies traffic'],
                    ['Load balancer', 'L4 / L7', 'Ports, or HTTP content', 'Spreads requests across servers'],
                    ['Modem', 'L1 / L2', 'n/a', 'Connects premises to ISP medium']
                ]
            }
        ],
        cards: [
            { id: 'hub', level: 1, q: 'What does a hub do?', a: 'A Layer 1 device that repeats incoming bits out every other port. All ports share one collision domain and run half-duplex. Hubs are obsolete and have been replaced by switches.' },
            { id: 'switch', level: 1, q: 'What does a switch do?', a: 'A Layer 2 device that learns source MAC addresses into its MAC address table and forwards each frame only out the port toward its destination MAC. Each port is its own collision domain.' },
            { id: 'router', level: 1, q: 'What does a router do?', a: 'A Layer 3 device that forwards packets between different networks, using its routing table and the destination IP address. Routers separate broadcast domains and commonly act as a host’s default gateway.' },
            { id: 'firewall', level: 1, q: 'What does a firewall do?', a: 'It enforces a security policy by permitting or denying traffic based on rules. Stateful firewalls track connections and allow return traffic automatically. Next-generation firewalls (NGFWs) add application awareness, intrusion prevention, and user identity.' },
            { id: 'ap', level: 1, q: 'What does a wireless access point do?', a: 'It bridges 802.11 wireless clients onto the wired LAN. APs may be autonomous (configured individually) or managed by a wireless LAN controller or cloud service.' },
            { id: 'modem', level: 1, q: 'What does a modem do?', a: 'It modulates and demodulates signals so digital data can travel over a provider’s medium (cable, DSL, or similar), connecting a site to its ISP. Fiber services use an ONT for the same role.' },
            { id: 'domains', level: 2, q: 'Which devices break up collision domains, and which break up broadcast domains?', a: 'Switches (and bridges) create a separate collision domain per port.\nRouters, along with VLANs on switches, create separate broadcast domains.\nHubs break up neither.' },
            { id: 'unknown-mac', level: 2, q: 'What does a switch do with a frame whose destination MAC isn’t in its table?', a: 'It floods the frame out every port in that VLAN except the one it arrived on (unknown unicast flooding). When the destination replies, the switch learns its port.' },
            { id: 'l3-switch', level: 2, q: 'How does a Layer 3 switch differ from a router?', a: 'A Layer 3 switch routes between VLANs at high speed in hardware and is optimized for Ethernet LANs. Routers typically offer WAN interfaces and richer features such as NAT, VPN, and extensive routing policy. The line between them varies by vendor and model.' },
            { id: 'wlc', level: 2, q: 'What is a wireless LAN controller (WLC)?', a: 'A central system (appliance, virtual, or cloud) that manages many access points: configuration, RF channel and power tuning, client roaming, and security policy.' },
            { id: 'load-balancer', level: 2, q: 'What does a load balancer do?', a: 'It distributes client requests across a pool of servers for scalability and availability. It decides at Layer 4 (IP/port) or Layer 7 (e.g. HTTP path or headers) and uses health checks to avoid failed servers.' },
            { id: 'ids-ips', level: 2, q: 'What is the difference between an IDS and an IPS?', a: 'An IDS (intrusion detection system) monitors a copy of traffic and alerts. An IPS (intrusion prevention system) sits inline and can block malicious traffic as well as alert.' },
            { id: 'proxy', level: 2, q: 'What is the difference between a forward proxy and a reverse proxy?', a: 'A forward proxy acts on behalf of clients, for content filtering, caching, and controlled internet access. A reverse proxy sits in front of servers and handles TLS termination, caching, load balancing, and shielding back-end systems.' },
            { id: 'bridge', level: 2, q: 'What is a bridge?', a: 'A Layer 2 device that connects two segments and forwards or filters frames by MAC address. A switch is essentially a multiport, hardware-accelerated bridge.' },
            { id: 'media-converter', level: 2, q: 'What is a media converter?', a: 'A device that converts between media types, such as copper twisted pair to fiber, so a link can extend beyond copper distance limits or join different cabling.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'routing',
        title: 'Routing',
        short: 'RT',
        color: 'from-emerald-500 to-teal-500',
        category: 'infrastructure',
        level: 2,
        summary: 'Static routing, OSPF, EIGRP, BGP, and how routers select a route.',
        description: 'Routers choose where to send each packet by matching its destination against the routing table. Routes come from directly connected networks, static configuration, and dynamic routing protocols. Route selection terms and default values differ between vendors. Values shown here are common Cisco defaults and are labeled as such.',
        related: ['ip-addressing', 'network-devices', 'wan-vpn', 'troubleshooting'],
        osiLayers: [3],
        reference: [
            {
                title: 'Route sources at a glance',
                caption: 'Administrative distance values are Cisco IOS defaults. Other vendors use different “preference” values.',
                columns: ['Source', 'Type', 'Algorithm / basis', 'Metric', 'Default AD (Cisco)'],
                rows: [
                    ['Connected', 'n/a', 'Interface is up with an address', 'n/a', '0'],
                    ['Static', 'Manual', 'Administrator configured', 'n/a', '1'],
                    ['eBGP', 'EGP', 'Path vector', 'Path attributes', '20'],
                    ['EIGRP (internal)', 'IGP', 'Advanced distance vector (DUAL)', 'Bandwidth + delay (default)', '90'],
                    ['OSPF', 'IGP', 'Link state (Dijkstra SPF)', 'Cost', '110'],
                    ['RIP', 'IGP', 'Distance vector', 'Hop count (max 15)', '120'],
                    ['iBGP', 'EGP', 'Path vector', 'Path attributes', '200']
                ]
            }
        ],
        cards: [
            { id: 'routing-table', level: 1, q: 'How does a router decide where to send a packet?', a: 'It looks up the destination IP in its routing table, a list of prefixes with a next hop or exit interface, and uses the most specific matching route.' },
            { id: 'static', level: 1, q: 'What is a static route, and when is it a good fit?', a: 'A manually configured route. It has no protocol overhead and is predictable, but it doesn’t adapt to failures unless combined with tracking or backup routes. Good for small networks and stub sites with one exit.' },
            { id: 'default', level: 1, q: 'What is a default route?', a: '0.0.0.0/0 (or ::/0 for IPv6). It matches any destination when no more specific route exists, and is sometimes called the “gateway of last resort.”' },
            { id: 'lpm', level: 2, q: 'A router has routes for 10.0.0.0/8 and 10.1.1.0/24. Which does it use for 10.1.1.5?', a: '10.1.1.0/24. Longest prefix match: the most specific route wins, regardless of which protocol supplied it.' },
            { id: 'selection', level: 2, q: 'In what order are routes compared when choosing the best path?', a: '1. Longest prefix match (most specific).\n2. For the same prefix from different sources: the most trusted source. Cisco calls this administrative distance; other vendors use “preference.”\n3. Within one protocol: the lowest metric.\n\nEqual-cost paths may be load-shared (ECMP).' },
            { id: 'ad', level: 2, q: 'What is administrative distance (AD)?', a: 'A Cisco term for how trustworthy a route source is; lower is preferred. Cisco defaults: connected 0, static 1, eBGP 20, EIGRP 90, OSPF 110, RIP 120, iBGP 200. Other vendors use their own values.' },
            { id: 'igp-egp', level: 2, q: 'What is the difference between an IGP and an EGP?', a: 'An Interior Gateway Protocol routes within one autonomous system (OSPF, EIGRP, IS-IS, RIP). An Exterior Gateway Protocol routes between autonomous systems. BGP is the EGP used on the internet.' },
            { id: 'dv-ls', level: 2, q: 'What is the difference between distance-vector and link-state protocols?', a: 'Distance vector: routers share route lists with neighbors and know only distance and direction (e.g. RIP).\n\nLink state: routers flood information about their links, so each builds a full map of its area and calculates its own shortest paths (e.g. OSPF, IS-IS).' },
            { id: 'ospf', level: 2, q: 'What are OSPF’s key characteristics?', a: 'Open-standard link-state IGP. Routers exchange LSAs to build an identical link-state database per area, then run Dijkstra’s SPF algorithm. The metric is cost. Multi-area designs connect through backbone area 0.' },
            { id: 'ospf-cost', level: 2, q: 'How is OSPF cost calculated by default on Cisco devices?', a: 'Cost = reference bandwidth ÷ interface bandwidth, with a default reference of 100 Mbps. Every link of 100 Mbps or faster therefore costs 1 unless the reference bandwidth is raised. The OSPF standard leaves cost values to the implementation.' },
            { id: 'eigrp', level: 2, q: 'What are EIGRP’s key characteristics?', a: 'An advanced distance-vector protocol using DUAL to compute loop-free paths. Precomputed backups (feasible successors) allow fast convergence. Its default composite metric uses bandwidth and delay. Developed by Cisco and published as informational RFC 7868, it is mainly found on Cisco equipment.' },
            { id: 'bgp', level: 2, q: 'What are BGP’s key characteristics?', a: 'A path-vector protocol that exchanges routes between autonomous systems over TCP port 179. Instead of a single metric, it selects paths using attributes such as local preference, AS-path length, origin, and MED, which makes it highly policy-driven.' },
            { id: 'ttl', level: 2, q: 'What role does TTL play in routing?', a: 'Each router decrements the IPv4 TTL (IPv6 Hop Limit). At zero the packet is discarded and an ICMP Time Exceeded message is sent back. This stops packets from looping forever, and traceroute relies on it.' },
            { id: 'ebgp-ibgp', level: 3, q: 'What is the difference between eBGP and iBGP?', a: 'eBGP runs between routers in different autonomous systems. iBGP carries external routes between routers within the same AS. Because iBGP doesn’t re-advertise routes learned from one iBGP peer to another, it needs a full mesh or route reflectors/confederations.' },
            { id: 'floating', level: 3, q: 'What is a floating static route?', a: 'A static route configured with a worse administrative distance than the dynamic route to the same prefix. It stays out of the routing table until the primary route disappears, so it acts as a backup.' },
            { id: 'convergence', level: 3, q: 'What is convergence?', a: 'The process of all routers agreeing on a consistent view of the network after a change. Faster convergence means less packet loss and fewer temporary loops during failures.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'switching-vlans',
        title: 'Switching & VLANs',
        short: 'VL',
        color: 'from-amber-500 to-yellow-500',
        category: 'infrastructure',
        level: 2,
        summary: 'VLANs, 802.1Q trunking, Spanning Tree Protocol, and inter-VLAN routing.',
        description: 'Switches forward frames inside a LAN, and VLANs divide one physical switched network into separate broadcast domains. This deck covers tagging and trunking, how Spanning Tree prevents Layer 2 loops, and the options for routing between VLANs. Some feature names (such as PortFast and DTP) are vendor-specific and are labeled as such.',
        related: ['network-devices', 'routing', 'topologies', 'security', 'troubleshooting'],
        osiLayers: [2, 3],
        reference: [
            {
                title: '802.1Q tag fields',
                caption: 'Inserted after the source MAC address. Adds 4 bytes to the Ethernet frame.',
                columns: ['Field', 'Size', 'Purpose'],
                rows: [
                    ['TPID', '16 bits', '0x8100: identifies the frame as 802.1Q-tagged'],
                    ['PCP', '3 bits', 'Priority (802.1p class of service)'],
                    ['DEI', '1 bit', 'Drop eligible indicator'],
                    ['VID', '12 bits', 'VLAN ID (1–4094 usable)']
                ]
            }
        ],
        cards: [
            { id: 'vlan', level: 1, q: 'What is a VLAN?', a: 'A virtual LAN: a logical Layer 2 broadcast domain created on switches, independent of physical location. Devices in different VLANs need a router or Layer 3 switch to communicate.' },
            { id: 'access-trunk', level: 1, q: 'What is the difference between an access port and a trunk port?', a: 'An access port carries a single VLAN, untagged, for an end device. A trunk port carries multiple VLANs, using tags to identify each frame’s VLAN. Trunks connect switches, routers, and APs.' },
            { id: 'vlan1', level: 1, q: 'Why do best practices say not to use VLAN 1 for user traffic?', a: 'VLAN 1 is the default VLAN on many switches. Every port starts in it and some control protocols use it. Moving users and management to dedicated VLANs reduces the impact of misconfiguration and limits exposure.' },
            { id: 'dot1q', level: 2, q: 'What is 802.1Q?', a: 'The IEEE standard for VLAN tagging. A 4-byte tag inserted after the source MAC carries a 12-bit VLAN ID (1–4094 usable) and a 3-bit priority (PCP) field.' },
            { id: 'native', level: 2, q: 'What is the native VLAN on an 802.1Q trunk?', a: 'The VLAN whose frames are sent untagged on the trunk. It must match on both ends. Best practice is to use a dedicated, otherwise-unused VLAN as native, or tag it where the platform supports that.' },
            { id: 'stp-why', level: 2, q: 'Why is Spanning Tree Protocol needed?', a: 'Redundant Layer 2 links create loops. Ethernet frames have no TTL, so broadcasts circulate endlessly (a broadcast storm) and MAC tables become unstable. STP blocks redundant paths to form a loop-free tree and unblocks them if the active path fails.' },
            { id: 'root-bridge', level: 2, q: 'How is the STP root bridge elected?', a: 'The switch with the lowest bridge ID wins. The bridge ID is the priority (default 32768) plus the MAC address. Set a lower priority on the intended core switch rather than leaving the choice to whichever has the lowest MAC.' },
            { id: 'stp-roles', level: 2, q: 'What are the STP port roles and classic port states?', a: 'Roles: root port (best path to root), designated port (forwarding on a segment), and alternate/backup (blocked).\n\n802.1D states: blocking → listening → learning → forwarding (plus disabled). RSTP simplifies these to discarding, learning, and forwarding.' },
            { id: 'rstp', level: 2, q: 'How do RSTP and MSTP improve on classic STP?', a: 'RSTP (originally 802.1w) converges in seconds or less instead of the ~30–50 seconds of classic STP. MSTP (originally 802.1s) maps groups of VLANs to a few spanning-tree instances so different VLANs can use different paths.' },
            { id: 'intervlan', level: 2, q: 'What are the main ways to route between VLANs?', a: '• Router-on-a-stick: one router interface configured as a trunk with a subinterface per VLAN.\n• Layer 3 switch with an SVI per VLAN, the most common approach in campus networks.\n• A separate physical router interface per VLAN, which doesn’t scale.' },
            { id: 'svi', level: 2, q: 'What is an SVI?', a: 'A switched virtual interface: a virtual Layer 3 interface on a switch tied to a VLAN. It usually serves as the default gateway for hosts in that VLAN.' },
            { id: 'mac-table', level: 2, q: 'How does a switch build its MAC address table?', a: 'It records each frame’s source MAC address along with the port and VLAN it arrived on. Entries age out if not refreshed; 300 seconds is a common default.' },
            { id: 'edge-port', level: 3, q: 'What are edge ports (PortFast) and BPDU Guard?', a: 'An edge port connected to an end host skips the listening/learning delay so it forwards immediately. “PortFast” is Cisco’s name for this. BPDU Guard disables such a port if it receives a BPDU, protecting against a switch being plugged in where a host is expected.' },
            { id: 'lacp', level: 3, q: 'What is link aggregation (LACP)?', a: 'Bundling several physical links into one logical link for more bandwidth and redundancy. LACP (IEEE 802.1AX, formerly 802.3ad) negotiates the bundle. Spanning Tree sees it as a single link, so no member is blocked.' },
            { id: 'vlan-hopping', level: 3, q: 'Conceptually, what is VLAN hopping, and how is it prevented?', a: 'Traffic escaping its VLAN by abusing automatic trunk negotiation or double-tagging on the native VLAN.\n\nPrevention: statically set access ports to access mode, disable automatic trunk negotiation (e.g. Cisco DTP), use an unused native VLAN, and allow only required VLANs on trunks.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'wireless',
        title: 'Wireless',
        short: 'WF',
        color: 'from-sky-500 to-cyan-500',
        category: 'infrastructure',
        level: 2,
        summary: '802.11 a/b/g/n/ac/ax, frequency bands, channels, and WPA2/WPA3 security.',
        description: 'Wi-Fi carries Ethernet-style frames over radio. Capabilities depend on the 802.11 standard, the band, the channel width, and the devices on both ends. Regulatory rules on channels and power also vary by country. Data rates in standards are theoretical maximums, and real-world throughput is much lower.',
        related: ['network-devices', 'security', 'cabling-media', 'topologies'],
        osiLayers: [1, 2],
        reference: [
            {
                title: '802.11 standards',
                caption: 'Maximum rates are theoretical PHY rates using the widest channels and most spatial streams the standard allows. Real throughput is far lower and depends on devices, interference, and distance.',
                columns: ['Standard', 'Wi-Fi name', 'Bands', 'Max theoretical rate'],
                rows: [
                    ['802.11b', 'n/a', '2.4 GHz', '11 Mbps'],
                    ['802.11a', 'n/a', '5 GHz', '54 Mbps'],
                    ['802.11g', 'n/a', '2.4 GHz', '54 Mbps'],
                    ['802.11n', 'Wi-Fi 4', '2.4 / 5 GHz', '600 Mbps'],
                    ['802.11ac', 'Wi-Fi 5', '5 GHz', '~6.9 Gbps'],
                    ['802.11ax', 'Wi-Fi 6 / 6E', '2.4 / 5 GHz (+6 GHz for 6E)', '~9.6 Gbps'],
                    ['802.11be', 'Wi-Fi 7', '2.4 / 5 / 6 GHz', '~46 Gbps']
                ],
                footnote: '6 GHz availability depends on national regulators.'
            },
            {
                title: 'Wi-Fi security generations',
                columns: ['Protocol', 'Encryption', 'Status'],
                rows: [
                    ['WEP', 'RC4', 'Broken; do not use'],
                    ['WPA', 'TKIP', 'Deprecated'],
                    ['WPA2', 'AES-CCMP', 'Acceptable where WPA3 is unavailable'],
                    ['WPA3', 'AES (GCMP/CCMP), SAE for Personal', 'Recommended']
                ]
            }
        ],
        cards: [
            { id: 'bands', level: 1, q: 'How do the 2.4 GHz and 5 GHz bands compare?', a: '2.4 GHz: longer range and better penetration through walls, but few non-overlapping channels and more interference (Bluetooth, microwaves).\n\n5 GHz: many more channels and higher throughput, but shorter range.' },
            { id: 'channels-24', level: 1, q: 'Which 2.4 GHz channels don’t overlap?', a: 'With 20 MHz channels in North America and many other regions: channels 1, 6, and 11. Available channels vary by regulatory domain.' },
            { id: 'ax', level: 1, q: 'What does 802.11ax (Wi-Fi 6) add?', a: 'Efficiency features for busy environments: OFDMA (sharing a channel among clients at once), uplink and downlink MU-MIMO, BSS coloring to reduce interference, and Target Wake Time to save battery. Wi-Fi 6E extends it into the 6 GHz band where permitted.' },
            { id: 'ac', level: 1, q: 'What are the key features of 802.11ac (Wi-Fi 5)?', a: '5 GHz only, wider channels (80 and 160 MHz), 256-QAM modulation, and downlink MU-MIMO (in “Wave 2” products).' },
            { id: 'n', level: 1, q: 'What did 802.11n (Wi-Fi 4) introduce?', a: 'MIMO (multiple spatial streams) and channel bonding (40 MHz channels), on both 2.4 and 5 GHz.' },
            { id: 'ssid', level: 1, q: 'What is the difference between an SSID and a BSSID?', a: 'The SSID is the network name users see. The BSSID is the MAC address of a specific AP radio serving that SSID. Multiple APs sharing one SSID form an ESS, which lets clients roam.' },
            { id: 'abg', level: 1, q: 'How do 802.11a, b, and g differ?', a: '802.11a: 5 GHz, up to 54 Mbps\n802.11b: 2.4 GHz, up to 11 Mbps\n802.11g: 2.4 GHz, up to 54 Mbps, backward compatible with b' },
            { id: 'wpa2-wpa3', level: 2, q: 'How does WPA3 improve on WPA2?', a: 'WPA2-Personal uses a pre-shared key; captured handshakes can be guessed offline if the passphrase is weak. WPA3-Personal uses SAE, which resists offline dictionary attacks and provides forward secrecy. WPA3 also requires Protected Management Frames (PMF).' },
            { id: 'personal-enterprise', level: 2, q: 'What is the difference between WPA2/WPA3 Personal and Enterprise?', a: 'Personal: everyone shares one passphrase.\nEnterprise: 802.1X authentication against a RADIUS server, with per-user credentials or certificates (EAP). Access can be revoked per user and activity can be audited.' },
            { id: 'wep', level: 2, q: 'Why should WEP and WPA (TKIP) no longer be used?', a: 'WEP’s design flaws let its keys be recovered quickly, and TKIP is deprecated with known weaknesses. Use WPA3, or WPA2 with AES where WPA3 isn’t supported.' },
            { id: 'csma-ca', level: 2, q: 'What is CSMA/CA?', a: 'Carrier Sense Multiple Access with Collision Avoidance, the method Wi-Fi uses to share the medium. Stations listen before transmitting, wait random backoff times, and rely on ACKs, because radios can’t reliably detect collisions while transmitting.' },
            { id: 'channel-width', level: 2, q: 'What is the trade-off of wider Wi-Fi channels?', a: 'Wider channels (40/80/160 MHz) raise peak throughput but leave fewer non-overlapping channels and pick up more interference. In dense deployments, narrower channels often give better overall performance.' },
            { id: 'survey', level: 2, q: 'What is a wireless site survey?', a: 'Measuring or modeling RF coverage, signal strength, and interference to plan AP placement, channels, and power. It can be predictive (software model) or on-site (walk-through measurements).' },
            { id: 'rogue', level: 2, q: 'What are rogue APs and evil twins, and how are they defended against?', a: 'A rogue AP is unauthorized hardware connected to the network. An evil twin imitates a legitimate SSID to lure clients.\n\nDefenses: wireless intrusion detection/prevention (WIDS/WIPS), 802.1X with server-certificate validation, WPA3, switch port controls, and user awareness.' },
            { id: 'dfs', level: 3, q: 'What is DFS in 5 GHz Wi-Fi?', a: 'Dynamic Frequency Selection. Some 5 GHz channels are shared with radar systems, so APs must detect radar and move off those channels, which can briefly disconnect clients. Which channels require DFS varies by country.' },
            { id: 'roaming', level: 3, q: 'Which 802.11 amendments help clients roam between APs?', a: '802.11k: neighbor reports (which APs are nearby)\n802.11v: BSS transition management (the network can suggest a better AP)\n802.11r: fast BSS transition (faster re-authentication)' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'network-services',
        title: 'Network Services',
        short: 'SV',
        color: 'from-pink-500 to-fuchsia-500',
        category: 'infrastructure',
        level: 2,
        summary: 'DNS, DHCP, NAT/PAT, HTTP/HTTPS, SMTP, and other core services.',
        description: 'Network services make a network usable: hosts get addresses automatically, names resolve to IPs, private networks reach the internet, and applications such as the web and email work. Most of these services run at the Application layer and rely on the ports covered in Ports & Protocols.',
        related: ['ports-protocols', 'ip-addressing', 'security', 'troubleshooting'],
        osiLayers: [3, 4, 7],
        reference: [
            {
                title: 'Common DNS record types',
                columns: ['Record', 'Purpose'],
                rows: [
                    ['A', 'Name → IPv4 address'],
                    ['AAAA', 'Name → IPv6 address'],
                    ['CNAME', 'Alias to another name'],
                    ['MX', 'Mail servers for a domain'],
                    ['NS', 'Authoritative name servers'],
                    ['PTR', 'IP → name (reverse lookup)'],
                    ['TXT', 'Text data (SPF, DKIM, domain verification)'],
                    ['SOA', 'Zone authority and timers']
                ]
            }
        ],
        cards: [
            { id: 'dns', level: 1, q: 'What does DNS do?', a: 'It translates human-friendly names (example.com) into IP addresses and other records. The namespace is hierarchical (root → top-level domain → authoritative servers), and resolvers cache answers for the record’s TTL.' },
            { id: 'dhcp', level: 1, q: 'What does DHCP provide to a client?', a: 'Automatic IP configuration: an IP address, subnet mask, default gateway, DNS servers, and a lease time, plus optional settings such as domain name or NTP servers.' },
            { id: 'dora', level: 1, q: 'What are the four steps of DHCP address assignment?', a: 'DORA:\nDiscover: client broadcasts looking for a server\nOffer: server offers an address\nRequest: client requests the offered address\nAcknowledge: server confirms the lease\n\nUses UDP 67 (server) and 68 (client).' },
            { id: 'nat', level: 1, q: 'What is NAT?', a: 'Network Address Translation rewrites IP addresses in packet headers as traffic passes through a device. Most commonly it translates private inside addresses to a public address for internet access.' },
            { id: 'http-https', level: 1, q: 'What is the difference between HTTP and HTTPS?', a: 'HTTP sends web traffic in plaintext (TCP 80). HTTPS is HTTP over TLS (443), adding encryption, integrity protection, and server authentication through certificates.' },
            { id: 'smtp', level: 1, q: 'What is SMTP used for?', a: 'Sending and relaying email: server-to-server on port 25, and client submission on port 587. Users retrieve mail with IMAP or POP3.' },
            { id: 'dns-records', level: 2, q: 'What are A, AAAA, CNAME, MX, and PTR records?', a: 'A: name → IPv4\nAAAA: name → IPv6\nCNAME: alias to another name\nMX: mail servers for the domain\nPTR: IP → name (reverse lookup)' },
            { id: 'recursive', level: 2, q: 'What is the difference between recursive and iterative DNS queries?', a: 'A client sends a recursive query to its resolver, asking for the final answer. The resolver then queries root, TLD, and authoritative servers iteratively, each one referring it onward, and caches the result.' },
            { id: 'relay', level: 2, q: 'Why is a DHCP relay agent needed?', a: 'DHCP Discover messages are broadcasts, and routers don’t forward broadcasts. A relay agent on the client’s subnet forwards them as unicast to a DHCP server on another subnet. On Cisco this is configured with “ip helper-address.”' },
            { id: 'reservation', level: 2, q: 'What is the difference between a DHCP reservation and a static IP?', a: 'A reservation tells the DHCP server to always give a specific address to a particular client (by MAC or client ID), managed centrally. A static IP is configured manually on the device itself.' },
            { id: 'pat', level: 2, q: 'What is PAT?', a: 'Port Address Translation, also called NAT overload: many inside hosts share one public IP. The device tracks each connection using unique source port numbers. Most home routers do this.' },
            { id: 'nat-types', level: 2, q: 'How do static NAT, dynamic NAT, and PAT differ?', a: 'Static NAT: fixed one-to-one mapping, often to make an internal server reachable.\nDynamic NAT: inside hosts borrow addresses from a public pool, one-to-one while in use.\nPAT: many-to-one, using ports to distinguish connections.' },
            { id: 'status-codes', level: 2, q: 'What do the HTTP status code classes mean?', a: '1xx informational\n2xx success (200 OK)\n3xx redirection (301, 302)\n4xx client error (403 Forbidden, 404 Not Found)\n5xx server error (500, 503)' },
            { id: 'mail-auth', level: 2, q: 'What are SPF, DKIM, and DMARC?', a: 'SPF: DNS record listing servers allowed to send mail for a domain.\nDKIM: cryptographic signature on messages, with the public key published in DNS.\nDMARC: policy telling receivers what to do when SPF/DKIM checks fail, plus reporting.' },
            { id: 'ntp', level: 2, q: 'Why does NTP matter?', a: 'Accurate, synchronized clocks are needed for log correlation, certificate validity checks, and authentication protocols such as Kerberos. NTP uses UDP 123 and a hierarchy of “stratum” levels.' },
            { id: 'tls', level: 3, q: 'At a high level, what happens in a TLS handshake?', a: 'Client and server agree on a protocol version and cipher suite. The server proves its identity with a certificate. A key exchange (e.g. ECDHE) establishes shared session keys, and traffic is then encrypted symmetrically. TLS 1.3 completes this in one round trip.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'security',
        title: 'Network Security',
        short: 'SC',
        color: 'from-rose-500 to-red-500',
        category: 'operations',
        level: 2,
        summary: 'ACLs, encryption, attack concepts like DoS and MITM, and defensive hardening.',
        description: 'Security protects confidentiality, integrity, and availability. This deck explains common attack concepts at a high level so you can recognize them, then focuses on prevention, detection, and hardening. Only test or monitor networks you own or are explicitly authorized to work on.',
        related: ['network-devices', 'ports-protocols', 'wireless', 'switching-vlans', 'troubleshooting'],
        osiLayers: [2, 3, 4, 7],
        reference: [
            {
                title: 'Attack concepts and defenses',
                caption: 'Conceptual overview for recognition and defense.',
                columns: ['Concept', 'What it is', 'Key defenses'],
                rows: [
                    ['DoS / DDoS', 'Overwhelming a service so legitimate users can’t reach it', 'Upstream/cloud scrubbing, rate limiting, CDN capacity, monitoring'],
                    ['Man-in-the-middle', 'Intercepting or altering traffic between two parties', 'TLS with certificate validation, DAI, DHCP snooping, VPNs'],
                    ['Phishing', 'Tricking users into revealing credentials or running malware', 'MFA, user training, email filtering, SPF/DKIM/DMARC'],
                    ['ARP spoofing', 'Forged ARP replies redirecting LAN traffic', 'Dynamic ARP Inspection, DHCP snooping, segmentation'],
                    ['MAC flooding', 'Filling a switch’s MAC table so frames flood', 'Port security, MAC limits'],
                    ['Rogue DHCP', 'Unauthorized server handing out bad settings', 'DHCP snooping (trusted ports only)']
                ]
            }
        ],
        cards: [
            { id: 'cia', level: 1, q: 'What is the CIA triad?', a: 'Confidentiality (only authorized parties can read data), Integrity (data isn’t altered undetected), and Availability (systems are usable when needed).' },
            { id: 'acl', level: 1, q: 'What is an access control list (ACL)?', a: 'An ordered list of permit/deny rules matching fields such as source and destination IP, protocol, and ports, applied to an interface in a direction. Rules are checked top-down and the first match wins. Many platforms end with an implicit “deny all.”' },
            { id: 'sym-asym', level: 1, q: 'What is the difference between symmetric and asymmetric encryption?', a: 'Symmetric: one shared key encrypts and decrypts (e.g. AES). It is fast and used for bulk data.\nAsymmetric: a public/private key pair (e.g. RSA, ECC). It is used for key exchange and digital signatures.\n\nTLS uses both: asymmetric to set up, symmetric for the session.' },
            { id: 'dos', level: 1, q: 'What are DoS and DDoS attacks, and how are they mitigated?', a: 'Attempts to make a service unavailable by exhausting bandwidth, connections, or processing. DDoS comes from many distributed sources, often botnets.\n\nMitigation: ISP or cloud scrubbing services, rate limiting, CDNs and spare capacity, SYN cookies, and monitoring with an incident response plan.' },
            { id: 'mitm', level: 1, q: 'What is a man-in-the-middle (MITM) attack, and how is it prevented?', a: 'An attacker positions themselves between two parties to intercept or alter traffic, for example via ARP spoofing on a LAN or a rogue access point.\n\nPrevention: encryption with certificate validation (TLS, HSTS), switch protections (DHCP snooping, Dynamic ARP Inspection), 802.1X, and VPNs on untrusted networks.' },
            { id: 'acl-placement', level: 2, q: 'Where should standard and extended ACLs be placed (Cisco guideline)?', a: 'Standard ACLs match only source IP, so place them close to the destination to avoid blocking more than intended. Extended ACLs match source, destination, protocol, and ports, so place them close to the source to drop unwanted traffic early.' },
            { id: 'hashing', level: 2, q: 'What is hashing, and how is it different from encryption?', a: 'Hashing is a one-way function producing a fixed-length digest (e.g. SHA-256) to verify integrity; it can’t be decrypted. Passwords should be stored with slow, salted hashes such as bcrypt, scrypt, or Argon2.' },
            { id: 'phishing', level: 2, q: 'How do organizations defend against phishing?', a: 'Layered controls: multi-factor authentication, user awareness training, email filtering and link scanning, SPF/DKIM/DMARC to reduce spoofing, and an easy way for users to report suspicious messages.' },
            { id: 'arp-spoof', level: 2, q: 'Conceptually, what is ARP spoofing, and how do switches defend against it?', a: 'Forged ARP replies associate an attacker’s MAC with another host’s IP, redirecting traffic. DHCP snooping builds a table of legitimate IP-to-MAC bindings, and Dynamic ARP Inspection drops ARP messages that don’t match it.' },
            { id: 'hardening', level: 2, q: 'What are key steps for hardening a network device?', a: '• Change default credentials; use strong, unique passwords and centralized AAA\n• Patch firmware regularly\n• Disable unused services and ports\n• Manage over SSH/HTTPS, not Telnet/HTTP; use SNMPv3\n• Restrict management access to a management network\n• Send logs to a central syslog/SIEM; back up configs' },
            { id: 'least-privilege', level: 2, q: 'What is the principle of least privilege?', a: 'Users, devices, and services get only the access they need, for only as long as they need it. This limits the damage from mistakes or compromised accounts, and is a foundation of zero-trust approaches.' },
            { id: 'defense-depth', level: 2, q: 'What is defense in depth?', a: 'Layering multiple independent controls (perimeter firewall, segmentation, endpoint protection, MFA, monitoring, backups) so that if one fails, others still protect the environment.' },
            { id: 'dot1x', level: 2, q: 'What is 802.1X?', a: 'Port-based network access control. The supplicant (client) authenticates through the authenticator (switch or AP) to an authentication server (usually RADIUS) before being granted network access. It is often paired with NAC policies.' },
            { id: 'segmentation', level: 2, q: 'Why segment a network?', a: 'Dividing it into zones (VLANs, subnets, firewall policies) limits lateral movement if a device is compromised, contains broadcast traffic, and makes policy clearer. Public-facing servers often sit in a DMZ.' },
            { id: 'port-security', level: 2, q: 'What does switch port security do?', a: 'It limits which or how many MAC addresses may use a port, and acts on violations (e.g. shut down or restrict the port). This helps defend against MAC flooding and unauthorized devices.' },
            { id: 'mfa', level: 3, q: 'What makes authentication “multi-factor”?', a: 'It requires factors from at least two different categories: something you know (password), something you have (security key, authenticator app), and something you are (biometric). Two passwords count as one factor.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        short: 'TS',
        color: 'from-indigo-500 to-blue-500',
        category: 'operations',
        level: 2,
        summary: 'Structured methodology, OSI top-down/bottom-up approaches, ping, traceroute, and nslookup.',
        description: 'Good troubleshooting is methodical: define the problem, form and test theories, fix, verify, and document. The OSI model provides a map for isolating faults, and a handful of command-line tools answer most first-pass questions. Command names and output differ slightly between Windows, Linux, and macOS.',
        related: ['osi-tcpip', 'network-services', 'ip-addressing', 'routing', 'cabling-media'],
        osiLayers: [1, 2, 3, 4, 7],
        reference: [
            {
                title: 'Everyday troubleshooting tools',
                caption: 'Use these on networks you manage or are authorized to troubleshoot.',
                columns: ['Tool', 'What it tells you', 'Example'],
                rows: [
                    ['ping', 'Reachability and round-trip time (ICMP echo)', 'ping 192.0.2.1'],
                    ['traceroute / tracert', 'Hop-by-hop path to a destination', 'tracert example.com (Windows)\ntraceroute example.com (Linux/macOS)'],
                    ['nslookup / dig', 'DNS resolution and which server answered', 'nslookup example.com'],
                    ['ipconfig / ip', 'Local IP, mask, gateway, DNS, MAC', 'ipconfig /all (Windows)\nip addr (Linux)'],
                    ['arp', 'IP-to-MAC mappings in the ARP cache', 'arp -a'],
                    ['netstat / ss', 'Active connections and listening ports', 'netstat -an\nss -tuln (Linux)'],
                    ['pathping / mtr', 'Path plus per-hop loss and latency', 'pathping example.com'],
                    ['Wireshark / tcpdump', 'Packet-level capture and analysis', 'Capture on an interface'],
                    ['Cable tester / TDR', 'Wiring faults, cable length, break location', 'Test a patch run']
                ]
            }
        ],
        cards: [
            { id: 'methodology', level: 1, q: 'What are the steps of the CompTIA troubleshooting methodology?', a: '1. Identify the problem\n2. Establish a theory of probable cause\n3. Test the theory to determine the cause\n4. Establish a plan of action and identify potential effects\n5. Implement the solution or escalate\n6. Verify full system functionality and implement preventive measures\n7. Document findings, actions, outcomes, and lessons learned' },
            { id: 'bottom-up', level: 1, q: 'What is the bottom-up troubleshooting approach?', a: 'Start at Layer 1 (cables, link lights, interfaces) and work upward. It is thorough and well suited to suspected physical problems or new installations, but can be slow when the issue is actually in an application.' },
            { id: 'top-down', level: 1, q: 'What is the top-down troubleshooting approach?', a: 'Start at Layer 7 (the application the user reports) and work downward. It is useful when the problem seems application-specific, for example when one website fails but others work.' },
            { id: 'ping', level: 1, q: 'What does ping test?', a: 'It sends ICMP Echo Requests and reports replies and round-trip times, testing Layer 3 reachability. Firewalls often block ICMP, so no reply doesn’t prove a host is down.' },
            { id: 'traceroute', level: 1, q: 'How does traceroute work?', a: 'It sends probes with increasing TTL values. Each router that decrements TTL to zero returns ICMP Time Exceeded, revealing the path hop by hop. Windows tracert uses ICMP probes; Linux/macOS traceroute uses UDP by default. A “* * *” line means that hop didn’t reply, which isn’t necessarily a failure.' },
            { id: 'nslookup', level: 1, q: 'What is nslookup used for?', a: 'Querying DNS directly: checking whether a name resolves, what records it returns, and which DNS server answered. dig is a common alternative on Linux/macOS.' },
            { id: 'what-changed', level: 1, q: 'What are good first questions when a problem is reported?', a: 'What exactly is failing? What changed recently? What is the scope: one user, one site, or everyone? When did it start? Recent changes are among the most common causes.' },
            { id: 'divide', level: 2, q: 'What is the divide-and-conquer approach?', a: 'Start in the middle of the stack, often with a Layer 3 test such as ping. If it succeeds, the lower layers are probably fine and you look higher; if it fails, you look lower.' },
            { id: 'ping-ip-not-name', level: 2, q: 'You can ping 8.8.8.8 but not google.com. What is the likely issue?', a: 'IP connectivity works, so name resolution is failing. Check the host’s configured DNS servers and test with nslookup.' },
            { id: 'apipa', level: 2, q: 'A PC has a 169.254.x.x address. What do you check?', a: 'The PC didn’t get a DHCP lease. Check physical or Wi-Fi connectivity, the switch port’s VLAN, whether the DHCP server is up with free addresses in the scope, and whether a DHCP relay is configured on the subnet.' },
            { id: 'local-only', level: 2, q: 'A host can reach devices on its own subnet but nothing beyond it. What do you suspect?', a: 'A missing or wrong default gateway, the gateway being down, or a routing problem beyond the gateway. Check ipconfig/ip route, ping the gateway, then traceroute.' },
            { id: 'ipconfig', level: 2, q: 'What does ipconfig /all (or ip addr / ip route) show?', a: 'The host’s IP address, subnet mask/prefix, default gateway, DNS servers, MAC address, and DHCP lease details. This is often the first check for client-side problems.' },
            { id: 'netstat', level: 2, q: 'What are netstat and ss used for?', a: 'Listing active connections and listening ports, for example to confirm a service is actually listening on its expected port, or to see which remote hosts a machine is talking to.' },
            { id: 'crc', level: 2, q: 'What do rising CRC/FCS errors on an interface usually indicate?', a: 'A Layer 1 problem such as a damaged cable or connector, electrical interference, a bad transceiver, or a duplex mismatch.' },
            { id: 'duplex', level: 2, q: 'What are the symptoms of a duplex mismatch?', a: 'One side runs full-duplex and the other half-duplex. Links work but are slow, with late collisions on the half-duplex side and CRC errors on the full-duplex side. Fix by configuring both ends the same, usually auto-negotiation on both.' },
            { id: 'capture', level: 3, q: 'When is a packet capture (Wireshark/tcpdump) the right tool?', a: 'When you need protocol-level detail that summary tools can’t show, such as handshake failures, retransmissions, or malformed packets. Captures can contain sensitive data, so capture only where you are authorized and handle files securely.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'qos',
        title: 'QoS & Traffic Management',
        short: 'QS',
        color: 'from-teal-500 to-emerald-500',
        category: 'operations',
        level: 3,
        summary: 'Classification, marking, queuing, prioritization, and congestion control.',
        description: 'Quality of Service manages which traffic gets priority when links are congested. It doesn’t create bandwidth; it decides who waits and who gets dropped. QoS terminology and default behavior vary between vendors. Recommended targets for voice and video are guidelines, not universal rules.',
        related: ['network-services', 'wan-vpn', 'switching-vlans', 'troubleshooting'],
        osiLayers: [2, 3, 4],
        reference: [
            {
                title: 'Common DSCP markings',
                caption: 'Typical DiffServ conventions; organizations define their own QoS policies.',
                columns: ['Marking', 'DSCP value', 'Typical use'],
                rows: [
                    ['EF (Expedited Forwarding)', '46', 'Voice media'],
                    ['AF41', '34', 'Interactive video'],
                    ['CS3', '24', 'Call signaling (varies)'],
                    ['AF21', '18', 'Transactional data'],
                    ['CS1', '8', 'Scavenger / bulk'],
                    ['Default (BE)', '0', 'Best effort']
                ]
            }
        ],
        cards: [
            { id: 'what', level: 1, q: 'What is QoS?', a: 'A set of techniques that give different classes of traffic different treatment (bandwidth, delay, drop priority) when the network is congested. QoS doesn’t add capacity; it manages contention.' },
            { id: 'metrics', level: 1, q: 'What four characteristics does QoS manage?', a: 'Bandwidth (capacity), latency/delay, jitter (variation in delay), and packet loss.' },
            { id: 'voice', level: 2, q: 'Why do voice and video need special treatment?', a: 'They are real-time and sensitive to delay, jitter, and loss, and retransmitting late packets doesn’t help. Commonly cited VoIP guidelines are one-way delay ≤150 ms (ITU-T G.114), jitter under ~30 ms, and loss under ~1%. Exact targets vary.' },
            { id: 'marking', level: 2, q: 'What are classification and marking?', a: 'Classification identifies traffic (by ACL, port, or application recognition). Marking tags it so downstream devices can act consistently: Layer 2 CoS/PCP (3 bits in the 802.1Q tag) or Layer 3 DSCP (6 bits in the IP header).' },
            { id: 'ef', level: 2, q: 'What is DSCP EF?', a: 'Expedited Forwarding, DSCP 46, the conventional marking for voice media, which should get low-latency priority treatment. Assured Forwarding (AF) classes cover other important traffic, and DSCP 0 is best effort.' },
            { id: 'trust', level: 2, q: 'What is a QoS trust boundary?', a: 'The point where the network starts trusting packet markings, typically the access switch port or an IP phone. Markings from untrusted endpoints are reset or re-marked according to policy.' },
            { id: 'queuing', level: 2, q: 'Compare FIFO, priority queuing, and weighted fair queuing.', a: 'FIFO: first in, first out; no differentiation.\nPriority queuing: strict priority queues, which can starve lower queues.\nWeighted fair / class-based queuing: guarantees each class a share of bandwidth.\n\nLow-latency queuing (LLQ, a Cisco term) combines a strict-priority queue for voice with class-based queues.' },
            { id: 'police-shape', level: 2, q: 'What is the difference between policing and shaping?', a: 'Policing enforces a rate by dropping or re-marking excess traffic immediately, with no buffering. Shaping buffers excess traffic and sends it later, smoothing bursts at the cost of added delay. Shaping is common on egress to a provider’s contracted WAN rate.' },
            { id: 'congestion-points', level: 2, q: 'Where does congestion usually occur?', a: 'At speed mismatches and aggregation points: the LAN-to-WAN edge, uplinks shared by many access ports, and many-to-one traffic patterns such as many clients hitting one server.' },
            { id: 'tcp-cc', level: 2, q: 'How does TCP congestion control work at a high level?', a: 'The sender adjusts its congestion window based on signs of congestion such as loss or delay: slow start ramps up quickly, then congestion avoidance increases gradually and backs off on loss. Algorithms include Reno, CUBIC, and BBR.' },
            { id: 'bufferbloat', level: 2, q: 'What is bufferbloat?', a: 'Excessively large buffers that fill under load and add significant latency, making real-time apps lag while a large download runs. Smart queue management such as fq_codel or CAKE mitigates it.' },
            { id: 'wred', level: 3, q: 'What is the difference between tail drop and WRED?', a: 'Tail drop discards every new packet once a queue is full, which can make many TCP flows back off at once (global synchronization). RED/WRED drops packets randomly and early as the queue grows, weighted by class, so flows slow down at different times.' },
            { id: 'ecn', level: 3, q: 'What is ECN?', a: 'Explicit Congestion Notification: routers mark packets to signal congestion instead of dropping them, and endpoints slow down in response. Both endpoints and the path must support it.' },
            { id: 'intserv-diffserv', level: 3, q: 'What is the difference between IntServ and DiffServ?', a: 'IntServ reserves resources per flow end to end (using RSVP) and scales poorly. DiffServ groups traffic into a few classes using DSCP markings, with per-hop behaviors at each device. DiffServ is the widely deployed model.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'wan-vpn',
        title: 'WAN & VPN',
        short: 'VP',
        color: 'from-blue-500 to-indigo-500',
        category: 'operations',
        level: 3,
        summary: 'Tunneling, encapsulation, IPsec, MPLS, SD-WAN, and VPN concepts.',
        description: 'WANs connect sites across distance, and VPNs create private, usually encrypted, tunnels over shared or public networks. Both rely on encapsulation, wrapping one packet inside another, which builds directly on the OSI concepts in the first topic.',
        related: ['routing', 'security', 'qos', 'topologies', 'osi-tcpip'],
        osiLayers: [2, 3],
        reference: [
            {
                title: 'VPN and tunnel technologies',
                columns: ['Technology', 'Encrypts?', 'Typical use'],
                rows: [
                    ['GRE', 'No (often paired with IPsec)', 'Simple tunnels; carries multicast/routing protocols'],
                    ['IPsec', 'Yes (ESP)', 'Site-to-site and remote access'],
                    ['SSL/TLS VPN', 'Yes', 'Remote access, often over 443'],
                    ['WireGuard', 'Yes', 'Modern lightweight VPN over UDP'],
                    ['MPLS L3VPN', 'No (separation, not encryption)', 'Carrier-provided private WAN'],
                    ['SD-WAN overlay', 'Usually yes', 'Multi-transport branch WAN']
                ]
            }
        ],
        cards: [
            { id: 'vpn', level: 1, q: 'What is a VPN?', a: 'A virtual private network creates a tunnel across a shared or untrusted network, usually encrypted, so private traffic can travel over it securely.' },
            { id: 'vpn-encap', level: 1, q: 'How does encapsulation work in a VPN?', a: 'The original packet is encrypted and becomes the payload of a new packet with an outer IP header addressed between the VPN endpoints, like a letter sealed inside a second envelope. The far end removes the outer layer and forwards the original packet.' },
            { id: 's2s-ra', level: 1, q: 'What is the difference between site-to-site and remote-access VPNs?', a: 'Site-to-site connects entire networks through gateways at each location and is typically always on. Remote access connects individual users, using client software or a browser, to the organization’s network.' },
            { id: 'tunneling', level: 2, q: 'What is tunneling?', a: 'Encapsulating one packet inside another protocol so it can cross a network that wouldn’t carry it natively. The outer header gets it across the transit network, and the inner packet is delivered at the tunnel’s end. The extra headers reduce the effective MTU.' },
            { id: 'gre', level: 2, q: 'What is GRE?', a: 'Generic Routing Encapsulation, a simple tunneling protocol that can carry many protocols, including multicast and routing protocol traffic. GRE doesn’t encrypt by itself, so it is often combined with IPsec.' },
            { id: 'ipsec', level: 2, q: 'What are the main components of IPsec?', a: 'IKE (IKEv2) negotiates keys and security associations over UDP 500 (UDP 4500 with NAT traversal).\nESP (IP protocol 50) provides encryption and integrity.\nAH (IP protocol 51) provides integrity only and is rarely used, partly because it doesn’t work through NAT.' },
            { id: 'tunnel-transport', level: 2, q: 'What is the difference between IPsec tunnel mode and transport mode?', a: 'Tunnel mode protects the entire original packet and adds a new outer IP header; it is typical for site-to-site gateways. Transport mode protects only the payload and keeps the original header; it is used host-to-host.' },
            { id: 'ssl-vpn', level: 2, q: 'What is an SSL/TLS VPN?', a: 'A remote-access VPN built on TLS, often over port 443, which passes through most firewalls easily. It can be clientless (browser portal to specific apps) or a full client that tunnels network traffic.' },
            { id: 'split', level: 2, q: 'What is the difference between split tunnel and full tunnel?', a: 'Split tunnel sends only corporate-bound traffic through the VPN and lets other traffic go directly to the internet, which means less VPN load but less visibility. Full tunnel sends all traffic through the VPN for central inspection and policy.' },
            { id: 'mpls', level: 2, q: 'What is MPLS?', a: 'Multiprotocol Label Switching: provider routers forward packets based on short labels instead of full IP lookups. Labels are pushed at the ingress edge, swapped in the core, and removed near the egress. It enables L3VPNs and traffic engineering, and is often called “Layer 2.5.” MPLS separates customers’ traffic but doesn’t encrypt it.' },
            { id: 'sdwan', level: 2, q: 'What is SD-WAN?', a: 'Software-defined WAN: a centrally managed overlay that runs across multiple transports (MPLS, broadband, LTE/5G), usually with encrypted tunnels and application-aware path selection based on measured performance.' },
            { id: 'wan-types', level: 2, q: 'Name common WAN connection types.', a: 'Leased lines (dedicated point-to-point), MPLS, broadband (cable, DSL, fiber), metro Ethernet, cellular (LTE/5G), and satellite.' },
            { id: 'wireguard', level: 2, q: 'What is WireGuard?', a: 'A modern VPN protocol with a small codebase and a fixed set of modern cryptography (e.g. Curve25519, ChaCha20-Poly1305). It runs over UDP, and peers are identified by their public keys.' },
            { id: 'tunnel-mtu', level: 3, q: 'Why do tunnels often require MTU or MSS adjustments?', a: 'Tunnel headers (e.g. 24 bytes for GRE over IPv4, more with IPsec) can push packets over the path MTU, causing fragmentation or silent drops. Common fixes: lower the tunnel MTU, clamp TCP MSS, and don’t block the ICMP messages that Path MTU Discovery relies on.' },
            { id: 'dmvpn', level: 3, q: 'What is DMVPN?', a: 'Cisco’s Dynamic Multipoint VPN: a hub-and-spoke design where spokes can build direct spoke-to-spoke tunnels on demand, using multipoint GRE, NHRP, and IPsec. It is vendor-specific; other vendors offer similar dynamic-mesh designs.' }
        ]
    },
    // --------------------------------------------------------
    {
        id: 'automation',
        title: 'Network Automation',
        short: 'AU',
        color: 'from-fuchsia-500 to-violet-500',
        category: 'operations',
        level: 3,
        summary: 'APIs, CLI scripting, data formats, and infrastructure-as-code concepts.',
        description: 'Automation replaces repetitive manual configuration with code, which brings consistency, speed, and an audit trail. This deck introduces the concepts and vocabulary behind APIs, data models, scripting, and infrastructure as code. It is tool-neutral; specific products are mentioned only as examples.',
        related: ['troubleshooting', 'security', 'network-devices', 'routing'],
        osiLayers: [7],
        reference: [
            {
                title: 'REST methods',
                columns: ['Method', 'Typical action', 'Idempotent?'],
                rows: [
                    ['GET', 'Read a resource', 'Yes'],
                    ['POST', 'Create a resource / trigger an action', 'No'],
                    ['PUT', 'Replace a resource', 'Yes'],
                    ['PATCH', 'Partially update a resource', 'Not guaranteed'],
                    ['DELETE', 'Remove a resource', 'Yes']
                ]
            }
        ],
        cards: [
            { id: 'why', level: 1, q: 'Why automate network operations?', a: 'Consistency (fewer typos and config drift), speed, scale, repeatable compliance checks, and a reviewable record of every change.' },
            { id: 'api', level: 1, q: 'What is an API in network automation?', a: 'An application programming interface lets software read and change device or controller settings programmatically, exchanging structured data instead of a person typing commands or a script scraping CLI output.' },
            { id: 'rest', level: 2, q: 'What are the basics of a REST API?', a: 'Resources are identified by URLs and acted on with HTTP methods: GET (read), POST (create), PUT (replace), PATCH (partial update), DELETE (remove). Data is usually JSON, and each request is stateless.' },
            { id: 'formats', level: 2, q: 'How do JSON, YAML, and XML differ?', a: 'All three are structured data formats.\nJSON: braces and key/value pairs; common in REST APIs.\nYAML: indentation-based and human-friendly; common in automation playbooks.\nXML: tag-based; used by NETCONF.' },
            { id: 'netconf', level: 2, q: 'What are NETCONF and RESTCONF?', a: 'NETCONF: a network management protocol using XML-encoded RPCs over SSH (port 830), with features like candidate configurations and validation before commit.\nRESTCONF: HTTP-based, REST-like access to the same YANG-modeled data, in JSON or XML.' },
            { id: 'yang', level: 2, q: 'What is YANG?', a: 'A data modeling language that defines the structure of configuration and operational data, so tools know exactly what fields exist and what values are valid. Models come from standards bodies (IETF, OpenConfig) and vendors.' },
            { id: 'cli-scripting', level: 2, q: 'What are the pros and cons of CLI scripting?', a: 'Scripts (e.g. Python with an SSH library) log into devices and send the same commands a human would. It is easy to start and works on older gear, but parsing unstructured text output is brittle and can break when output formats change.' },
            { id: 'iac', level: 2, q: 'What is infrastructure as code (IaC)?', a: 'Defining the desired state of infrastructure in version-controlled files that tools apply automatically. Changes can be peer-reviewed, tested, repeated across environments, and rolled back.' },
            { id: 'declarative', level: 2, q: 'What is the difference between declarative and imperative automation?', a: 'Declarative: describe the desired end state and let the tool work out the steps.\nImperative: specify the exact steps and their order, as in a traditional script.' },
            { id: 'idempotent', level: 2, q: 'What does idempotent mean, and why does it matter?', a: 'Running the same operation multiple times produces the same result as running it once. Idempotent automation can be re-run safely without causing duplicate or unintended changes.' },
            { id: 'ansible', level: 2, q: 'What is Ansible, at a high level?', a: 'An agentless automation tool. Playbooks written in YAML describe tasks that run against hosts listed in an inventory, connecting over SSH or device APIs. Many modules are written to be idempotent.' },
            { id: 'git', level: 2, q: 'What role does version control (e.g. Git) play in network automation?', a: 'It tracks every change to configs, templates, and scripts, with history and authorship. It enables peer review through pull requests, automated testing (CI), and easy rollback to a known-good version.' },
            { id: 'secrets', level: 2, q: 'How should automation credentials and changes be handled safely?', a: 'Keep secrets in a vault or secrets manager, never in scripts or Git. Use least-privilege service accounts. Test in a lab, use dry-run/check modes, and roll out changes gradually with a rollback plan.' },
            { id: 'telemetry', level: 3, q: 'What is model-driven telemetry?', a: 'Devices stream structured operational data to collectors (push) on a schedule or when values change, rather than being polled periodically (pull, as with SNMP). It gives higher-resolution, more scalable monitoring, often using gRPC/gNMI.' },
            { id: 'sdn', level: 3, q: 'What is SDN, and what are northbound and southbound APIs?', a: 'Software-defined networking separates the control plane (decisions) from the data plane (forwarding) and centralizes control in a controller. Northbound APIs connect the controller to applications and orchestration; southbound APIs connect it to network devices.' }
        ]
    }
];

const data = { CATEGORIES, LEVELS, TOPICS };

if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;
} else {
    root.NetAtlasData = data;
}

})(typeof window !== 'undefined' ? window : globalThis);
