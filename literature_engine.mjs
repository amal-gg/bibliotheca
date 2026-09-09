import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '.cache');

// Ensure cache directory exists
await fs.mkdir(CACHE_DIR, { recursive: true }).catch(() => {});

/**
 * Curated seed library of landmark public domain works spanning diverse genres,
 * eras, cultures, philosophies, and narrative styles.
 */
export const CURATED_CATALOG = [
  // --- PHILOSOPHY, ETHICS & ESSAYS ---
  { id: 2680, title: "Meditations", author: "Marcus Aurelius", genre: "philosophy", era: "Ancient Rome (~170 AD)", summary: "Intimate personal reflections and Stoic philosophical exercises on duty, mortality, and tranquility." },
  { id: 1497, title: "The Republic", author: "Plato", genre: "philosophy", era: "Classical Greece (~375 BC)", summary: "A Socratic dialogue on justice, the order and character of the just city-state, and the nature of the philosopher king." },
  { id: 132, title: "The Art of War", author: "Sun Tzu", genre: "philosophy", era: "Ancient China (~5th Century BC)", summary: "The ancient military treatise on strategy, deception, leadership, and adapting to dynamic circumstances." },
  { id: 1998, title: "Thus Spake Zarathustra", author: "Friedrich Nietzsche", genre: "philosophy", era: "19th Century (1883)", summary: "A philosophical novel expounding the concepts of the Übermensch, the will to power, and eternal recurrence." },
  { id: 9662, title: "An Enquiry Concerning Human Understanding", author: "David Hume", genre: "philosophy", era: "18th Century (1748)", summary: "A seminal empiricist inquiry into human perception, causality, skepticism, and reason." },
  { id: 10661, title: "The Discourses of Epictetus", author: "Epictetus", genre: "philosophy", era: "Ancient Greece/Rome (~108 AD)", summary: "Foundational teachings on what is within our control versus what is outside our power." },
  { id: 3800, title: "Ethics", author: "Benedict de Spinoza", genre: "philosophy", era: "17th Century (1677)", summary: "A monumental work of rationalism presenting a geometric proof of God, nature, and human freedom." },
  { id: 5827, title: "The Problems of Philosophy", author: "Bertrand Russell", genre: "philosophy", era: "Early 20th Century (1912)", summary: "An accessible exploration into knowledge, perception, induction, and philosophical skepticism." },
  { id: 205, title: "Walden, and On The Duty Of Civil Disobedience", author: "Henry David Thoreau", genre: "philosophy", era: "19th Century (1854)", summary: "A transcendentalist reflection upon simple living in natural surroundings and moral self-reliance." },
  { id: 3600, title: "Essays of Michel de Montaigne", author: "Michel de Montaigne", genre: "philosophy", era: "16th Century (1580)", summary: "Pioneering personal essays meditating with wit and candor on human nature, vanity, solitude, and friendship." },

  // --- GOTHIC, HORROR & DARK ROMANTICISM ---
  { id: 84, title: "Frankenstein; or, The Modern Prometheus", author: "Mary Wollstonecraft Shelley", genre: "gothic", era: "Romantic Era (1818)", summary: "The seminal gothic science fiction masterpiece of hubris, unnatural creation, and the tragedy of rejection." },
  { id: 345, title: "Dracula", author: "Bram Stoker", genre: "gothic", era: "Victorian Era (1897)", summary: "The quintessential vampire novel told through letters, journals, and telegrams detailing Count Dracula's voyage to England." },
  { id: 2147, title: "The Works of Edgar Allan Poe", author: "Edgar Allan Poe", genre: "gothic", era: "19th Century (~1840s)", summary: "Dark tales of macabre mystery, psychological unraveling, guilt, and gothic terror." },
  { id: 43, title: "The Strange Case of Dr. Jekyll and Mr. Hyde", author: "Robert Louis Stevenson", genre: "gothic", era: "Victorian Era (1886)", summary: "A gripping psychological novella investigating the duality of man's nature and repressed depravity." },
  { id: 10007, title: "Carmilla", author: "Joseph Sheridan Le Fanu", genre: "gothic", era: "Victorian Era (1872)", summary: "A haunting gothic novella pre-dating Dracula, exploring supernatural seduction and mystery in a Styrian castle." },
  { id: 389, title: "The Great God Pan", author: "Arthur Machen", genre: "gothic", era: "Late Victorian (1894)", summary: "A chilling horror novella about forbidden brain surgery, ancient occult forces, and pagan dread." },
  { id: 8492, title: "The King in Yellow", author: "Robert W. Chambers", genre: "gothic", era: "19th Century (1895)", summary: "Decadent and weird tales centered on a forbidden stage play that drives its readers into madness." },
  { id: 209, title: "The Turn of the Screw", author: "Henry James", genre: "gothic", era: "Victorian Era (1898)", summary: "An ambiguous ghost story about a governess guarding two orphaned children at a secluded country estate." },

  // --- EARLY SCIENCE FICTION & SPECULATIVE FICTION ---
  { id: 35, title: "The Time Machine", author: "H. G. Wells", genre: "scifi", era: "Late Victorian (1895)", summary: "The pioneering speculative voyage to the far future year 802,701, witnessing the split between the Eloi and Morlocks." },
  { id: 36, title: "The War of the Worlds", author: "H. G. Wells", genre: "scifi", era: "Late Victorian (1898)", summary: "The landmark invasion story of technologically superior Martians devastating Victorian England with heat-rays and black smoke." },
  { id: 159, title: "The Island of Doctor Moreau", author: "H. G. Wells", genre: "scifi", era: "Late Victorian (1896)", summary: "A shipwreck survivor stumbles onto a remote South Pacific island where vivisection experiments blur animal and human." },
  { id: 5230, title: "The Invisible Man", author: "H. G. Wells", genre: "scifi", era: "Late Victorian (1897)", summary: "A brilliant optical scientist discovers invisibility, spiraling into megalomania, isolation, and terror." },
  { id: 164, title: "Twenty Thousand Leagues Under the Sea", author: "Jules Verne", genre: "scifi", era: "19th Century (1870)", summary: "Captain Nemo navigates the world's oceans in the futuristic submarine Nautilus, pursuing scientific wonder and revenge." },
  { id: 18857, title: "Journey to the Center of the Earth", author: "Jules Verne", genre: "scifi", era: "19th Century (1864)", summary: "A German professor, his nephew, and a guide follow ancient runes down an Icelandic volcano into subterranean primeval worlds." },
  { id: 624, title: "Looking Backward: 2000-1887", author: "Edward Bellamy", genre: "scifi", era: "19th Century (1888)", summary: "A young Bostonian awakens from a hypnotic slumber into a utopian socialist civilization of the year 2000." },
  { id: 18247, title: "The Last Man", author: "Mary Wollstonecraft Shelley", genre: "scifi", era: "19th Century (1826)", summary: "One of the earliest post-apocalyptic novels, recounting the devastating collapse of human civilization by plague in the 21st century." },

  // --- PSYCHOLOGICAL REALISM, EXISTENTIAL & WORLD CLASSICS ---
  { id: 2554, title: "Crime and Punishment", author: "Fyodor Dostoevsky", genre: "classics", era: "19th Century (1866)", summary: "The intense mental anguish and moral dilemmas of Rodion Raskolnikov, who plots to murder an unscrupulous pawnbroker." },
  { id: 28054, title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", genre: "classics", era: "19th Century (1880)", summary: "A passionate philosophical inquiry into faith, doubt, morality, and patricide among three disparate Russian brothers." },
  { id: 600, title: "Notes from the Underground", author: "Fyodor Dostoevsky", genre: "classics", era: "19th Century (1864)", summary: "The bitter, rambling confession of a reclusive civil servant in St. Petersburg, a foundational existentialist text." },
  { id: 2600, title: "War and Peace", author: "Leo Tolstoy", genre: "classics", era: "19th Century (1869)", summary: "An epic panorama of Russian society against the backdrop of the Napoleonic invasion, exploring free will and history." },
  { id: 1399, title: "Anna Karenina", author: "Leo Tolstoy", genre: "classics", era: "19th Century (1877)", summary: "A tragedy of aristocratic romance, societal hypocrisy, passion, and spiritual searching in Imperial Russia." },
  { id: 5200, title: "Metamorphosis", author: "Franz Kafka", genre: "classics", era: "Early 20th Century (1915)", summary: "Gregor Samsa awakens one morning to discover himself transformed into a monstrous verminous insect." },
  { id: 2413, title: "Madame Bovary", author: "Gustave Flaubert", genre: "classics", era: "19th Century (1856)", summary: "The tragic pursuit of romantic fantasy and luxury by a provincial doctor's wife suffocated by bourgeois banality." },
  { id: 174, title: "The Picture of Dorian Gray", author: "Oscar Wilde", genre: "classics", era: "Late Victorian (1890)", summary: "A Faustian study of aestheticism, moral decay, and hedonism centered on a magically aging portrait." },
  { id: 219, title: "Heart of Darkness", author: "Joseph Conrad", genre: "classics", era: "Late Victorian (1899)", summary: "Marlow's psychological journey up the Congo River in search of the enigmatic ivory trader Kurtz." },
  { id: 730, title: "Oliver Twist", author: "Charles Dickens", genre: "classics", era: "Victorian Era (1838)", summary: "A stark portrayal of London's underworld, orphanages, workhouses, and moral resilience in the face of poverty." },
  { id: 98, title: "A Tale of Two Cities", author: "Charles Dickens", genre: "classics", era: "Victorian Era (1859)", summary: "The famous historical novel set in London and Paris before and during the terror of the French Revolution." },

  // --- ADVENTURE, EPIC & MYTHOLOGY ---
  { id: 2701, title: "Moby Dick; Or, The Whale", author: "Herman Melville", genre: "adventure", era: "19th Century (1851)", summary: "Captain Ahab's obsessive, monomaniacal vendetta against the great white whale across the world's oceans." },
  { id: 1184, title: "The Count of Monte Cristo", author: "Alexandre Dumas", genre: "adventure", era: "19th Century (1844)", summary: "The ultimate tale of unjust betrayal, wrongful imprisonment in the Château d'If, dramatic escape, and cold vengeance." },
  { id: 1257, title: "The Three Musketeers", author: "Alexandre Dumas", genre: "adventure", era: "19th Century (1844)", summary: "Young d'Artagnan and his comrades Athos, Porthos, and Aramis duel and defend the honour of the Queen of France." },
  { id: 215, title: "The Call of the Wild", author: "Jack London", genre: "adventure", era: "Early 20th Century (1903)", summary: "A domesticated St. Bernard/Scotch Collie mix is stolen from California and thrust into the brutal Yukon Klondike gold rush." },
  { id: 521, title: "The Life and Adventures of Robinson Crusoe", author: "Daniel Defoe", genre: "adventure", era: "18th Century (1719)", summary: "A castaway's ingenious twenty-eight-year struggle for survival, shelter, and companionship on a deserted tropical island." },
  { id: 1727, title: "The Odyssey", author: "Homer", genre: "adventure", era: "Ancient Greece (~8th Century BC)", summary: "Odysseus's perilous ten-year odyssey homeward to Ithaca after the fall of Troy, confronting cyclopes, sirens, and gods." },
  { id: 6130, title: "The Iliad", author: "Homer", genre: "adventure", era: "Ancient Greece (~8th Century BC)", summary: "The epic of wrath, glory, and tragedy during the final weeks of the Trojan War, centered on the rage of Achilles." },
  { id: 120, title: "Treasure Island", author: "Robert Louis Stevenson", genre: "adventure", era: "19th Century (1883)", summary: "Young Jim Hawkins embarks on the Hispaniola to locate Captain Flint's buried treasure against mutinous buccaneers." },
  { id: 1080, title: "A Modest Proposal", author: "Jonathan Swift", genre: "satire", era: "18th Century (1729)", summary: "A blistering satirical masterpiece on Irish poverty, political indifference, and ruthless economic calculation." },
  { id: 829, title: "Gulliver's Travels", author: "Jonathan Swift", genre: "satire", era: "18th Century (1726)", summary: "Lemuel Gulliver's voyages to Lilliput, Brobdingnag, Laputa, and the land of the Houyhnhnms satirizing human vanity." },

  // --- DETECTIVE, MYSTERY & SUSPENSE ---
  { id: 1661, title: "The Adventures of Sherlock Holmes", author: "Arthur Conan Doyle", genre: "mystery", era: "Victorian Era (1892)", summary: "Twelve ingenious deductive mystery investigations featuring Sherlock Holmes and Dr. John Watson in Victorian London." },
  { id: 2852, title: "The Hound of the Baskervilles", author: "Arthur Conan Doyle", genre: "mystery", era: "Victorian Era (1902)", summary: "Sherlock Holmes investigates the eerie moorland curse of a monstrous phantom hound terrorizing the Baskerville family." },
  { id: 155, title: "The Moonstone", author: "Wilkie Collins", genre: "mystery", era: "Victorian Era (1868)", summary: "Considered the first true detective novel in English, tracing the theft of a cursed sacred diamond from an English country estate." },
  { id: 204, title: "The Innocence of Father Brown", author: "G. K. Chesterton", genre: "mystery", era: "Early 20th Century (1911)", summary: "A gentle Catholic priest uses his deep understanding of human frailty and spiritual paradox to solve perplexing crimes." },
  { id: 4014, title: "The Extraordinary Adventures of Arsène Lupin, Gentleman-Burglar", author: "Maurice Leblanc", genre: "mystery", era: "Early 20th Century (1907)", summary: "The witty exploits, heists, and disguise artistry of France's beloved aristocratic master of disguise." },
  { id: 2767, title: "The Devil's Paw", author: "E. Phillips Oppenheim", genre: "mystery", era: "Early 20th Century (1920)", summary: "A thrilling political and diplomatic mystery set during wartime tensions, dealing with espionage, secrets, and betrayal." },

  // --- ROMANCE, SOCIETY & VICTORIAN PANORAMA ---
  { id: 1342, title: "Pride and Prejudice", author: "Jane Austen", genre: "romance", era: "Regency Era (1813)", summary: "The turbulent relationship between the quick-witted Elizabeth Bennet and the proud aristocrat Fitzwilliam Darcy." },
  { id: 158, title: "Emma", author: "Jane Austen", genre: "romance", era: "Regency Era (1815)", summary: "A clever, privileged heroine who fancies herself a matchmaker learns humbling lessons about her own heart." },
  { id: 1260, title: "Jane Eyre", author: "Charlotte Brontë", genre: "romance", era: "Victorian Era (1847)", summary: "The passionate, resilient moral journey of an orphaned governess who falls in love with the brooding Edward Rochester." },
  { id: 768, title: "Wuthering Heights", author: "Emily Brontë", genre: "romance", era: "Victorian Era (1847)", summary: "A tempestuous, ferocious saga of doomed obsession and vengeful passion across the windswept Yorkshire moors." },
  { id: 145, title: "Middlemarch", author: "George Eliot", genre: "classics", era: "Victorian Era (1871)", summary: "A richly detailed study of provincial English life, marriage, idealism, social reform, and human compromise." },
  { id: 110, title: "Tess of the d'Urbervilles", author: "Thomas Hardy", genre: "classics", era: "Victorian Era (1891)", summary: "A poignant tragedy of an impoverished rural maiden buffeted by hypocritical sexual morality and cruel fate." },

  // --- POETRY, DRAMA & SPIRITUAL ---
  { id: 8800, title: "The Divine Comedy", author: "Dante Alighieri", genre: "poetry", era: "14th Century (~1320)", summary: "Dante's vision of the afterlife, guided by Virgil through the circles of Inferno and Purgatorio to Paradiso." },
  { id: 20, title: "Paradise Lost", author: "John Milton", genre: "poetry", era: "17th Century (1667)", summary: "The epic blank-verse retelling of the fall of Man and Satan's rebellion in heaven, justifying the ways of God to men." },
  { id: 1322, title: "Leaves of Grass", author: "Walt Whitman", genre: "poetry", era: "19th Century (1855)", summary: "A celebration of democracy, nature, the human body, transcendental oneness, and the American spirit." },
  { id: 7164, title: "Gitanjali", author: "Rabindranath Tagore", genre: "poetry", era: "Early 20th Century (1912)", summary: "Nobel-winning devotional and lyrical song offerings exploring divine love, mortality, and the cosmos." },
  { id: 246, title: "The Rubaiyat of Omar Khayyam", author: "Omar Khayyam (trans. Edward FitzGerald)", genre: "poetry", era: "11th / 19th Century", summary: "Timeless Persian quatrains celebrating the present moment, wine, transience, and the mysteries of destiny." },
  { id: 58585, title: "The Prophet", author: "Kahlil Gibran", genre: "philosophy", era: "Early 20th Century (1923)", summary: "Poetic essays and spiritual counsel on love, marriage, children, sorrow, freedom, and time from Almustafa." },
  { id: 844, title: "The Importance of Being Earnest", author: "Oscar Wilde", genre: "drama", era: "Late Victorian (1895)", summary: "A sparkling high-society comedy of mistaken identity, double lives, and sparkling satiric wit." },
  { id: 1524, title: "Hamlet, Prince of Denmark", author: "William Shakespeare", genre: "drama", era: "Renaissance (~1600)", summary: "The quintessential tragedy of grief, hesitation, feigned madness, and revenge in the Danish court of Elsinore." },
  { id: 1533, title: "Macbeth", author: "William Shakespeare", genre: "drama", era: "Renaissance (~1606)", summary: "A grim examination of raw ambition, prophecy, guilt, and paranoia after Macbeth murders the King of Scotland." },

  // --- AMERICAN LITERATURE & HISTORICAL NARRATIVES ---
  { id: 76, title: "Adventures of Huckleberry Finn", author: "Mark Twain", genre: "classics", era: "19th Century (1884)", summary: "Huck and the runaway slave Jim raft down the Mississippi River, exploring conscience, freedom, and human dignity." },
  { id: 23, title: "The Narrative of the Life of Frederick Douglass", author: "Frederick Douglass", genre: "history", era: "19th Century (1845)", summary: "A courageous autobiographical testament to the brutality of slavery and the triumph of literacy and liberation." },
  { id: 3176, title: "The Innocents Abroad", author: "Mark Twain", genre: "humor", era: "19th Century (1869)", summary: "Twain's hilarious travel letters recounting an excursion of American tourists through Europe and the Holy Land." },
  { id: 5670, title: "Jacob's Room", author: "Virginia Woolf", genre: "classics", era: "Early 20th Century (1922)", summary: "Woolf's landmark modernist novel composed of fleeting impressions and psychological portraits of Jacob Flanders." }
];

export const GENRES = [
  { id: "all", label: "🎲 Surprise Me (Any)" },
  { id: "philosophy", label: "🏛️ Philosophy & Wisdom" },
  { id: "gothic", label: "🕯️ Gothic & Horror" },
  { id: "scifi", label: "🚀 Sci-Fi & Speculative" },
  { id: "classics", label: "📖 World Classics" },
  { id: "adventure", label: "🗺️ Adventure & Epics" },
  { id: "mystery", label: "🔍 Mystery & Detective" },
  { id: "romance", label: "🌹 Romance & Victorian" },
  { id: "poetry", label: "✒️ Poetry & Spiritual" },
  { id: "drama", label: "🎭 Drama & Plays" }
];

/**
 * Fetch text for a book ID, checking local cache first.
 */
export async function getBookText(bookId) {
  const cacheFile = path.join(CACHE_DIR, `pg${bookId}.txt`);

  try {
    const cached = await fs.readFile(cacheFile, 'utf8');
    if (cached && cached.length > 500) {
      return cached;
    }
  } catch {
    // Cache miss, proceed to fetch
  }

  // Try Gutenberg mirrors
  const urls = [
    `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`,
    `https://www.gutenberg.org/files/${bookId}/${bookId}-0.txt`,
    `https://www.gutenberg.org/ebooks/${bookId}.txt.utf-8`
  ];

  for (const url of urls) {
    try {
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'BibliothecaReader/1.0 (Educational Literature Explorer)' },
        signal: AbortSignal.timeout(12000)
      });
      if (resp.ok) {
        const text = await resp.text();
        if (text && text.length > 1000) {
          await fs.writeFile(cacheFile, text, 'utf8').catch(() => {});
          return text;
        }
      }
    } catch {
      // Continue to next mirror
    }
  }

  throw new Error(`Unable to fetch full text for book ID ${bookId} from mirrors.`);
}

/**
 * Fetch book metadata from Gutendex or fallback to curated metadata.
 */
export async function getBookMetadata(bookId) {
  const metaCacheFile = path.join(CACHE_DIR, `meta_${bookId}.json`);

  try {
    const cached = await fs.readFile(metaCacheFile, 'utf8');
    if (cached) return JSON.parse(cached);
  } catch {}

  const curated = CURATED_CATALOG.find(b => b.id === Number(bookId));

  try {
    const resp = await fetch(`https://gutendex.com/books/?ids=${bookId}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        const metadata = {
          id: item.id,
          title: item.title,
          authors: item.authors || [],
          authorStr: item.authors?.map(a => a.name.split(',').reverse().join(' ').trim()).join(', ') || curated?.author || 'Unknown Author',
          subjects: item.subjects || [],
          bookshelves: item.bookshelves || [],
          languages: item.languages || ['en'],
          downloadCount: item.download_count || 0,
          summary: item.summaries?.[0] || curated?.summary || 'A recognized masterwork of world literature.',
          era: curated?.era || 'Classic Literature',
          genre: curated?.genre || 'classics',
          formats: item.formats || {}
        };
        await fs.writeFile(metaCacheFile, JSON.stringify(metadata, null, 2), 'utf8').catch(() => {});
        return metadata;
      }
    }
  } catch {
    // Timeout/offline: fallback to curated
  }

  if (curated) {
    return {
      id: curated.id,
      title: curated.title,
      authors: [{ name: curated.author }],
      authorStr: curated.author,
      subjects: [curated.genre],
      bookshelves: [],
      languages: ['en'],
      downloadCount: 25000,
      summary: curated.summary,
      era: curated.era,
      genre: curated.genre,
      formats: {
        'text/html': `https://www.gutenberg.org/ebooks/${curated.id}.html.images`,
        'application/epub+zip': `https://www.gutenberg.org/ebooks/${curated.id}.epub3.images`,
        'application/x-mobipocket-ebook': `https://www.gutenberg.org/ebooks/${curated.id}.kf8.images`,
        'text/plain; charset=utf-8': `https://www.gutenberg.org/ebooks/${curated.id}.txt.utf-8`
      }
    };
  }

  throw new Error(`Could not locate metadata for book ID ${bookId}`);
}

/**
 * Strips Project Gutenberg legal preambles and licensing footers cleanly.
 */
export function cleanGutenbergBoilerplate(rawText) {
  if (!rawText) return '';

  let text = rawText;

  const startRegexes = [
    /\*\*\*\s*START OF TH(?:E|IS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i,
    /\*\*\*\s*START OF THE PROJECT GUTENBERG[^*]*\*\*\*/i,
    /START OF THIS PROJECT GUTENBERG/i,
    /Transcriber's Note/i
  ];

  for (const reg of startRegexes) {
    const match = text.match(reg);
    if (match && match.index !== undefined) {
      text = text.slice(match.index + match[0].length);
      break;
    }
  }

  const endRegexes = [
    /\*\*\*\s*END OF TH(?:E|IS) PROJECT GUTENBERG EBOOK[^*]*\*\*\*/i,
    /\*\*\*\s*END OF THE PROJECT GUTENBERG[^*]*\*\*\*/i,
    /End of the Project Gutenberg/i,
    /End of Project Gutenberg/i
  ];

  for (const reg of endRegexes) {
    const match = text.match(reg);
    if (match && match.index !== undefined) {
      text = text.slice(0, match.index);
      break;
    }
  }

  return text.trim();
}

/**
 * Normalizes Gutenberg text: joins wrapped lines inside paragraphs while preserving
 * true paragraph breaks and dialogue spacing.
 */
export function normalizeTypography(text) {
  let cleaned = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const rawParagraphs = cleaned.split(/\n{2,}/);
  const processedParagraphs = [];

  for (let p of rawParagraphs) {
    p = p.trim();
    if (!p) continue;

    // Filter out Gutenberg illustration tags or boilerplate note artifacts
    if (/^\[Illustration.*\]$/is.test(p)) continue;
    if (/^Produced by /i.test(p)) continue;

    // Normalize interior single line breaks into spaces
    const unwrapped = p
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .join(' ');

    if (unwrapped.length > 0) {
      processedParagraphs.push(unwrapped);
    }
  }

  return processedParagraphs;
}

/**
 * Extracts a meaningful 15-30 minute reading excerpt (~3,000 to 5,500 words).
 */
export function extractReadingSession(cleanedText, targetMinutes = 20) {
  // Reading speed: ~220 words per minute
  // 15 min = 3,300 words
  // 20 min = 4,400 words
  // 30 min = 6,600 words
  const targetWords = Math.max(2500, Math.round(targetMinutes * 220));
  const minWords = Math.max(2200, Math.round(targetWords * 0.75));
  const maxWords = Math.round(targetWords * 1.3);

  const paragraphs = normalizeTypography(cleanedText);

  if (paragraphs.length === 0) {
    return {
      sectionTitle: "Opening Section",
      paragraphs: ["Unable to parse literature excerpt."],
      wordCount: 0,
      estimatedMinutes: 0
    };
  }

  // Identify candidate chapter headings
  const chapterRegex = /^(?:CHAPTER|BOOK|CANTO|ACT|SCENE|PART|SECTION|STAVE|LETTER|STORY|ESSAY)\s+[IVXLCDM0-9]+(?:\.|\:|\s+|$)/i;
  const chapterIndices = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (p.length < 100 && chapterRegex.test(p)) {
      chapterIndices.push(i);
    }
  }

  // If chapters were detected, pick a random chapter and accumulate to meet 15-30 min
  if (chapterIndices.length >= 2) {
    // Avoid table of contents at the very beginning
    const validStarts = chapterIndices.filter(idx => idx > 1 && idx < paragraphs.length - 15);
    const startIdx = validStarts.length > 0
      ? validStarts[Math.floor(Math.random() * validStarts.length)]
      : chapterIndices[0];

    const chapterTitle = paragraphs[startIdx];
    let selectedParagraphs = [];
    let currentWords = 0;

    for (let i = startIdx + 1; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const pWords = p.split(/\s+/).length;

      if (chapterIndices.includes(i)) {
        if (currentWords >= minWords) {
          break; // Satisfying complete reading chunk achieved
        }
        selectedParagraphs.push(`--- ${p} ---`);
        continue;
      }

      selectedParagraphs.push(p);
      currentWords += pWords;

      if (currentWords >= maxWords) {
        break;
      }
    }

    if (selectedParagraphs.length > 5 && currentWords >= 1500) {
      return {
        sectionTitle: chapterTitle,
        paragraphs: selectedParagraphs,
        wordCount: currentWords,
        estimatedMinutes: Math.max(15, Math.round(currentWords / 220))
      };
    }
  }

  // Fallback: Paragraph window
  const minStart = Math.min(5, Math.floor(paragraphs.length * 0.05));
  const maxStart = Math.max(minStart, Math.floor(paragraphs.length * 0.65));
  const randomStart = minStart + Math.floor(Math.random() * (maxStart - minStart + 1));

  let selectedParagraphs = [];
  let currentWords = 0;
  let sectionTitle = "Selected Literary Passage";

  for (let i = randomStart; i >= Math.max(0, randomStart - 10); i--) {
    if (paragraphs[i].length < 100 && (chapterRegex.test(paragraphs[i]) || /^[A-Z\s]{4,}$/.test(paragraphs[i]))) {
      sectionTitle = paragraphs[i];
      break;
    }
  }

  for (let i = randomStart; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const pWords = p.split(/\s+/).length;
    selectedParagraphs.push(p);
    currentWords += pWords;

    if (currentWords >= targetWords) {
      break;
    }
  }

  return {
    sectionTitle,
    paragraphs: selectedParagraphs,
    wordCount: currentWords,
    estimatedMinutes: Math.max(15, Math.round(currentWords / 220))
  };
}

/**
 * Gets a random literature reading session.
 */
export async function getRandomLiterature({ genre = 'all', targetMinutes = 20, excludeId = null } = {}) {
  let pool = CURATED_CATALOG;

  if (genre && genre !== 'all') {
    pool = CURATED_CATALOG.filter(b => b.genre === genre);
    if (pool.length === 0) pool = CURATED_CATALOG;
  }

  if (excludeId && pool.length > 1) {
    pool = pool.filter(b => b.id !== Number(excludeId));
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];

  const [rawText, metadata] = await Promise.all([
    getBookText(chosen.id),
    getBookMetadata(chosen.id)
  ]);

  const cleaned = cleanGutenbergBoilerplate(rawText);
  const session = extractReadingSession(cleaned, targetMinutes);

  return {
    book: {
      id: metadata.id,
      title: metadata.title,
      author: metadata.authorStr,
      authors: metadata.authors,
      era: metadata.era,
      genre: metadata.genre,
      summary: metadata.summary,
      subjects: metadata.subjects,
      downloadCount: metadata.downloadCount,
      formats: metadata.formats,
      gutenbergUrl: `https://www.gutenberg.org/ebooks/${metadata.id}`
    },
    readingSession: session
  };
}
