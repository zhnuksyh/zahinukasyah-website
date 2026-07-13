// Central content data for the portfolio. Everything here is placeholder
// copy meant to be swapped for real content later.

export interface DesignItem {
  cat: string;
  c: string;
  dark?: boolean;
  title: string;
  meta: string;
  wide?: boolean;
}

export const designParas = [
  'Placeholder paragraph — a short note about this design, the brief behind it, and the direction I chose to explore.',
  'Placeholder paragraph — a little more on the process, the details worth remembering, and the moment it finally clicked.',
  'Placeholder paragraph — a closing line on the outcome, what I learned, and where the idea might go next.',
];

export const designData: DesignItem[] = [
  { cat: 'Branding', c: '#a78bfa', title: 'Placeholder Title', meta: '2026 · placeholder', wide: true },
  { cat: 'Web', c: '#4f8ef7', title: 'Placeholder Title', meta: '2025 · placeholder' },
  { cat: 'Poster', c: '#f2603c', title: 'Placeholder Title', meta: '2025 · placeholder' },
  { cat: 'Product', c: '#20222c', dark: true, title: 'Placeholder Title', meta: '2025 · placeholder' },
  { cat: 'Editorial', c: '#ffcf33', title: 'Placeholder Title', meta: '2024 · placeholder' },
  { cat: 'Icon Set', c: '#35c95a', title: 'Placeholder Title', meta: '2024 · placeholder', wide: true },
  { cat: 'Motion', c: '#f472b6', title: 'Placeholder Title', meta: '2024 · placeholder' },
  { cat: 'Type', c: '#8b7cf6', title: 'Placeholder Title', meta: '2023 · placeholder' },
  { cat: 'Campaign', c: '#ff9a4d', title: 'Placeholder Title', meta: '2023 · placeholder' },
  { cat: 'UI Kit', c: '#3fa9f5', title: 'Placeholder Title', meta: '2023 · placeholder', wide: true },
  { cat: 'Illustration', c: '#22c55e', title: 'Placeholder Title', meta: '2022 · placeholder' },
  { cat: 'Layout', c: '#262a38', dark: true, title: 'Placeholder Title', meta: '2022 · placeholder' },
  { cat: '3D', c: '#2dd4bf', title: 'Placeholder Title', meta: '2021 · placeholder' },
  { cat: 'Packaging', c: '#6366f1', dark: true, title: 'Placeholder Title', meta: '2021 · placeholder' },
  { cat: 'Signage', c: '#ffc233', title: 'Placeholder Title', meta: '2020 · placeholder' },
];

export interface ProjItem {
  c: string;
  dark: boolean;
  wide: boolean;
}

export const projData: ProjItem[] = [
  { c: '#a78bfa', dark: false, wide: false },
  { c: '#35c95a', dark: false, wide: true },
  { c: '#20222c', dark: true, wide: false },
  { c: '#ff9a4d', dark: false, wide: false },
  { c: '#4f8ef7', dark: false, wide: true },
  { c: '#f2603c', dark: false, wide: false },
  { c: '#8b7cf6', dark: false, wide: false },
  { c: '#ffcf33', dark: false, wide: false },
  { c: '#2dd4bf', dark: false, wide: true },
  { c: '#262a38', dark: true, wide: false },
  { c: '#f472b6', dark: false, wide: false },
  { c: '#6366f1', dark: true, wide: false },
];

export interface ResearchItem {
  mon: string;
  date: string;
  status: string;
  cat: string;
  venue: string;
  c: string;
  title: string;
  authors: string;
  paras: string[];
}

export const researchData: ResearchItem[] = [
  {
    mon: 'Feb', date: '14', status: 'Annotating', cat: 'Paper', venue: 'NeurIPS 2025', c: '#a78bfa',
    title: 'Scaling laws for multimodal representation learning',
    authors: 'L. Chen, A. Okafor, R. Nakamura et al.',
    paras: [
      'The core claim is that a single joint embedding scales predictably across text, image and audio as long as the pre-training mixture stays balanced. Worth re-deriving the loss curve myself.',
      'Their ablation on modality dropout is the interesting part — knocking out one stream at train time makes the others more robust rather than less. I want to try this on a smaller budget.',
      'Open question I noted in the margin: does the predicted floor still hold once you add a fourth modality, or is three a lucky number for their setup?',
    ],
  },
  {
    mon: 'Feb', date: '09', status: 'To read', cat: 'Preprint', venue: 'arXiv', c: '#4f8ef7',
    title: 'Sparse attention without the accuracy tax',
    authors: 'M. Alvarez, S. Bhatt',
    paras: [
      'Queued this after it kept coming up in citations. The pitch is a learned routing gate that keeps roughly 12% of attention edges and loses almost nothing downstream.',
      'Skimmed the method section — the gate is trained with a straight-through estimator, so the numbers might be fragile at longer context. Flagging to verify.',
      'If it holds, this is the cheapest win in my current reading list. Pairing it with the KV-cache notes below.',
    ],
  },
  {
    mon: 'Jan', date: '28', status: 'Notes', cat: 'Survey', venue: 'ACM Computing Surveys', c: '#35c95a',
    title: 'A field guide to retrieval-augmented generation',
    authors: 'P. Idris, Y. Wen, K. Solé',
    paras: [
      'Best map of the space I have found so far. Split into indexing, retrieval and fusion strategies, with a clean taxonomy I have started borrowing for my own notes.',
      'Their honest section on failure modes — stale indexes, retriever/reader mismatch — matches what I keep running into. Copied the checklist into my project doc.',
      'Marked three of the cited papers as follow-ups; two are already in this list.',
    ],
  },
  {
    mon: 'Jan', date: '15', status: 'Replicated', cat: 'Paper', venue: 'ICLR 2025', c: '#f2603c',
    title: 'Small models, long memory: state-space recall',
    authors: 'T. Varga, N. Dube',
    paras: [
      'Reproduced the headline recall benchmark on a 130M model over a weekend — results within a point of the paper, which is reassuring.',
      'The trick is a decaying state kernel that is cheap to roll forward. I wrote up the derivation in my own words to make sure I actually understood it.',
      'Next step is to see whether the recall holds under noisy inputs, which the paper conveniently does not test.',
    ],
  },
  {
    mon: 'Jan', date: '06', status: 'Archived', cat: 'Reading', venue: 'Distill-style writeup', c: '#f472b6',
    title: 'Why gradient noise helps generalization',
    authors: 'Community writeup',
    paras: [
      'Not a formal paper but the clearest intuition-first explanation I have read on why a little SGD noise acts like a regularizer.',
      'Kept it here mostly for the diagrams, which I want to redraw in my own style for a future note.',
      'Low priority now, but a good one to hand to someone just getting started.',
    ],
  },
];

export interface ArcadeGame {
  title: string;
  cat: string;
  meta: string;
  c: string;
  x: number;
  y: number;
  href: string;
}

export const gamesArcadeData: ArcadeGame[] = [
  { title: 'Placeholder Game', cat: 'Arcade', meta: '2026 · placeholder', c: '#c9f24d', x: 3, y: 2, href: '#' },
  { title: 'Placeholder Game', cat: 'Puzzle', meta: '2025 · placeholder', c: '#5ec8f0', x: 12, y: 3, href: '#' },
  { title: 'Placeholder Game', cat: 'Platformer', meta: '2025 · placeholder', c: '#ff8a7a', x: 6, y: 6, href: '#' },
  { title: 'Placeholder Game', cat: 'Adventure', meta: '2024 · placeholder', c: '#8b7cff', x: 12, y: 6, href: '#' },
];

export const gameParas = [
  'Placeholder paragraph — a short note on what this game is, the idea behind it, and the feeling I wanted to leave players with.',
  'Placeholder paragraph — a little more on how it plays, the systems under the hood, and the moment it started to feel alive.',
  'Placeholder paragraph — a closing line on where it went, what I would change, and what is coming next.',
];

export interface NewsItem {
  mon: string;
  date: string;
  ago: string;
  cat: string;
  author: string;
  c: string;
}

export const newsData: NewsItem[] = [
  { mon: 'Jul', date: '20', ago: '1 hour ago', cat: 'Placeholder', author: 'Placeholder Name', c: '#a78bfa' },
  { mon: 'Jul', date: '18', ago: '2 hours ago', cat: 'Placeholder', author: 'Placeholder Name', c: '#f2603c' },
  { mon: 'Jul', date: '15', ago: '3 hours ago', cat: 'Placeholder', author: 'Placeholder Name', c: '#4f8ef7' },
  { mon: 'Jul', date: '11', ago: '5 hours ago', cat: 'Placeholder', author: 'Placeholder Name', c: '#35c95a' },
  { mon: 'Jun', date: '28', ago: '8 hours ago', cat: 'Placeholder', author: 'Placeholder Name', c: '#ffcf33' },
  { mon: 'Jun', date: '19', ago: '1 day ago', cat: 'Placeholder', author: 'Placeholder Name', c: '#2dd4bf' },
  { mon: 'May', date: '30', ago: '2 days ago', cat: 'Placeholder', author: 'Placeholder Name', c: '#f472b6' },
];

export const newsYear = '2026';

export const newsParas = [
  'Placeholder paragraph — a short note about what this recent thing was and why it mattered goes right here, filling the top of the story with a comfortable line length.',
  'Placeholder paragraph — a second beat continues the thought with a little more detail, the kind of context you would jot down while it is still fresh in your mind.',
  'Placeholder paragraph — a closing line wraps things up and hints at whatever is coming next, leaving the reader with somewhere to go from here.',
];

export interface SocialItem {
  name: string;
  handle: string;
  c: string;
  txt: string;
  /** Profile URL; omitted for platforms without public profile links. */
  href?: string;
}

export const socials: SocialItem[] = [
  { name: 'Discord', handle: 'zhnuksyh', c: '#5865f2', txt: '#ffffff' },
  { name: 'Steam', handle: 'Daimon', c: '#66c0f4', txt: '#0a0a0b', href: 'https://steamcommunity.com/id/Daimon' },
  { name: 'Instagram', handle: '@zhnuksyh', c: '#e1306c', txt: '#ffffff', href: 'https://www.instagram.com/zhnuksyh/' },
  { name: 'LinkedIn', handle: 'in/zhnuksyh', c: '#0a66c2', txt: '#ffffff', href: 'https://www.linkedin.com/in/zhnuksyh' },
  { name: 'Substack', handle: '@zhnuksyh', c: '#ff6719', txt: '#ffffff', href: 'https://substack.com/@zhnuksyh' },
  { name: 'X', handle: '@zhnuksyh', c: '#e7e7ea', txt: '#0a0a0b', href: 'https://x.com/zhnuksyh' },
  { name: 'TikTok', handle: '@zhnuksyh', c: '#ff0050', txt: '#ffffff', href: 'https://www.tiktok.com/@zhnuksyh' },
  { name: 'GitHub', handle: 'zhnuksyh', c: '#e7e7ea', txt: '#0a0a0b', href: 'https://github.com/zhnuksyh' },
];

export const collabEmail = 'hello@zahin.studio';

export interface CollabItem {
  cat: string;
  c: string;
  title: string;
  desc: string;
}

export const collabData: CollabItem[] = [
  { cat: 'Mobile App', c: '#f2603c', title: 'Placeholder Title', desc: 'Placeholder description — a short note about the mobile app work and what we could build together in this space.' },
  { cat: 'UI/UX Design', c: '#8b7cf6', title: 'Placeholder Title', desc: 'Placeholder description — a short note about the design work and the kind of problems worth solving together.' },
  { cat: 'Game Design', c: '#35c95a', title: 'Placeholder Title', desc: 'Placeholder description — a short note about the game design work and where a collaboration might go.' },
  { cat: 'Web App', c: '#4f8ef7', title: 'Placeholder Title', desc: 'Placeholder description — a short note about the web work and what a team-up could look like.' },
  { cat: 'Branding', c: '#ffcf33', title: 'Placeholder Title', desc: 'Placeholder description — a short note about the branding work and the ideas worth chasing together.' },
];

export interface MediaItem {
  title: string;
  meta: string;
  tag: string;
  c: string;
  desc: string;
  /** Cover image under public/covers; cards without one show a placeholder. */
  img?: string;
}

const gameDesc =
  'Placeholder note — a couple of lines on why this one has my attention right now and what keeps pulling me back in.';
const bookDesc =
  'Placeholder note — a couple of lines on what this book is about and the idea from it that stuck with me.';
const movieDesc =
  'Placeholder note — a couple of lines on what this one is about and the moment that made it stick with me.';

export const gamesData: MediaItem[] = [
  { title: 'Wildfrost', meta: 'Deadpan Games', tag: 'Playing', c: '#a78bfa', desc: gameDesc, img: '/covers/game-wildfrost.jpg' },
  { title: 'Inscryption', meta: 'Daniel Mullins Games', tag: 'Beat it', c: '#4f8ef7', desc: gameDesc, img: '/covers/game-inscryption.jpg' },
  { title: 'PvZ: Gardenless', meta: 'Fangame', tag: 'Playing', c: '#35c95a', desc: gameDesc },
  { title: 'Minecraft', meta: 'Mojang Studios', tag: 'Replay', c: '#f2603c', desc: gameDesc, img: '/covers/game-minecraft.png' },
  { title: 'Slay the Spire II', meta: 'Mega Crit', tag: 'Playing', c: '#ffcf33', desc: gameDesc, img: '/covers/game-slay-the-spire-2.jpg' },
  { title: 'Detective Query', meta: 'Zahin Ukasyah', tag: 'My game', c: '#f472b6', desc: gameDesc },
  { title: 'Sudotiles', meta: 'Zahin Ukasyah', tag: 'My game', c: '#2dd4bf', desc: gameDesc },
  { title: 'Bloons TD 6', meta: 'Ninja Kiwi', tag: 'Playing', c: '#8b7cf6', desc: gameDesc, img: '/covers/game-btd6.jpg' },
];

export const booksData: MediaItem[] = [
  { title: 'Sonic IDW Main Series', meta: 'Ian Flynn · IDW', tag: 'Reading', c: '#4f8ef7', desc: bookDesc, img: '/covers/book-sonic-idw.jpg' },
  { title: 'Ideology of the Future', meta: 'Muhammad Rafiuddin', tag: 'Reading', c: '#35c95a', desc: bookDesc },
  { title: 'As a Man Thinketh', meta: 'James Allen', tag: 'Finished', c: '#ffcf33', desc: bookDesc, img: '/covers/book-as-a-man-thinketh.jpg' },
  { title: 'The Metamorphosis', meta: 'Franz Kafka', tag: 'Finished', c: '#a78bfa', desc: bookDesc, img: '/covers/book-metamorphosis.jpg' },
  { title: 'Crime and Punishment', meta: 'Fyodor Dostoevsky', tag: 'Reading', c: '#f2603c', desc: bookDesc, img: '/covers/book-crime-punishment.jpg' },
  { title: 'The Courage to Be Disliked', meta: 'Kishimi & Koga', tag: 'Finished', c: '#2dd4bf', desc: bookDesc, img: '/covers/book-courage-disliked.jpg' },
  { title: 'Slow Productivity', meta: 'Cal Newport', tag: 'Reading', c: '#f472b6', desc: bookDesc, img: '/covers/book-slow-productivity.jpg' },
  { title: 'Muhammad', meta: 'Martin Lings', tag: 'Reading', c: '#8b7cf6', desc: bookDesc, img: '/covers/book-muhammad-lings.jpg' },
];

export const moviesData: MediaItem[] = [
  { title: 'To Your Eternity: S3', meta: 'Anime', tag: 'Watching', c: '#a78bfa', desc: movieDesc },
  { title: 'Boboiboy: Baraju Arc', meta: 'Monsta', tag: 'Watching', c: '#f2603c', desc: movieDesc },
  { title: 'Yozakura Family Spy: S2', meta: 'Anime', tag: 'Watching', c: '#f472b6', desc: movieDesc },
  { title: 'Bungou Stray Dogs: S3', meta: 'Bones', tag: 'Finished', c: '#4f8ef7', desc: movieDesc },
  { title: 'Ejen Ali Movie 2', meta: 'WAU Animation', tag: 'Finished', c: '#35c95a', desc: movieDesc },
  { title: 'Papazola The Movie', meta: 'Malaysian animation', tag: 'Finished', c: '#ffcf33', desc: movieDesc },
  { title: "Searching for a World that Doesn't Exist", meta: 'Film', tag: 'Finished', c: '#2dd4bf', desc: movieDesc },
  { title: 'Solving the M4TCHB0X Mystery', meta: 'Documentary', tag: 'Watching', c: '#8b7cf6', desc: movieDesc },
];

export interface TimelineItem {
  role: string;
  org: string;
  date: string;
}

export const timelineData: TimelineItem[] = [
  { role: 'SWE Engineer', org: 'MIMOS Berhad, MY', date: '2026 — Now' },
  { role: 'ML Engineer Trainee', org: 'MIMOS Berhad, MY', date: '2025 — 2026' },
  { role: 'Research Assistant', org: 'Universiti Teknologi Malaysia (UTM)', date: '2025' },
  { role: 'SWE Student', org: 'Universiti Teknologi Malaysia (UTM)', date: '2023 — 2026' },
];
