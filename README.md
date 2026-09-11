# 🏛️ Bibliotheca — Literature Explorer & Long-Form Reader

> An interactive, beautifully designed literary discovery engine and distraction-free reader powered by open-source literature databases (Project Gutenberg & Gutendex).

---

## ✨ Features

- **Massive Literary Catalog**: Draws from over 70,000 public-domain literary masterpieces across antiquity, the Renaissance, the Enlightenment, Victorian literature, and 20th-century modernism.
- **Calibrated 15–30 Minute Reads**: Automatically segments and extracts substantive chapters and sections (~3,000 to 6,000 words), complete with estimated reading times and word counts.
- **Rich Context & Metadata**: Every excerpt displays author biography, era, genre badges, historical synopsis, subject tags, and original chapter identifiers.
- **Get the Entire Book**: Direct one-click access to download full works in **EPUB** (Apple Books/Kobo/Android), **Kindle (MOBI/KF8)**, **Plain Text (.txt)**, read online on Project Gutenberg, or load the complete unabridged text directly inside the reader.
- **Bespoke Reading Themes**:
  - 📜 **Antique Parchment**: Warm cream and vintage ink tones
  - 🌙 **Midnight Slate**: Deep slate navy with soft contrast for night reading
  - ☕ **Vintage Sepia**: Aged paper and warm brown tones
  - 🌲 **Forest Emerald**: Calming dark green with gold accents
  - ☀️ **Clean Studio**: High-contrast crisp white paper
- **Distraction-Free Typography Controls**:
  - Switch between *EB Garamond*, *Merriweather*, *Playfair Display*, *Inter Sans*, and *JetBrains Mono*.
  - Font size slider (16px to 28px).
  - Line spacing (Compact, Normal, Spacious).
  - Column width adjuster (Focus 660px, Standard 780px, Wide 920px).
- **Procedural Ambient Soundscapes** (Zero audio dependencies, powered by the Web Audio API):
  - 🌧️ Gentle Rain on Window
  - 🔥 Warm Fireplace Crackle
  - 📚 Quiet Library Room Tone
  - 🍃 Forest Wind Breeze
- **Read Aloud (TTS)**: Web Speech narration with play/pause and rate controls.
- **Personal Library Drawer**: Bookmark memorable passages and view your recent reading history stored locally.
- **Keyboard Shortcuts**:
  - `R`: Roll and discover next random literature
  - `B`: Bookmark current literature excerpt
  - `T`: Cycle color themes

---

## 🛠️ Tech Architecture

- **Backend (`server.mjs`)**: Lightweight, zero-dependency Node.js HTTP server with caching and API endpoints.
- **Engine (`literature_engine.mjs`)**: Cleans Project Gutenberg boilerplates, parses chapter breaks, normalizes hard-wrapped line breaks, and measures word counts.
- **Frontend (`public/`)**: Modern vanilla JavaScript, CSS3 variables, and HTML5 with Web Audio synthesis and Web Speech APIs.
- **Local Cache (`.cache/`)**: Automatically stores downloaded book texts and metadata to enable instant, offline-capable re-reads.
