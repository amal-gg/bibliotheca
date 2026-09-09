/**
 * BIBLIOTHECA - Interactive Reader & Soundscape Engine
 */

// --- STATE MANAGEMENT ---
const state = {
  currentBook: null,
  currentSession: null,
  selectedGenre: 'all',
  targetMinutes: 20,
  theme: localStorage.getItem('bibliotheca_theme') || 'parchment',
  fontFamily: localStorage.getItem('bibliotheca_font') || 'garamond',
  fontSize: parseInt(localStorage.getItem('bibliotheca_size') || '20', 10),
  lineSpacing: parseFloat(localStorage.getItem('bibliotheca_spacing') || '1.8'),
  readingWidth: localStorage.getItem('bibliotheca_width') || '780px',
  bookmarks: JSON.parse(localStorage.getItem('bibliotheca_bookmarks') || '[]'),
  history: JSON.parse(localStorage.getItem('bibliotheca_history') || '[]'),
  ambient: {
    active: false,
    sound: 'rain',
    volume: 0.5,
    audioCtx: null,
    nodes: [],
    crackleTimer: null,
    dropTimer: null
  },
  tts: {
    speaking: false,
    paused: false,
    currentParagraphIndex: 0,
    voice: localStorage.getItem('bibliotheca_tts_voice') || '',
    rate: parseFloat(localStorage.getItem('bibliotheca_tts_rate') || '0.90'),
    pitch: parseFloat(localStorage.getItem('bibliotheca_tts_pitch') || '1.0'),
    availableVoices: []
  }
};

const INSPIRATIONAL_QUOTES = [
  { quote: "A reader lives a thousand lives before he dies. The man who never reads lives only one.", author: "George R.R. Martin" },
  { quote: "There is no friend as loyal as a book.", author: "Ernest Hemingway" },
  { quote: "Books are a uniquely portable magic.", author: "Stephen King" },
  { quote: "I cannot remember the books I've read any more than the meals I have eaten; even so, they have made me.", author: "Ralph Waldo Emerson" },
  { quote: "The reading of all good books is like conversation with the finest minds of past centuries.", author: "René Descartes" },
  { quote: "Until I feared I would lose it, I never loved to read. One does not love breathing.", author: "Harper Lee" },
  { quote: "We read to know we are not alone.", author: "C.S. Lewis" }
];

// --- DOM ELEMENTS ---
const elements = {
  progressBar: document.getElementById('progressBar'),
  discoverBtn: document.getElementById('discoverBtn'),
  bottomDiscoverBtn: document.getElementById('bottomDiscoverBtn'),
  loadingCard: document.getElementById('loadingCard'),
  literatureCard: document.getElementById('literatureCard'),
  loadingQuote: document.getElementById('loadingQuote'),
  loadingQuoteAuthor: document.getElementById('loadingQuoteAuthor'),
  bookTitle: document.getElementById('bookTitle'),
  bookAuthor: document.getElementById('bookAuthor'),
  genreBadge: document.getElementById('genreBadge'),
  eraBadge: document.getElementById('eraBadge'),
  readingTimeBadge: document.getElementById('readingTimeBadge'),
  sectionTitle: document.getElementById('sectionTitle'),
  bookSummary: document.getElementById('bookSummary'),
  subjectsList: document.getElementById('subjectsList'),
  readingContent: document.getElementById('readingContent'),
  synopsisToggle: document.getElementById('synopsisToggle'),
  synopsisContent: document.getElementById('synopsisContent'),
  synopsisChevron: document.getElementById('synopsisChevron'),
  genreContainer: document.getElementById('genreContainer'),
  downloadDropdownBtn: document.getElementById('downloadDropdownBtn'),
  downloadMenu: document.getElementById('downloadMenu'),
  downloadEpub: document.getElementById('downloadEpub'),
  downloadMobi: document.getElementById('downloadMobi'),
  downloadTxt: document.getElementById('downloadTxt'),
  readOnlineLink: document.getElementById('readOnlineLink'),
  readFullInAppBtn: document.getElementById('readFullInAppBtn'),
  bookmarkCurrentBtn: document.getElementById('bookmarkCurrentBtn'),
  bookmarkCount: document.getElementById('bookmarkCount'),
  tabBookmarkCount: document.getElementById('tabBookmarkCount'),
  libraryDrawerBtn: document.getElementById('libraryDrawerBtn'),
  libraryDrawer: document.getElementById('libraryDrawer'),
  drawerBackdrop: document.getElementById('drawerBackdrop'),
  libraryCloseBtn: document.getElementById('libraryCloseBtn'),
  libraryList: document.getElementById('libraryList'),
  ambientBtn: document.getElementById('ambientBtn'),
  ambientModal: document.getElementById('ambientModal'),
  ambientCloseBtn: document.getElementById('ambientCloseBtn'),
  toggleAudioPlayBtn: document.getElementById('toggleAudioPlayBtn'),
  ambientVolume: document.getElementById('ambientVolume'),
  volumePercent: document.getElementById('volumePercent'),
  ambientAudioPlayer: document.getElementById('ambientAudioPlayer'),
  ttsBtn: document.getElementById('ttsBtn'),
  ttsModal: document.getElementById('ttsModal'),
  ttsCloseBtn: document.getElementById('ttsCloseBtn'),
  ttsVoiceSelect: document.getElementById('ttsVoiceSelect'),
  ttsSpeedSlider: document.getElementById('ttsSpeedSlider'),
  ttsSpeedDisplay: document.getElementById('ttsSpeedDisplay'),
  ttsPitchSlider: document.getElementById('ttsPitchSlider'),
  ttsPitchDisplay: document.getElementById('ttsPitchDisplay'),
  ttsPlayPauseBtn: document.getElementById('ttsPlayPauseBtn'),
  ttsPlayPauseIcon: document.getElementById('ttsPlayPauseIcon'),
  ttsPlayPauseText: document.getElementById('ttsPlayPauseText'),
  ttsPrevBtn: document.getElementById('ttsPrevBtn'),
  ttsNextBtn: document.getElementById('ttsNextBtn'),
  ttsStopBtn: document.getElementById('ttsStopBtn'),
  ttsStatus: document.getElementById('ttsStatus'),
  ttsAudioPlayer: document.getElementById('ttsAudioPlayer'),
  mobileAccessBtn: document.getElementById('mobileAccessBtn'),
  mobileModal: document.getElementById('mobileModal'),
  mobileCloseBtn: document.getElementById('mobileCloseBtn'),
  phoneLocalUrl: document.getElementById('phoneLocalUrl'),
  copyPhoneUrlBtn: document.getElementById('copyPhoneUrlBtn'),
  phoneQrCode: document.getElementById('phoneQrCode'),
  typographyBtn: document.getElementById('typographyBtn'),
  typographyModal: document.getElementById('typographyModal'),
  typographyCloseBtn: document.getElementById('typographyCloseBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeModal: document.getElementById('themeModal'),
  themeCloseBtn: document.getElementById('themeCloseBtn'),
  fontSizeSlider: document.getElementById('fontSizeSlider'),
  fontSizeDisplay: document.getElementById('fontSizeDisplay'),
  scrollTopBtn: document.getElementById('scrollTopBtn')
};

// --- INITIALIZATION ---
async function init() {
  applyTheme(state.theme);
  applyTypography();
  updateBookmarkCount();
  initVoices();
  initMobileInfo();
  setupEventListeners();
  await loadGenres();
  await fetchRandomLiterature();
}

// --- GENRES SETUP ---
async function loadGenres() {
  try {
    const res = await fetch('/api/genres');
    const data = await res.json();
    if (data.genres) {
      elements.genreContainer.innerHTML = '';
      data.genres.forEach(g => {
        const pill = document.createElement('button');
        pill.className = `genre-pill ${g.id === state.selectedGenre ? 'active' : ''}`;
        pill.textContent = g.label;
        pill.dataset.genre = g.id;
        pill.addEventListener('click', () => {
          document.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          state.selectedGenre = g.id;
          fetchRandomLiterature();
        });
        elements.genreContainer.appendChild(pill);
      });
    }
  } catch (err) {
    console.warn('Could not load genres from API, using defaults:', err);
  }
}

// --- FETCH RANDOM LITERATURE ---
async function fetchRandomLiterature() {
  // Stop TTS if currently speaking
  stopTTS();

  // Show loading state with a random literary quote
  showLoading(true);

  const excludeId = state.currentBook ? state.currentBook.id : '';
  const url = `/api/random?genre=${encodeURIComponent(state.selectedGenre)}&minutes=${state.targetMinutes}&excludeId=${excludeId}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    state.currentBook = data.book;
    state.currentSession = data.readingSession;

    // Render new content
    renderLiterature(data);

    // Save to reading history
    addToHistory(data.book, data.readingSession);

    // Scroll smoothly to top of card
    window.scrollTo({ top: elements.literatureCard.offsetTop - 80, behavior: 'smooth' });
  } catch (err) {
    console.error('Error fetching literature:', err);
    alert('Failed to fetch a literary excerpt from the archive. Please try again!');
  } finally {
    showLoading(false);
  }
}

// --- RENDER LITERATURE ---
function renderLiterature(data) {
  const { book, readingSession } = data;

  // Metadata
  elements.bookTitle.textContent = book.title;
  elements.bookAuthor.textContent = book.author;
  elements.genreBadge.textContent = book.genre ? book.genre.toUpperCase() : 'LITERATURE';
  elements.eraBadge.textContent = book.era || 'Classic Era';
  elements.readingTimeBadge.textContent = `⏱️ ${readingSession.estimatedMinutes} min read · ${readingSession.wordCount.toLocaleString()} words`;
  elements.sectionTitle.textContent = readingSession.sectionTitle || 'Selected Passage';
  elements.bookSummary.textContent = book.summary || 'A recognized masterwork of world literature.';

  // Subjects
  elements.subjectsList.innerHTML = '';
  if (book.subjects && book.subjects.length > 0) {
    book.subjects.slice(0, 5).forEach(sub => {
      const tag = document.createElement('span');
      tag.className = 'subject-tag';
      tag.textContent = sub.split('--')[0].trim();
      elements.subjectsList.appendChild(tag);
    });
  }

  // Reading Content
  elements.readingContent.innerHTML = '';
  readingSession.paragraphs.forEach((para, idx) => {
    if (para.startsWith('---') && para.endsWith('---')) {
      const breakDiv = document.createElement('div');
      breakDiv.className = 'section-break';
      breakDiv.textContent = para.replace(/---/g, '').trim();
      elements.readingContent.appendChild(breakDiv);
    } else {
      const p = document.createElement('p');
      p.id = `para-${idx}`;
      p.textContent = para;
      elements.readingContent.appendChild(p);
    }
  });

  // Download Links
  setupDownloadLinks(book);

  // Update Bookmark Button state
  updateBookmarkButtonState();
}

// --- DOWNLOADS & FULL BOOK ACCESS ---
function setupDownloadLinks(book) {
  const formats = book.formats || {};

  // EPUB
  const epubUrl = formats['application/epub+zip'] || `https://www.gutenberg.org/ebooks/${book.id}.epub3.images`;
  elements.downloadEpub.href = epubUrl;

  // MOBI / Kindle
  const mobiUrl = formats['application/x-mobipocket-ebook'] || `https://www.gutenberg.org/ebooks/${book.id}.kf8.images`;
  elements.downloadMobi.href = mobiUrl;

  // Text
  const txtUrl = formats['text/plain; charset=utf-8'] || `https://www.gutenberg.org/ebooks/${book.id}.txt.utf-8`;
  elements.downloadTxt.href = txtUrl;

  // HTML Online
  const htmlUrl = formats['text/html'] || `https://www.gutenberg.org/ebooks/${book.id}.html.images`;
  elements.readOnlineLink.href = htmlUrl;

  // Read full book in-app
  elements.readFullInAppBtn.onclick = async () => {
    elements.downloadMenu.classList.add('hidden');
    showLoading(true);
    try {
      const res = await fetch(`/api/book/${book.id}/full`);
      const fullData = await res.json();
      if (fullData.text) {
        elements.readingContent.innerHTML = '';
        const lines = fullData.text.split(/\n{2,}/);
        lines.forEach((l, idx) => {
          const trimmed = l.trim();
          if (trimmed) {
            const p = document.createElement('p');
            p.id = `para-${idx}`;
            p.textContent = trimmed.split('\n').join(' ');
            elements.readingContent.appendChild(p);
          }
        });
        elements.sectionTitle.textContent = "Complete Book Text";
        elements.readingTimeBadge.textContent = `Full Work · ${fullData.text.split(/\s+/).length.toLocaleString()} words`;
      }
    } catch (err) {
      alert('Could not load complete book in-app: ' + err.message);
    } finally {
      showLoading(false);
    }
  };
}

// --- LOADING STATE ---
function showLoading(show) {
  if (show) {
    const randomQuote = INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)];
    elements.loadingQuote.textContent = randomQuote.quote;
    elements.loadingQuoteAuthor.textContent = `— ${randomQuote.author}`;
    elements.loadingCard.classList.remove('hidden');
    elements.literatureCard.style.opacity = '0.3';
  } else {
    elements.loadingCard.classList.add('hidden');
    elements.literatureCard.style.opacity = '1';
  }
}

// --- BOOKMARKING & LIBRARY ---
function updateBookmarkButtonState() {
  if (!state.currentBook) return;
  const isBookmarked = state.bookmarks.some(b => b.book.id === state.currentBook.id);
  if (isBookmarked) {
    elements.bookmarkCurrentBtn.classList.add('bookmarked');
    elements.bookmarkCurrentBtn.querySelector('span').textContent = 'Bookmarked ★';
  } else {
    elements.bookmarkCurrentBtn.classList.remove('bookmarked');
    elements.bookmarkCurrentBtn.querySelector('span').textContent = 'Bookmark';
  }
}

function toggleBookmark() {
  if (!state.currentBook || !state.currentSession) return;

  const idx = state.bookmarks.findIndex(b => b.book.id === state.currentBook.id);
  if (idx >= 0) {
    state.bookmarks.splice(idx, 1);
  } else {
    state.bookmarks.unshift({
      book: state.currentBook,
      readingSession: state.currentSession,
      savedAt: new Date().toISOString()
    });
  }

  localStorage.setItem('bibliotheca_bookmarks', JSON.stringify(state.bookmarks));
  updateBookmarkCount();
  updateBookmarkButtonState();
  renderLibraryList('bookmarks');
}

function addToHistory(book, session) {
  // Add to start of history, keep last 20
  state.history = state.history.filter(h => h.book.id !== book.id);
  state.history.unshift({
    book,
    readingSession: session,
    readAt: new Date().toISOString()
  });
  if (state.history.length > 25) state.history.pop();
  localStorage.setItem('bibliotheca_history', JSON.stringify(state.history));
}

function updateBookmarkCount() {
  const count = state.bookmarks.length;
  elements.bookmarkCount.textContent = count;
  elements.tabBookmarkCount.textContent = count;
}

function renderLibraryList(tab = 'bookmarks') {
  const items = tab === 'bookmarks' ? state.bookmarks : state.history;
  elements.libraryList.innerHTML = '';

  if (items.length === 0) {
    elements.libraryList.innerHTML = `
      <div class="drawer-empty">
        <p>${tab === 'bookmarks' ? 'No bookmarks saved yet. Click the "Bookmark" button on any passage to save it for later.' : 'No reading history recorded yet.'}</p>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'library-item';
    card.innerHTML = `
      <div class="library-item-title">${item.book.title}</div>
      <div class="library-item-author">By ${item.book.author} · ${item.readingSession.estimatedMinutes} min</div>
      <div class="library-item-snippet">${item.readingSession.paragraphs[0] || ''}</div>
    `;
    card.onclick = () => {
      state.currentBook = item.book;
      state.currentSession = item.readingSession;
      renderLiterature(item);
      toggleLibraryDrawer(false);
      window.scrollTo({ top: elements.literatureCard.offsetTop - 80, behavior: 'smooth' });
    };
    elements.libraryList.appendChild(card);
  });
}

function toggleLibraryDrawer(open) {
  if (open) {
    elements.libraryDrawer.classList.remove('closed');
    elements.drawerBackdrop.classList.remove('hidden');
    renderLibraryList('bookmarks');
  } else {
    elements.libraryDrawer.classList.add('closed');
    elements.drawerBackdrop.classList.add('hidden');
  }
}

// --- READING PROGRESS TRACKER ---
window.addEventListener('scroll', () => {
  const card = elements.literatureCard;
  if (!card) return;

  const cardRect = card.getBoundingClientRect();
  const totalHeight = card.clientHeight - window.innerHeight;

  if (totalHeight > 0) {
    const currentScrolled = -cardRect.top;
    let percentage = (currentScrolled / totalHeight) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    elements.progressBar.style.width = `${percentage}%`;
  }
});

// --- THEMES & STYLES ---
function applyTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName);
  state.theme = themeName;
  localStorage.setItem('bibliotheca_theme', themeName);

  document.querySelectorAll('.theme-card').forEach(c => {
    c.classList.toggle('active', c.dataset.theme === themeName);
  });
}

function cycleTheme() {
  const themes = ['parchment', 'midnight', 'sepia', 'emerald', 'studio'];
  const next = themes[(themes.indexOf(state.theme) + 1) % themes.length];
  applyTheme(next);
}

function applyTypography() {
  // Font Family
  const fontMap = {
    garamond: "'EB Garamond', Georgia, serif",
    merriweather: "'Merriweather', Georgia, serif",
    playfair: "'Playfair Display', serif",
    sans: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace"
  };
  document.documentElement.style.setProperty('--font-reading', fontMap[state.fontFamily] || fontMap.garamond);
  document.documentElement.style.setProperty('--font-size-base', `${state.fontSize}px`);
  document.documentElement.style.setProperty('--line-height-base', state.lineSpacing);
  document.documentElement.style.setProperty('--reading-width', state.readingWidth);

  elements.fontSizeDisplay.textContent = `${state.fontSize}px`;
  elements.fontSizeSlider.value = state.fontSize;

  // Active buttons in modal
  document.querySelectorAll('.font-choice').forEach(b => {
    b.classList.toggle('active', b.dataset.font === state.fontFamily);
  });
  document.querySelectorAll('#lineSpacingControl button').forEach(b => {
    b.classList.toggle('active', parseFloat(b.dataset.spacing) === state.lineSpacing);
  });
  document.querySelectorAll('#readingWidthControl button').forEach(b => {
    b.classList.toggle('active', b.dataset.width === state.readingWidth);
  });
}

// --- AMBIENT SOUND ENGINE (Distinct, Authentic High-Fidelity Audio Soundscapes) ---
const SOUND_FILES = {
  rain: '/sounds/rain.mp3',
  fireplace: '/sounds/fireplace.mp3',
  library: '/sounds/library.mp3',
  breeze: '/sounds/breeze.mp3',
  cafe: '/sounds/cafe.mp3',
  waves: '/sounds/waves.mp3'
};

function startAmbientSound(soundType) {
  if (!elements.ambientAudioPlayer) return;
  const soundKey = soundType || state.ambient.sound || 'rain';
  const soundSrc = SOUND_FILES[soundKey] || SOUND_FILES.rain;

  state.ambient.sound = soundKey;
  elements.ambientAudioPlayer.src = soundSrc;
  elements.ambientAudioPlayer.volume = state.ambient.volume;
  elements.ambientAudioPlayer.loop = true;

  elements.ambientAudioPlayer.play()
    .then(() => {
      state.ambient.active = true;
      elements.toggleAudioPlayBtn.textContent = 'Pause Soundscape';
      elements.ambientBtn.classList.add('highlight');
      document.querySelectorAll('.sound-card').forEach(card => {
        card.classList.toggle('active', card.dataset.sound === soundKey);
      });
    })
    .catch(err => {
      console.warn('Ambient sound autoplay prevented by browser:', err);
      state.ambient.active = false;
      elements.toggleAudioPlayBtn.textContent = 'Start Soundscape';
    });
}

function stopAmbientSound() {
  if (elements.ambientAudioPlayer) {
    elements.ambientAudioPlayer.pause();
  }
  state.ambient.active = false;
  elements.toggleAudioPlayBtn.textContent = 'Start Soundscape';
  elements.ambientBtn.classList.remove('highlight');
}

// --- MOBILE ACCESS & QR CODE ENGINE ---
async function initMobileInfo() {
  try {
    const res = await fetch('/api/network-info');
    if (res.ok) {
      const data = await res.json();
      const localUrl = data.url || `http://${window.location.hostname}:${window.location.port || 3000}`;
      if (elements.phoneLocalUrl) {
        elements.phoneLocalUrl.value = localUrl;
      }
      if (elements.phoneQrCode) {
        // High quality QR code via public QR service
        elements.phoneQrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(localUrl)}&bgcolor=fbf0d9&color=2c221e`;
      }
    }
  } catch (err) {
    console.warn('Could not fetch network info:', err);
    if (elements.phoneLocalUrl) {
      elements.phoneLocalUrl.value = window.location.origin;
    }
  }

  if (elements.mobileAccessBtn) {
    elements.mobileAccessBtn.addEventListener('click', () => {
      elements.mobileModal.classList.toggle('hidden');
      elements.ambientModal.classList.add('hidden');
      elements.typographyModal.classList.add('hidden');
      elements.themeModal.classList.add('hidden');
      elements.ttsModal.classList.add('hidden');
    });
  }
  if (elements.mobileCloseBtn) {
    elements.mobileCloseBtn.addEventListener('click', () => {
      elements.mobileModal.classList.add('hidden');
    });
  }
  if (elements.copyPhoneUrlBtn) {
    elements.copyPhoneUrlBtn.addEventListener('click', async () => {
      if (elements.phoneLocalUrl) {
        try {
          await navigator.clipboard.writeText(elements.phoneLocalUrl.value);
          const original = elements.copyPhoneUrlBtn.textContent;
          elements.copyPhoneUrlBtn.textContent = 'Copied! ✓';
          setTimeout(() => {
            elements.copyPhoneUrlBtn.textContent = original;
          }, 2000);
        } catch {
          elements.phoneLocalUrl.select();
          document.execCommand('copy');
        }
      }
    });
  }
}

// --- RELAXING NARRATOR (Smooth Female Voice & Natural Speech Engine) ---
const NEURAL_VOICE_OPTIONS = [
  { id: 'cloud:en-US', name: '🌸 Soft American Female (Human Neural — Recommended)' },
  { id: 'cloud:en-GB', name: '🌸 Refined British Female (Human Neural)' },
  { id: 'cloud:en-AU', name: '🌸 Gentle Australian Female (Human Neural)' },
  { id: 'cloud:en-IN', name: '🌸 Calm Indian Female (Human Neural)' }
];

function initVoices() {
  elements.ttsVoiceSelect.innerHTML = '';

  // 1. Add Neural Human Voices Group
  const neuralGroup = document.createElement('optgroup');
  neuralGroup.label = '✨ Human-Like Neural Voices (Natural & Relaxing)';
  NEURAL_VOICE_OPTIONS.forEach(nv => {
    const opt = document.createElement('option');
    opt.value = nv.id;
    opt.textContent = nv.name;
    neuralGroup.appendChild(opt);
  });
  elements.ttsVoiceSelect.appendChild(neuralGroup);

  // 2. Add System / Browser voices as secondary fallback
  function populateSystemVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    state.tts.availableVoices = voices;
    let sysGroup = elements.ttsVoiceSelect.querySelector('optgroup[label="Device / System Voices"]');
    if (!sysGroup) {
      sysGroup = document.createElement('optgroup');
      sysGroup.label = 'Device / System Voices';
      elements.ttsVoiceSelect.appendChild(sysGroup);
    } else {
      sysGroup.innerHTML = '';
    }

    const englishVoices = voices.filter(v => v.lang.startsWith('en'));
    const candidateVoices = englishVoices.length > 0 ? englishVoices : voices;

    candidateVoices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI || v.name;
      opt.textContent = `${v.name} (${v.lang})`;
      sysGroup.appendChild(opt);
    });

    if (state.tts.voice) {
      elements.ttsVoiceSelect.value = state.tts.voice;
    }
  }

  // Ensure default is soft human neural
  if (!state.tts.voice || (!state.tts.voice.startsWith('cloud:') && !state.tts.voice.includes('Natural') && !state.tts.voice.includes('Online'))) {
    state.tts.voice = 'cloud:en-US';
  }
  elements.ttsVoiceSelect.value = state.tts.voice;

  populateSystemVoices();
  if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = populateSystemVoices;
  }

  // Set initial slider displays
  elements.ttsSpeedSlider.value = state.tts.rate;
  elements.ttsSpeedDisplay.textContent = `${state.tts.rate.toFixed(2)}x`;
  elements.ttsPitchSlider.value = state.tts.pitch;
  elements.ttsPitchDisplay.textContent = `${state.tts.pitch.toFixed(1)}x`;

  // Hook audio player events for cloud TTS
  if (elements.ttsAudioPlayer) {
    elements.ttsAudioPlayer.onended = () => {
      if (state.tts.speaking && !state.tts.paused) {
        speakParagraph(state.tts.currentParagraphIndex + 1);
      }
    };
    elements.ttsAudioPlayer.onerror = (e) => {
      console.warn('TTS Audio Player error, attempting fallback:', e);
      if (state.tts.speaking && !state.tts.paused) {
        const paragraphs = getReadableParagraphs();
        const currentP = paragraphs[state.tts.currentParagraphIndex];
        if (currentP) {
          speakWithSystemVoice(currentP.textContent.trim(), state.tts.currentParagraphIndex);
        } else {
          stopTTS();
        }
      }
    };
  }
}

function getReadableParagraphs() {
  return Array.from(elements.readingContent.querySelectorAll('p:not(.section-break)'));
}

function clearReadingHighlight() {
  document.querySelectorAll('.reading-highlight').forEach(p => p.classList.remove('reading-highlight'));
}

function speakParagraph(index) {
  const paragraphs = getReadableParagraphs();

  if (index < 0 || index >= paragraphs.length) {
    stopTTS();
    elements.ttsStatus.textContent = 'Completed reading passage ✨';
    return;
  }

  // Stop any active system speech or audio playback
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  if (elements.ttsAudioPlayer) {
    elements.ttsAudioPlayer.pause();
  }

  state.tts.currentParagraphIndex = index;
  state.tts.speaking = true;
  state.tts.paused = false;

  const currentP = paragraphs[index];
  clearReadingHighlight();
  currentP.classList.add('reading-highlight');
  currentP.scrollIntoView({ behavior: 'smooth', block: 'center' });

  elements.ttsStatus.textContent = `Reading paragraph ${index + 1} of ${paragraphs.length}`;
  elements.ttsPlayPauseIcon.textContent = '⏸';
  elements.ttsPlayPauseText.textContent = 'Pause';
  elements.ttsBtn.classList.add('highlight');
  elements.ttsBtn.querySelector('.btn-text').textContent = 'Reading...';

  const text = currentP.textContent.trim();
  if (!text) {
    speakParagraph(index + 1);
    return;
  }

  const selectedVoice = state.tts.voice || elements.ttsVoiceSelect.value || 'cloud:en-US';

  if (selectedVoice.startsWith('cloud:')) {
    // Neural Human-Like Voice via server-side cached MP3 streaming
    const lang = selectedVoice.replace('cloud:', '') || 'en-US';
    const audioUrl = `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`;
    
    elements.ttsAudioPlayer.src = audioUrl;
    elements.ttsAudioPlayer.playbackRate = state.tts.rate;
    elements.ttsAudioPlayer.play().catch(err => {
      console.warn('Neural TTS playback failed, attempting device voice fallback:', err);
      speakWithSystemVoice(text, index);
    });
  } else {
    // Device / System voice fallback
    speakWithSystemVoice(text, index);
  }
}

function speakWithSystemVoice(text, index) {
  if (!('speechSynthesis' in window)) {
    elements.ttsStatus.textContent = 'Speech synthesis not supported';
    stopTTS();
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = state.tts.availableVoices.find(v => (v.voiceURI || v.name) === state.tts.voice);
  if (voice) utterance.voice = voice;
  utterance.rate = state.tts.rate;
  utterance.pitch = state.tts.pitch;

  utterance.onend = () => {
    if (state.tts.speaking && !state.tts.paused) {
      speakParagraph(index + 1);
    }
  };

  utterance.onerror = (e) => {
    if (e.error !== 'interrupted' && e.error !== 'canceled') {
      console.warn('SpeechSynthesis error:', e);
      stopTTS();
    }
  };

  window.speechSynthesis.speak(utterance);
}

function toggleTTS() {
  const isCloud = (state.tts.voice || elements.ttsVoiceSelect.value || '').startsWith('cloud:');

  if (state.tts.speaking) {
    if (state.tts.paused) {
      // Resume
      if (isCloud && elements.ttsAudioPlayer) {
        elements.ttsAudioPlayer.play();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.resume();
      }
      state.tts.paused = false;
      elements.ttsPlayPauseIcon.textContent = '⏸';
      elements.ttsPlayPauseText.textContent = 'Pause';
      elements.ttsBtn.querySelector('.btn-text').textContent = 'Reading...';
      elements.ttsStatus.textContent = `Resumed paragraph ${state.tts.currentParagraphIndex + 1}`;
    } else {
      // Pause
      if (isCloud && elements.ttsAudioPlayer) {
        elements.ttsAudioPlayer.pause();
      } else if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
      }
      state.tts.paused = true;
      elements.ttsPlayPauseIcon.textContent = '▶';
      elements.ttsPlayPauseText.textContent = 'Resume';
      elements.ttsBtn.querySelector('.btn-text').textContent = 'Paused';
      elements.ttsStatus.textContent = `Paused at paragraph ${state.tts.currentParagraphIndex + 1}`;
    }
  } else {
    speakParagraph(state.tts.currentParagraphIndex || 0);
  }
}

function stopTTS() {
  if (elements.ttsAudioPlayer) {
    elements.ttsAudioPlayer.pause();
    elements.ttsAudioPlayer.currentTime = 0;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  state.tts.speaking = false;
  state.tts.paused = false;
  clearReadingHighlight();
  elements.ttsPlayPauseIcon.textContent = '▶';
  elements.ttsPlayPauseText.textContent = 'Start Reading';
  elements.ttsBtn.classList.remove('highlight');
  elements.ttsBtn.querySelector('.btn-text').textContent = 'Listen';
  elements.ttsStatus.textContent = 'Ready to narrate';
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Discovery Buttons
  elements.discoverBtn.addEventListener('click', fetchRandomLiterature);
  elements.bottomDiscoverBtn.addEventListener('click', fetchRandomLiterature);

  // Keyboard shortcut [R] to discover, [B] to bookmark, [T] for theme
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'r' || e.key === 'R') {
      fetchRandomLiterature();
    } else if (e.key === 'b' || e.key === 'B') {
      toggleBookmark();
    } else if (e.key === 't' || e.key === 'T') {
      cycleTheme();
    }
  });

  // Reading Time duration toggle
  document.querySelectorAll('.duration-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.duration-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.targetMinutes = parseInt(btn.dataset.minutes, 10);
      fetchRandomLiterature();
    });
  });

  // Synopsis Collapsible
  elements.synopsisToggle.addEventListener('click', () => {
    const isCollapsed = elements.synopsisContent.classList.toggle('collapsed');
    elements.synopsisChevron.textContent = isCollapsed ? '▸' : '▾';
  });

  // Download Dropdown
  elements.downloadDropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.downloadMenu.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!elements.downloadMenu.contains(e.target) && e.target !== elements.downloadDropdownBtn) {
      elements.downloadMenu.classList.add('hidden');
    }
  });

  // Bookmark Button
  elements.bookmarkCurrentBtn.addEventListener('click', toggleBookmark);

  // Library Drawer
  elements.libraryDrawerBtn.addEventListener('click', () => toggleLibraryDrawer(true));
  elements.libraryCloseBtn.addEventListener('click', () => toggleLibraryDrawer(false));
  elements.drawerBackdrop.addEventListener('click', () => toggleLibraryDrawer(false));

  document.querySelectorAll('.drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderLibraryList(tab.dataset.tab);
    });
  });

  // Ambient Sound Modal & Controls
  elements.ambientBtn.addEventListener('click', () => {
    elements.ambientModal.classList.toggle('hidden');
    elements.typographyModal.classList.add('hidden');
    elements.themeModal.classList.add('hidden');
  });
  elements.ambientCloseBtn.addEventListener('click', () => elements.ambientModal.classList.add('hidden'));

  document.querySelectorAll('.sound-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.sound-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      state.ambient.sound = card.dataset.sound;
      if (state.ambient.active) {
        startAmbientSound(state.ambient.sound);
      }
    });
  });

  elements.toggleAudioPlayBtn.addEventListener('click', () => {
    if (state.ambient.active) {
      stopAmbientSound();
    } else {
      startAmbientSound(state.ambient.sound);
    }
  });

  elements.ambientVolume.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    state.ambient.volume = val / 100;
    elements.volumePercent.textContent = `${val}%`;
    if (elements.ambientAudioPlayer) {
      elements.ambientAudioPlayer.volume = state.ambient.volume;
    }
  });

  // TTS Controls & Popover
  elements.ttsBtn.addEventListener('click', () => {
    elements.ttsModal.classList.toggle('hidden');
    elements.ambientModal.classList.add('hidden');
    elements.typographyModal.classList.add('hidden');
    elements.themeModal.classList.add('hidden');
  });
  elements.ttsCloseBtn.addEventListener('click', () => elements.ttsModal.classList.add('hidden'));

  elements.ttsVoiceSelect.addEventListener('change', (e) => {
    state.tts.voice = e.target.value;
    localStorage.setItem('bibliotheca_tts_voice', state.tts.voice);
    if (state.tts.speaking) {
      speakParagraph(state.tts.currentParagraphIndex);
    }
  });

  elements.ttsSpeedSlider.addEventListener('input', (e) => {
    state.tts.rate = parseFloat(e.target.value);
    elements.ttsSpeedDisplay.textContent = `${state.tts.rate.toFixed(2)}x`;
    localStorage.setItem('bibliotheca_tts_rate', state.tts.rate);
    if (elements.ttsAudioPlayer) {
      elements.ttsAudioPlayer.playbackRate = state.tts.rate;
    }
  });

  elements.ttsPitchSlider.addEventListener('input', (e) => {
    state.tts.pitch = parseFloat(e.target.value);
    elements.ttsPitchDisplay.textContent = `${state.tts.pitch.toFixed(1)}x`;
    localStorage.setItem('bibliotheca_tts_pitch', state.tts.pitch);
  });

  elements.ttsPlayPauseBtn.addEventListener('click', toggleTTS);
  elements.ttsStopBtn.addEventListener('click', stopTTS);

  elements.ttsPrevBtn.addEventListener('click', () => {
    const nextIdx = Math.max(0, state.tts.currentParagraphIndex - 1);
    speakParagraph(nextIdx);
  });

  elements.ttsNextBtn.addEventListener('click', () => {
    const paragraphs = getReadableParagraphs();
    const nextIdx = Math.min(paragraphs.length - 1, state.tts.currentParagraphIndex + 1);
    speakParagraph(nextIdx);
  });

  document.querySelectorAll('.font-choice').forEach(b => {
    b.addEventListener('click', () => {
      state.fontFamily = b.dataset.font;
      localStorage.setItem('bibliotheca_font', state.fontFamily);
      applyTypography();
    });
  });

  elements.fontSizeSlider.addEventListener('input', (e) => {
    state.fontSize = parseInt(e.target.value, 10);
    localStorage.setItem('bibliotheca_size', state.fontSize);
    applyTypography();
  });

  document.querySelectorAll('#lineSpacingControl button').forEach(b => {
    b.addEventListener('click', () => {
      state.lineSpacing = parseFloat(b.dataset.spacing);
      localStorage.setItem('bibliotheca_spacing', state.lineSpacing);
      applyTypography();
    });
  });

  document.querySelectorAll('#readingWidthControl button').forEach(b => {
    b.addEventListener('click', () => {
      state.readingWidth = b.dataset.width;
      localStorage.setItem('bibliotheca_width', state.readingWidth);
      applyTypography();
    });
  });

  // Theme Modal & Switcher
  elements.themeToggleBtn.addEventListener('click', () => {
    elements.themeModal.classList.toggle('hidden');
    elements.ambientModal.classList.add('hidden');
    elements.typographyModal.classList.add('hidden');
  });
  elements.themeCloseBtn.addEventListener('click', () => elements.themeModal.classList.add('hidden'));

  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      applyTheme(card.dataset.theme);
      elements.themeModal.classList.add('hidden');
    });
  });

  // Scroll to Top
  elements.scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Start app
init();
