// Central content data for the portfolio. Entries marked "coming soon" are
// stand-ins meant to be swapped for real content later.

const cover = (file: string) => `${import.meta.env.BASE_URL}covers/${file}`;

export interface DesignItem {
  cat: string;
  c: string;
  dark?: boolean;
  title: string;
  meta: string;
  wide?: boolean;
}

export const designParas = [
  "This card hasn't been unlocked yet. The full write-up — the brief, the direction, and the messy middle — is still in the vault.",
  'Progress on this quest line is underway. Process shots, drafts, and the story behind the work will appear here once it ships.',
  'Until then, treat this page as a locked chest. The loot inside is real — it just needs a little more time to drop.',
];

export const designData: DesignItem[] = [
  { cat: 'Categories', c: '#a78bfa', title: 'Coming Soon', meta: '2026 · locked', wide: true },
  { cat: 'Categories', c: '#4f8ef7', title: 'Coming Soon', meta: '2025 · locked' },
  { cat: 'Categories', c: '#f2603c', title: 'Coming Soon', meta: '2025 · locked' },
  { cat: 'Categories', c: '#20222c', dark: true, title: 'Coming Soon', meta: '2025 · locked' },
  { cat: 'Categories', c: '#ffcf33', title: 'Coming Soon', meta: '2024 · locked' },
  { cat: 'Categories', c: '#35c95a', title: 'Coming Soon', meta: '2024 · locked', wide: true },
  { cat: 'Categories', c: '#f472b6', title: 'Coming Soon', meta: '2024 · locked' },
  { cat: 'Categories', c: '#8b7cf6', title: 'Coming Soon', meta: '2023 · locked' },
  { cat: 'Categories', c: '#ff9a4d', title: 'Coming Soon', meta: '2023 · locked' },
  { cat: 'Categories', c: '#3fa9f5', title: 'Coming Soon', meta: '2023 · locked', wide: true },
  { cat: 'Categories', c: '#22c55e', title: 'Coming Soon', meta: '2022 · locked' },
  { cat: 'Categories', c: '#262a38', dark: true, title: 'Coming Soon', meta: '2022 · locked' },
  { cat: 'Categories', c: '#2dd4bf', title: 'Coming Soon', meta: '2021 · locked' },
  { cat: 'Categories', c: '#6366f1', dark: true, title: 'Coming Soon', meta: '2021 · locked' },
  { cat: 'Categories', c: '#ffc233', title: 'Coming Soon', meta: '2020 · locked' },
];

export interface ProjItem {
  c: string;
  dark: boolean;
  wide: boolean;
}

// Mirrors the design/animation bento layout: same card count and wide spans.
export const projData: ProjItem[] = [
  { c: '#a78bfa', dark: false, wide: true },
  { c: '#4f8ef7', dark: false, wide: false },
  { c: '#f2603c', dark: false, wide: false },
  { c: '#20222c', dark: true, wide: false },
  { c: '#ffcf33', dark: false, wide: false },
  { c: '#35c95a', dark: false, wide: true },
  { c: '#f472b6', dark: false, wide: false },
  { c: '#8b7cf6', dark: false, wide: false },
  { c: '#ff9a4d', dark: false, wide: false },
  { c: '#3fa9f5', dark: false, wide: true },
  { c: '#22c55e', dark: false, wide: false },
  { c: '#262a38', dark: true, wide: false },
  { c: '#2dd4bf', dark: false, wide: false },
  { c: '#6366f1', dark: true, wide: false },
  { c: '#ffc233', dark: false, wide: false },
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

const researchParas = [
  "This entry hasn't been unlocked yet — the paper is still on the reading desk and the margin notes are mid-scribble.",
  'Once it clears, this space fills with the core claim, the parts worth re-deriving, and the questions left in the margins.',
  'Consider it a save point. The full field notes will be waiting here on your next visit.',
];

export const researchData: ResearchItem[] = [
  {
    mon: 'XXX', date: 'XX', status: 'Locked', cat: 'Paper', venue: 'Coming Soon', c: '#a78bfa',
    title: 'New paper notes unlock soon — annotations in progress',
    authors: 'Authors revealed on unlock',
    paras: researchParas,
  },
  {
    mon: 'XXX', date: 'XX', status: 'In queue', cat: 'Preprint', venue: 'Coming Soon', c: '#4f8ef7',
    title: 'A preprint is queued for this slot — reading run pending',
    authors: 'Authors revealed on unlock',
    paras: researchParas,
  },
  {
    mon: 'XXX', date: 'XX', status: 'Locked', cat: 'Survey', venue: 'Coming Soon', c: '#35c95a',
    title: 'Survey notes drop here once the map is drawn',
    authors: 'Authors revealed on unlock',
    paras: researchParas,
  },
  {
    mon: 'XXX', date: 'XX', status: 'In queue', cat: 'Paper', venue: 'Coming Soon', c: '#f2603c',
    title: 'Replication attempt loading — results unlock soon',
    authors: 'Authors revealed on unlock',
    paras: researchParas,
  },
  {
    mon: 'XXX', date: 'XX', status: 'Locked', cat: 'Reading', venue: 'Coming Soon', c: '#f472b6',
    title: 'An archived favorite gets its write-up at this save point',
    authors: 'Authors revealed on unlock',
    paras: researchParas,
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
  { title: 'Locked', cat: 'Arcade', meta: '2026 · unlocks soon', c: '#c9f24d', x: 3, y: 2, href: '#' },
  { title: 'Locked', cat: 'Puzzle', meta: '2025 · unlocks soon', c: '#5ec8f0', x: 9, y: 2, href: '#' },
  { title: 'Locked', cat: 'Platformer', meta: '2025 · unlocks soon', c: '#ff8a7a', x: 3, y: 4, href: '#' },
  { title: 'Locked', cat: 'Adventure', meta: '2024 · unlocks soon', c: '#8b7cff', x: 9, y: 4, href: '#' },
  { title: 'Sudotiles', cat: 'Puzzle', meta: '2026 · in development', c: '#ffd166', x: 3, y: 0, href: '#' },
  { title: 'Detective Query', cat: 'Mystery', meta: '2026 · in development', c: '#6ee7b7', x: 9, y: 0, href: '#' },
];

export const gameParas = [
  'This cabinet is still being wired up — the story of what the game is and the feeling it chases will load here soon.',
  'The systems under the hood are in playtesting: mechanics, balance, and the moment it all starts to feel alive.',
  'Insert coin later. A proper look at where this one goes next drops as soon as it leaves the workshop.',
];

export interface NewsItem {
  mon: string;
  date: string;
  ago: string;
  cat: string;
  author: string;
  c: string;
  title: string;
}

export const newsData: NewsItem[] = [
  { mon: 'XXX', date: 'XX', ago: 'X hours ago', cat: 'Quest Log', author: 'Zahin Ukasyah', c: '#a78bfa', title: 'New entry unlocks soon — the ink is still drying' },
  { mon: 'XXX', date: 'XX', ago: 'X hours ago', cat: 'Quest Log', author: 'Zahin Ukasyah', c: '#f2603c', title: 'A small win worth writing down, arriving shortly' },
  { mon: 'XXX', date: 'XX', ago: 'X hours ago', cat: 'Quest Log', author: 'Zahin Ukasyah', c: '#4f8ef7', title: 'Side quest in progress — notes drop when it clears' },
  { mon: 'XXX', date: 'XX', ago: 'X hours ago', cat: 'Quest Log', author: 'Zahin Ukasyah', c: '#35c95a', title: 'This chapter is locked until the story is ready' },
  { mon: 'XXX', date: 'XX', ago: 'X hours ago', cat: 'Quest Log', author: 'Zahin Ukasyah', c: '#ffcf33', title: 'An idea is brewing here — check back for the reveal' },
  { mon: 'XXX', date: 'XX', ago: 'X days ago', cat: 'Quest Log', author: 'Zahin Ukasyah', c: '#2dd4bf', title: 'Patch notes from a slow week, coming soon' },
  { mon: 'XXX', date: 'XX', ago: 'X days ago', cat: 'Quest Log', author: 'Zahin Ukasyah', c: '#f472b6', title: 'Month-end recap queued up for this very slot' },
];

export const newsYear = '2026';

export const newsParas = [
  "This entry hasn't been unlocked yet — the story is still in draft, sitting comfortably in the quest log until it's ready.",
  "Once it drops, the full context lands right here: what happened, why it mattered, and the details worth remembering.",
  'Consider this a save point. Come back soon and the rest of the chapter will be waiting for you.',
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

export const collabEmail = 'zhnuksyh03@gmail.com';

export interface CollabItem {
  cat: string;
  c: string;
  desc: string;
  /** Cover image under public/covers; cards without one show a placeholder. */
  img?: string;
}

export const collabData: CollabItem[] = [
  { cat: 'Mobile App', c: '#f2603c', desc: 'Apps that feel at home on a phone — smooth, snappy, and built end to end from idea to store release.', img: cover('collab-mobile-app.jpg') },
  { cat: 'UI/UX Design', c: '#8b7cf6', desc: 'Interfaces that feel obvious to use. I sweat the flows, the spacing, and the little moments of delight.', img: cover('collab-ui-ux-design.jpg') },
  { cat: 'Game Design', c: '#35c95a', desc: 'Small games with big ideas — puzzles, deck-builders, and mechanics that make you go "one more try".', img: cover('collab-game-design.jpg') },
  { cat: 'Web App', c: '#4f8ef7', desc: 'Fast, modern web apps built with React and friends. From landing page to full product, I can ship it.', img: cover('collab-web-app.jpg') },
  { cat: 'System Dev', c: '#ffcf33', desc: 'The plumbing behind the product — APIs, databases, and back-end systems that stay reliable under load.', img: cover('collab-system-dev.jpg') },
];

export interface MediaItem {
  title: string;
  meta: string;
  c: string;
  desc: string;
  /** Cover image under public/covers; cards without one show a placeholder. */
  img?: string;
}

export const gamesData: MediaItem[] = [
  { title: 'Wildfrost', meta: 'Deadpan Games', c: '#a78bfa', desc: 'A snowy deck-builder that punishes greed. Every run I swear I have the perfect combo, and every run the frost humbles me.', img: cover('game-wildfrost.jpg') },
  { title: 'Inscryption', meta: 'Daniel Mullins Games', c: '#4f8ef7', desc: 'A card game inside an escape room inside something much stranger. The less you know going in, the better it hits.', img: cover('game-inscryption.jpg') },
  { title: 'PvZ: Gardenless', meta: 'Open Source Fangame', c: '#35c95a', desc: 'A fan-made spin on Plants vs. Zombies that remixes the classic lanes into something fresh. Fangame passion at its best.', img: cover('game-pvz-gardenless.jpg') },
  { title: 'Minecraft', meta: 'Mojang Studios', c: '#f2603c', desc: 'The forever game. Every replay starts with a dirt hut and somehow ends with a megabase I never planned to build.', img: cover('game-minecraft.jpg') },
  { title: 'Slay the Spire II', meta: 'Mega Crit', c: '#ffcf33', desc: 'The sequel to the roguelike that defined the genre. New cards, new floors, same "one more run" problem at 2am.', img: cover('game-slay-the-spire-2.jpg') },
  { title: 'Detective Query', meta: 'Zahin Ukasyah', c: '#f472b6', desc: 'My own mystery game — you crack cases by digging through data like a real detective. Made with love and red herrings.', img: cover('game-detective-query.jpg') },
  { title: 'Sudotiles', meta: 'Zahin Ukasyah', c: '#2dd4bf', desc: 'My take on sudoku with a tile-laying twist. Small, cozy, and exactly the kind of puzzle I want on a slow evening.', img: cover('game-sudotiles.png') },
  { title: 'Bloons TD 6', meta: 'Ninja Kiwi', c: '#8b7cf6', desc: 'Monkeys versus balloons, endlessly. The perfect second-monitor game that quietly eats entire weekends.', img: cover('game-btd6.jpg') },
];

export const booksData: MediaItem[] = [
  { title: 'Sonic IDW Main Series', meta: 'Ian Flynn · IDW', c: '#4f8ef7', desc: 'The ongoing Sonic comic run, and honestly the best the blue blur has been written in years. Surge alone is worth it.', img: cover('book-sonic-idw.jpg') },
  { title: 'Ideology of the Future', meta: 'Muhammad Rafiuddin', c: '#35c95a', desc: 'A dense read on consciousness and where humanity is heading. Pairs weirdly well with the current rise of AI.', img: cover('book-ideology-of-the-future.jpg') },
  { title: 'As a Man Thinketh', meta: 'James Allen', c: '#ffcf33', desc: 'A tiny classic on how thought shapes character. You can finish it in an afternoon and chew on it for months.', img: cover('book-as-a-man-thinketh.jpg') },
  { title: 'The Metamorphosis', meta: 'Franz Kafka', c: '#a78bfa', desc: 'A man wakes up as a bug and his family slowly stops seeing him as human. Short, absurd, and quietly devastating.', img: cover('book-metamorphosis.jpg') },
  { title: 'Crime and Punishment', meta: 'Fyodor Dostoevsky', c: '#f2603c', desc: 'Guilt as a slow fever. Watching Raskolnikov unravel is the most stressful reading experience I keep coming back to.', img: cover('book-crime-punishment.jpg') },
  { title: 'The Courage to Be Disliked', meta: 'Kishimi & Koga', c: '#2dd4bf', desc: 'Adlerian psychology as a dialogue between a youth and a philosopher. The idea that all problems are relationship problems stuck with me.', img: cover('book-courage-disliked.jpg') },
  { title: 'Slow Productivity', meta: 'Cal Newport', c: '#f472b6', desc: 'Do fewer things, work at a natural pace, obsess over quality. A calm antidote to hustle culture that I needed.', img: cover('book-slow-productivity.jpg') },
  { title: 'Muhammad', meta: 'Martin Lings', c: '#8b7cf6', desc: "Lings' biography of the Prophet ﷺ, drawn from the earliest sources. Reads like poetry while staying faithful to history.", img: cover('book-muhammad-lings.jpg') },
];

export const moviesData: MediaItem[] = [
  { title: 'To Your Eternity: S3', meta: 'Yoshitoki Ōima', c: '#a78bfa', desc: 'An immortal being keeps learning what it means to be human, one loss at a time. No show makes me tear up this reliably.', img: cover('movie-to-your-eternity-s3.jpg') },
  { title: 'Boboiboy: Baraju Arc', meta: 'Monsta', c: '#f2603c', desc: 'Malaysian superhero animation going bigger than ever. Proud to watch local animation hit this level.', img: cover('movie-boboiboy-baraju.png') },
  { title: 'Yozakura Family Spy: S2', meta: 'Hitsuji Gondaira', c: '#f472b6', desc: 'A family of spies, endless chaos, and a surprising amount of heart under all the action gags.', img: cover('movie-yozakura-family-s2.jpg') },
  { title: 'Bungou Stray Dogs: S3', meta: 'Bones', c: '#4f8ef7', desc: 'Literary legends reborn with supernatural skills. The Dazai and Chuuya backstory episodes carry this whole season.', img: cover('movie-bungou-stray-dogs-s3.jpg') },
  { title: 'Ejen Ali Movie 2', meta: 'WAU Animation', c: '#35c95a', desc: 'The Malaysian spy-kid saga on the big screen again. Slick action and a story that respects its young audience.', img: cover('movie-ejen-ali-movie-2.jpg') },
  { title: 'Papazola The Movie', meta: 'Monsta', c: '#ffcf33', desc: 'Pure Malaysian comedy chaos in animated form. Went in for the laughs, stayed for the surprisingly warm family beats.', img: cover('movie-papazola.jpg') },
  { title: "Searching for a World that Doesn't Exist", meta: 'Wifies', c: '#2dd4bf', desc: 'A quiet film about chasing a place that may only exist in your head. The kind of story that lingers for days.', img: cover('movie-searching-world.jpg') },
  { title: 'Solving the M4TCHB0X Mystery', meta: 'Wifies', c: '#8b7cf6', desc: 'A rabbit-hole documentary about an internet mystery and the people obsessed with cracking it. Catnip for puzzle brains.', img: cover('movie-m4tchb0x-mystery.jpg') },
];

export const podcastsData: MediaItem[] = [
  { title: 'Within Reason', meta: 'Alex O\'Connor', c: '#4f8ef7', desc: 'Careful, good-faith debates on philosophy, religion, and ethics. The rare show where disagreeing feels productive.', img: cover('podcast-within-reason.jpg') },
  { title: 'Modern Wisdom', meta: 'Chris Williamson', c: '#a78bfa', desc: 'Long conversations on psychology, habits, and the odd corners of being human. Always leaves me with one idea to chew on.', img: cover('podcast-modern-wisdom.jpg') },
  { title: 'The Checkup', meta: 'Doctor Mike', c: '#35c95a', desc: 'A doctor cutting through health myths with actual evidence and good humor. Comfort listening that happens to be useful.', img: cover('podcast-the-checkup.jpg') },
  { title: 'HUGE*', meta: 'Cleo Abram', c: '#f2603c', desc: 'Optimistic deep dives into the technology shaping the future. The asterisk is doing a lot of work, and I love it.', img: cover('podcast-huge.jpg') },
];

export interface TimelineItem {
  role: string;
  org: string;
  date: string;
}

export const timelineData: TimelineItem[] = [
  { role: 'SWE Contract', org: 'MIMOS Berhad, MY', date: '2026 — Now' },
  { role: 'MLE Trainee', org: 'MIMOS Berhad, MY', date: '2025 — 2026' },
  { role: 'Research Assistant', org: 'UTM-KL, MY', date: '2025' },
  { role: 'SWE Undergrad', org: 'UTM-KL, MY', date: '2023 — 2026' },
];
