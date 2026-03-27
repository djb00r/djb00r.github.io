import {
  letters,
  letterCategories,
  TOTAL_POSITIONS,
  getCharAtPosition,
  getExtremeCharAtPosition,
  getPositionOfWord,
  ONE_LETTER_COUNTS,
  getCategoryForWord,
} from './letters.js';

// optional realtime room for online custom categories
let room = null;
if (window.WebsimSocket) {
  try {
    room = new WebsimSocket();
  } catch (e) {
    room = null;
  }
}

// removed Unicode letter collection, extended ranges, and EPSILON_POSITION definitions (moved to letters.js)

 // Finite default is the full combination space; when `infinitePositions` is true, there is no upper bound.
 let totalPositions = TOTAL_POSITIONS;
 let infinitePositions = true;                  // always infinite in normal mode
 let extremeMode = false;                       // toggle for Extreme Extension mode
 let position = 0n;

 // Easter egg positions (1-based)
 const EASTER_EGG_DISPLAY_POSITION = 911451745477886090943093245676185315488410607117988377n;
 const EASTER_EGG_REAL_SEARCH_POSITION = 70510229195388360858049319852866463497811860272152523804201578868621925753241640n;

 // configurable step and auto speed
let stepSize = 1n;          // how many letters to move each step
let autoInterval = 800;     // ms between auto steps

function currentIndex() {
  // removed dependency on local letters array; index now implicit via letters.js:getCharAtPosition()
  return 0; // unused placeholder; index calculation handled in letters.js
}

// removed EPSILON_POSITION and inline letter selection logic; see letters.js:getCharAtPosition()
 function getCurrentChar() {
  if (extremeMode) {
    // In extreme mode we ignore infinitePositions and use the full Unicode set
    return getExtremeCharAtPosition(position);
  }
  // pass whether we are in infinite mode so letters.js can grow length beyond 5
  return getCharAtPosition(position, { infinite: infinitePositions });
 }

const elLetter = document.getElementById('letter');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const btnPrev2 = document.getElementById('prev2');
const btnAutoNext = document.getElementById('auto-next');
const btnAutoBack = document.getElementById('auto-back');
const elIndicator = document.getElementById('indicator');
const elCopy = document.getElementById('copy');
const elExportSvg = document.getElementById('export-svg');
const elExport = document.getElementById('export-png');
const btnCursed = document.getElementById('cursed-btn');
const btnRandom = document.getElementById('random');
const btnExtreme = document.getElementById('extreme');
const btnInfo = document.getElementById('info-btn');
const btnQuiz = document.getElementById('quiz-btn');
const btnSettings = document.getElementById('settings-btn');
const btnCategory = document.getElementById('category-btn');
const btnDice = document.getElementById('dice-btn');
// admin panel elements
const speedInput = document.getElementById('speed-input');
const stepInput = document.getElementById('step-input');
const maxInput = document.getElementById('max-input');
const infToggle = document.getElementById('inf-toggle');
const teleportInput = document.getElementById('teleport-input');
const teleportBtn = document.getElementById('teleport-btn');
const findWordInput = document.getElementById('find-word-input');
const findWordBtn = document.getElementById('find-word-btn');
const appRoot = document.getElementById('app');

 // create a small character counter element near the indicator
const charCounter = document.createElement('span');
charCounter.id = 'char-counter';
charCounter.textContent = '';
if (elIndicator && elIndicator.parentElement) {
  elIndicator.parentElement.insertBefore(charCounter, elIndicator.nextSibling);
}

// category indicator element
const categoryIndicator = document.createElement('span');
categoryIndicator.id = 'category-indicator';
categoryIndicator.textContent = '';
if (charCounter && charCounter.parentElement) {
  charCounter.parentElement.insertBefore(categoryIndicator, charCounter.nextSibling);
}

let autoTimer = null;
let autoMode = null; // 'next' | 'back' | null

﻿// category labels for UI
const CATEGORY_LABELS = {
  standard: 'Standard English',
  math: 'Math alphabet',
  cyrillic: 'Cyrillic',
  emoji: 'Emojis / Symbols',
  family: 'Family emojis',
  japanese: 'Japanese',
  chinese: 'Chinese',
  korean: 'Korean',
  words: 'Other words',
  egyptian: 'Egyptian hieroglyphics',
  braille: 'Braille',
  hindi: 'Hindi (Devanagari)',
  arabic: 'Arabic',
  other: 'Other',
  private: 'Private Use',
  separateSymbols: 'Separate symbols',
};

 // active category filter for the modal (only affects jumps)
const savedCategoryJson = localStorage.getItem('activeCategories');
let activeCategories;
if (savedCategoryJson) {
  try {
    const arr = JSON.parse(savedCategoryJson);
    if (Array.isArray(arr) && arr.length) {
      activeCategories = new Set(arr);
    }
  } catch (e) {
    // ignore
  }
}
if (!activeCategories) {
  activeCategories = new Set(Object.keys(CATEGORY_LABELS));
}

// display settings state
let rainbowLetters =
  localStorage.getItem('rainbowLetters') === null
    ? true
    : localStorage.getItem('rainbowLetters') !== '0';
let fixedLetterColor =
  localStorage.getItem('fixedLetterColor') || '#ffffff';
let lightMode = localStorage.getItem('lightMode') === '1';
let fontChoice = localStorage.getItem('fontChoice') || 'catrinity';

 // cursed mode state
let cursed = false;
let cursedTimer = null;
let cursedSpeedFactor = 1;
// references for extra cursed speed buttons
const btnCursedFast = document.getElementById('cursed-fast-btn');
const btnCursedUltra = document.getElementById('cursed-ultra-btn');
const btnCursedSuper = document.getElementById('cursed-super-btn');
const btnCursedLight = document.getElementById('cursed-light-btn');
const btnCursedUniverse = document.getElementById('cursed-universe-btn');

// helpers for ultra/super cursed visuals
let ultraBackgroundContainer = null;
let universeBackgroundContainer = null;

function clearUltraBackground() {
  if (ultraBackgroundContainer && ultraBackgroundContainer.parentNode) {
    ultraBackgroundContainer.parentNode.removeChild(ultraBackgroundContainer);
  }
  ultraBackgroundContainer = null;
}

function clearUniverseBackground() {
  if (universeBackgroundContainer && universeBackgroundContainer.parentNode) {
    universeBackgroundContainer.parentNode.removeChild(universeBackgroundContainer);
  }
  universeBackgroundContainer = null;
}

function createUltraBackground() {
  clearUltraBackground();
  ultraBackgroundContainer = document.createElement('div');
  ultraBackgroundContainer.className = 'cursed-ultra-bg';
  const glyph = '𼤤';

  const count = 24;
  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.className = 'cursed-ultra-glyph';
    span.textContent = glyph;
    span.style.left = Math.random() * 100 + 'vw';
    span.style.top = Math.random() * 100 + 'vh';
    span.style.animationDelay = (Math.random() * -5).toFixed(2) + 's';
    span.style.animationDuration = (3 + Math.random() * 4).toFixed(2) + 's';
    ultraBackgroundContainer.appendChild(span);
  }
  document.body.appendChild(ultraBackgroundContainer);
}

function createUniverseBackground() {
  clearUniverseBackground();
  universeBackgroundContainer = document.createElement('div');
  universeBackgroundContainer.className = 'cursed-universe-bg';
  document.body.appendChild(universeBackgroundContainer);
}

function triggerSonicBoom() {
  const boom = document.createElement('div');
  boom.className = 'sonic-boom';
  document.body.appendChild(boom);
  // force reflow to restart animation
  void boom.offsetWidth;
  boom.classList.add('sonic-boom-active');
  setTimeout(() => {
    if (boom.parentNode) boom.parentNode.removeChild(boom);
  }, 600);
}

function stopAuto() {
  if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
  autoMode = null;
  if (btnAutoNext) btnAutoNext.classList.remove('active');
  if (btnAutoBack) btnAutoBack.classList.remove('active');
}

function moveNext() {
  if (extremeMode) {
    position = (position + stepSize) % totalPositions;
  } else {
    // Normal mode is always infinite now
    position = position + stepSize;
  }
  update();
}

function movePrev() {
  if (extremeMode) {
    position = (position - stepSize + totalPositions) % totalPositions;
  } else {
    // In infinite mode, clamp at the first position (no negatives)
    position = position - stepSize;
    if (position < 0n) position = 0n;
  }
  update();
}

function startAuto(mode) {
  if (autoMode === mode) {
    // toggle off if same mode pressed again
    stopAuto();
    return;
  }
  stopAuto();
  autoMode = mode;
  const step = () => {
    if (mode === 'next') {
      moveNext();
    } else if (mode === 'back') {
      movePrev();
    }
  };
  // immediate first step, then interval
  step();
  autoTimer = setInterval(step, autoInterval);
  if (mode === 'next') {
    btnAutoNext.classList.add('active');
    btnAutoBack.classList.remove('active');
  } else {
    btnAutoBack.classList.add('active');
    btnAutoNext.classList.remove('active');
  }
}

function randomColor() {
  // pick a pleasant saturated color using HSL
  const h = Math.floor(Math.random() * 360);
  const s = 60 + Math.floor(Math.random() * 20); // 60-80%
  const l = 40 + Math.floor(Math.random() * 20); // 40-60%
  return `hsl(${h} ${s}% ${l}%)`;
}

function randomDarkColor() {
  const h = Math.floor(Math.random() * 360);
  const s = 50 + Math.floor(Math.random() * 30);
  const l = 10 + Math.floor(Math.random() * 20);
  return `hsl(${h} ${s}% ${l}%)`;
}

// Generate a uniform random BigInt in the range [0, maxExclusive)
function randomBigIntBelow(maxExclusive) {
  if (maxExclusive <= 0n) return 0n;
  const bitLength = maxExclusive.toString(2).length;
  const byteLength = Math.ceil(bitLength / 8);
  const bytes = new Uint8Array(byteLength);

  while (true) {
    crypto.getRandomValues(bytes);
    let value = 0n;
    for (let i = 0; i < byteLength; i++) {
      value = (value << 8n) + BigInt(bytes[i]);
    }
    if (value < maxExclusive) {
      return value;
    }
  }
}

const letterErrorModal = document.getElementById('letter-error-modal');
const letterErrorOkBtn = document.getElementById('letter-error-ok-btn');

// Emoji support warning modal
const emojiWarningModal = document.getElementById('emoji-warning-modal');
const emojiWarningOkBtn = document.getElementById('emoji-warning-ok-btn');

function resetToFirstLetter() {
  // Reset position and modes back to starting point (A at position 1)
  position = 0n;
  extremeMode = false;
  infinitePositions = true;
  if (infToggle) infToggle.classList.add('active');
  if (maxInput) maxInput.value = 'inf';
}

function showLetterErrorModal() {
  resetToFirstLetter();
  // Re-render safely at position 1
  try {
    // ensure indicator reflects reset before showing modal
    elIndicator.textContent = !extremeMode
      ? `${(position + 1n).toString()} / ₯`
      : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
    const safeChar = getCurrentChar();
    elLetter.textContent = safeChar;
  } catch (e) {
    // As an absolute fallback, force plain A
    elLetter.textContent = 'A';
  }
  if (letterErrorModal) {
    letterErrorModal.hidden = false;
  }
}

if (letterErrorOkBtn && letterErrorModal) {
  letterErrorOkBtn.addEventListener('click', () => {
    letterErrorModal.hidden = true;
  });
}

function update() {
  // removed fade animation; update instantly
  let baseChar;
  try {
    baseChar = getCurrentChar();
  } catch (e) {
    showLetterErrorModal();
    return;
  }

  // Easter egg: show fake "What did you say?" at the special display position only
  const posPlusOne = position + 1n;
  const displayChar =
    !extremeMode && posPlusOne === EASTER_EGG_DISPLAY_POSITION
      ? 'What did you say?'
      : baseChar;

  elLetter.textContent = displayChar;

  // scale font size down for very long sequences so controls remain visible,
  // and enable scrolling when extremely long
  const length = Array.from(displayChar).length;
  if (length > 80) {
    elLetter.style.fontSize = '8vh';
    if (appRoot) appRoot.style.position = 'static';
    document.body.style.overflowY = 'auto';
  } else if (length > 40) {
    elLetter.style.fontSize = '10vh';
    if (appRoot) appRoot.style.position = 'fixed';
    document.body.style.overflowY = 'hidden';
  } else if (length > 20) {
    elLetter.style.fontSize = '14vh';
    if (appRoot) appRoot.style.position = 'fixed';
    document.body.style.overflowY = 'hidden';
  } else {
    elLetter.style.fontSize = '24vh';
    if (appRoot) appRoot.style.position = 'fixed';
    document.body.style.overflowY = 'hidden';
  }

  // update character counter and category
  const categoryKey = getCategoryForWord(displayChar);
  const categoryLabel = CATEGORY_LABELS[categoryKey] || 'Other';

  if (charCounter) {
    charCounter.textContent = `· ${length} chars`;
  }
  if (categoryIndicator) {
    categoryIndicator.textContent = `· ${categoryLabel}`;
  }

  // assign color per letter display based on settings
  let col = rainbowLetters ? randomColor() : fixedLetterColor;

  // Easter egg: force red color for the fake "What did you say?" display
  if (!extremeMode && posPlusOne === EASTER_EGG_DISPLAY_POSITION) {
    col = '#ff3333';
  }

  elLetter.style.color = col;
  // store current color for export use
  elLetter.dataset.color = col;
  elIndicator.textContent = !extremeMode
    ? `${(position + 1n).toString()} / ₯`
    : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
}

btnPrev.addEventListener('click', () => {
  stopAuto();
  movePrev();
});

if (btnPrev2) {
  btnPrev2.addEventListener('click', () => {
    stopAuto();
    movePrev();
  });
}

btnNext.addEventListener('click', () => {
  stopAuto();
  moveNext();
});

btnAutoNext.addEventListener('click', () => {
  startAuto('next');
});

btnAutoBack.addEventListener('click', () => {
  startAuto('back');
});

// keyboard navigation
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    btnPrev.click();
  } else if (e.key === 'ArrowRight') {
    btnNext.click();
  }
});

// quick tap/swipe support for mobile (simple)
let startX = null;
window.addEventListener(
  'touchstart',
  (e) => {
    if (e.touches && e.touches[0]) startX = e.touches[0].clientX;
  },
  { passive: true }
);

window.addEventListener(
  'touchend',
  (e) => {
    if (startX == null || !e.changedTouches || !e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 30) {
      if (dx > 0) btnPrev.click();
      else btnNext.click();
    }
    startX = null;
  },
  { passive: true }
);

 // init
 // normal mode starts in infinite state
 if (maxInput) {
   maxInput.value = 'inf';
 }
 if (lightMode) {
   document.body.classList.add('light-mode');
 }

 // apply initial font choice to body class
 function applyFontChoice(choice) {
   document.body.classList.remove('font-catrinity', 'font-arial', 'font-noto');
   if (choice === 'arial') {
     document.body.classList.add('font-arial');
   } else if (choice === 'noto') {
     document.body.classList.add('font-noto');
   } else {
     document.body.classList.add('font-catrinity');
   }
 }

 applyFontChoice(fontChoice);
 elIndicator.textContent = !extremeMode
   ? `${(position + 1n).toString()} / ₯`
   : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
 if (infToggle) {
   infToggle.classList.add('active');
 }

 // set initial letter, color, and size using the main update() logic
 update();

 //// Epilepsy warning modal state
const epilepsyModal = document.getElementById('epilepsy-modal');
const epilepsyStartBtn = document.getElementById('epilepsy-start-btn');
const epilepsyCloseBtn = document.getElementById('epilepsy-close-btn');
const epilepsyNoShowCheckbox = document.getElementById('epilepsy-noshow-checkbox');

// track whether the user has already accepted the epilepsy warning
let epilepsyAccepted = localStorage.getItem('epilepsyAccepted') === '1';
// store the requested cursed speed factor while the modal is open
let pendingCursedSpeedFactor = null;

 // Settings modal elements
const settingsModal = document.getElementById('settings-modal');
const settingsRainbowCheckbox = document.getElementById('settings-rainbow-checkbox');
const settingsColorInput = document.getElementById('settings-color-input');
const settingsLightmodeCheckbox = document.getElementById('settings-lightmode-checkbox');
const settingsFontSelect = document.getElementById('settings-font-select');
const settingsCloseBtn = document.getElementById('settings-close-btn');

// sync settings UI with current state
function syncSettingsUI() {
  if (!settingsModal) return;
  if (settingsRainbowCheckbox) {
    settingsRainbowCheckbox.checked = rainbowLetters;
  }
  if (settingsColorInput) {
    settingsColorInput.value = fixedLetterColor;
  }
  if (settingsLightmodeCheckbox) {
    settingsLightmodeCheckbox.checked = lightMode;
  }
  if (settingsFontSelect) {
    settingsFontSelect.value = fontChoice;
  }
}

// apply settings to UI immediately
function applyDisplaySettings() {
  // light mode
  if (lightMode) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }
  // font
  applyFontChoice(fontChoice);
  // re-render current letter color
  update();
}

// open / close settings modal
if (btnSettings && settingsModal) {
  btnSettings.addEventListener('click', () => {
    syncSettingsUI();
    settingsModal.hidden = false;
  });
}

if (settingsCloseBtn && settingsModal) {
  settingsCloseBtn.addEventListener('click', () => {
    settingsModal.hidden = true;
  });
}

// settings change listeners
if (settingsRainbowCheckbox) {
  settingsRainbowCheckbox.addEventListener('change', () => {
    rainbowLetters = settingsRainbowCheckbox.checked;
    localStorage.setItem('rainbowLetters', rainbowLetters ? '1' : '0');
    applyDisplaySettings();
  });
}

if (settingsColorInput) {
  settingsColorInput.addEventListener('input', () => {
    fixedLetterColor = settingsColorInput.value || '#ffffff';
    localStorage.setItem('fixedLetterColor', fixedLetterColor);
    applyDisplaySettings();
  });
}

if (settingsLightmodeCheckbox) {
  settingsLightmodeCheckbox.addEventListener('change', () => {
    lightMode = settingsLightmodeCheckbox.checked;
    localStorage.setItem('lightMode', lightMode ? '1' : '0');
    applyDisplaySettings();
  });
}

if (settingsFontSelect) {
  settingsFontSelect.addEventListener('change', () => {
    fontChoice = settingsFontSelect.value || 'catrinity';
    localStorage.setItem('fontChoice', fontChoice);
    applyDisplaySettings();
  });
}

 // Category modal elements
const categoryModal = document.getElementById('category-modal');
const categoryCloseBtn = document.getElementById('category-close-btn');
const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
const categoryJumpButtons = document.querySelectorAll('.category-jump-btn');
const categorySelectAllBtn = document.getElementById('category-select-all-btn');
const categoryDeselectAllBtn = document.getElementById('category-deselect-all-btn');
const categorySaveBtn = document.getElementById('category-save-btn');
const categoryAddCustomBtn = document.getElementById('category-add-custom-btn');

// Custom category modal elements
const customCategoryModal = document.getElementById('custom-category-modal');
const customCatNameInput = document.getElementById('customcat-name-input');
const customCatPositionInput = document.getElementById('customcat-position-input');
const customCatBlocksInput = document.getElementById('customcat-blocks-input');
const customCatCharsInput = document.getElementById('customcat-chars-input');
const customCatSaveBtn = document.getElementById('customcat-save-btn');
const customCatUploadBtn = document.getElementById('customcat-upload-btn');
const customCatCancelBtn = document.getElementById('customcat-cancel-btn');

// Custom categories DB modal elements
const customDbBtn = document.getElementById('custom-db-btn');
const customDbModal = document.getElementById('custom-db-modal');
const customDbListEl = document.getElementById('customdb-list');
const customDbPrevBtn = document.getElementById('customdb-prev-page');
const customDbNextBtn = document.getElementById('customdb-next-page');
const customDbPageIndicator = document.getElementById('customdb-page-indicator');
const customDbRefreshBtn = document.getElementById('customdb-refresh-btn');
const customDbCloseBtn = document.getElementById('customdb-close-btn');

/* Quiz modal elements */
const quizModal = document.getElementById('quiz-modal');

/* Dice modal elements */
const diceModal = document.getElementById('dice-modal');
const diceBeforeWordInput = document.getElementById('dice-before-word-input');
const diceBeforeRunBtn = document.getElementById('dice-before-run-btn');
const diceRangeStartInput = document.getElementById('dice-range-start-input');
const diceRangeEndInput = document.getElementById('dice-range-end-input');
const diceRangeRunBtn = document.getElementById('dice-range-run-btn');
const diceErrorEl = document.getElementById('dice-error');
const diceCloseBtn = document.getElementById('dice-close-btn');
const quizMuteCheckbox = document.getElementById('quiz-mute-checkbox');
const quizCountInput = document.getElementById('quiz-count-input');
const quizDifficultySelect = document.getElementById('quiz-difficulty-select');
const quizModeSelect = document.getElementById('quiz-mode-select');
const quizUseLivesCheckbox = document.getElementById('quiz-use-lives-checkbox');
const quizLivesInput = document.getElementById('quiz-lives-input');
const quizLetterDisplay = document.getElementById('quiz-letter-display');
const quizQuestionText = document.getElementById('quiz-question-text');
const quizAnswerInput = document.getElementById('quiz-answer-input');
const quizFeedback = document.getElementById('quiz-feedback');
const quizProgress = document.getElementById('quiz-progress');
const quizCurrentWrapper = document.getElementById('quiz-current-wrapper');
const quizInputWrapper = document.getElementById('quiz-input-wrapper');
const quizOptionsWrapper = document.getElementById('quiz-options-wrapper');
const quizOptionButtons = document.querySelectorAll('.quiz-option-btn');
const quizStartBtn = document.getElementById('quiz-start-btn');
const quizSubmitBtn = document.getElementById('quiz-submit-btn');
const quizCloseBtn = document.getElementById('quiz-close-btn');
const quizLivesDisplay = document.getElementById('quiz-lives-display');
const quizHighscoreDisplay = document.getElementById('quiz-highscore-display');
const quizDescription = document.getElementById('quiz-description');

// Meta UI for lives and high score
function updateQuizMetaUI() {
  // Lives hearts
  if (quizLivesDisplay) {
    if (quizCurrentLives == null) {
      quizLivesDisplay.textContent = '';
    } else {
      const hearts = '❤'.repeat(quizCurrentLives);
      quizLivesDisplay.textContent = hearts;
    }
  }
  // Endless high score
  if (quizHighscoreDisplay) {
    if (quizGameMode === 'endless') {
      quizHighscoreDisplay.textContent = `High score: ${quizHighscoreEndless}`;
    } else {
      quizHighscoreDisplay.textContent = '';
    }
  }
}

/* Quiz state */
let quizAudio = null;
let quizActive = false;
// quizDifficulty: what you are asked (name/category/position/choice)
let quizDifficulty = 'name'; // 'name' | 'category' | 'position' | 'choice'
// quizGameMode: how long it runs (limited vs endless)
let quizGameMode = 'limited'; // 'limited' | 'endless'
let quizUseLives = false;
let quizCurrentLives = null;
let quizTotalQuestions = 0;
let quizCurrentIndex = 0;
let quizScore = 0;
let quizCurrentLetter = null;
let quizCurrentCorrectAnswer = null;
// Track how many lives have been lost in the current run
let quizTotalLivesLost = 0;
// Endless-mode high score (persisted)
let quizHighscoreEndless = parseInt(localStorage.getItem('quizEndlessHighscore') || '0', 10) || 0;
// Secret flag: always use blue "203 THROW" life loss animation
let quizAlways203Throw = localStorage.getItem('quizAlways203Throw') === '1';

// Pool of single‑symbol letters (no multi-character "AA" etc., emojis included)
const SINGLE_LETTER_POOL = letters
  .map((ch, idx) => ({ ch, idx }))
  .filter((entry) => Array.from(entry.ch).length === 1);

 // Start quiz / generate questions
function chooseRandomSingleLetter() {
  if (!SINGLE_LETTER_POOL.length) return null;
  const idx = Math.floor(Math.random() * SINGLE_LETTER_POOL.length);
  return SINGLE_LETTER_POOL[idx];
}

function formatCategoryAnswer(catKey) {
  return (CATEGORY_LABELS[catKey] || catKey || 'Other').toLowerCase();
}

function startQuiz() {
  const rawCount = quizCountInput ? parseInt(quizCountInput.value, 10) : 10;
  let count = Number.isNaN(rawCount) ? 10 : rawCount;
  if (count < 1) count = 1;
  if (count > 50) count = 50;
  quizTotalQuestions = count;

  quizDifficulty = quizDifficultySelect ? quizDifficultySelect.value : 'name';
  if (!['name', 'category', 'position', 'choice'].includes(quizDifficulty)) {
    quizDifficulty = 'name';
  }

  quizGameMode = quizModeSelect ? quizModeSelect.value : 'limited';
  if (!['limited', 'endless'].includes(quizGameMode)) {
    quizGameMode = 'limited';
  }

  // Lives setup
  if (quizGameMode === 'endless') {
    quizUseLives = true;
    quizCurrentLives = 3;
  } else {
    quizUseLives = !!(quizUseLivesCheckbox && quizUseLivesCheckbox.checked);
    if (quizUseLives) {
      const livesRaw = quizLivesInput ? parseInt(quizLivesInput.value, 10) : 3;
      let lives = Number.isNaN(livesRaw) ? 3 : livesRaw;
      if (lives < 1) lives = 1;
      if (lives > 99) lives = 99;
      quizCurrentLives = lives;
    } else {
      quizCurrentLives = null;
    }
  }

  quizActive = true;
  quizCurrentIndex = 0;
  quizScore = 0;
  quizFeedback.textContent = '';
  quizProgress.textContent = '';
  quizCurrentWrapper.hidden = false;

  updateQuizMetaUI();

  // enable/disable input vs multiple-choice controls
  if (quizDifficulty === 'choice') {
    if (quizInputWrapper) quizInputWrapper.hidden = true;
    if (quizOptionsWrapper) quizOptionsWrapper.hidden = false;
    if (quizSubmitBtn) quizSubmitBtn.disabled = true;
  } else {
    if (quizInputWrapper) quizInputWrapper.hidden = false;
    if (quizOptionsWrapper) quizOptionsWrapper.hidden = true;
    if (quizSubmitBtn) quizSubmitBtn.disabled = false;
  }

  nextQuizQuestion();
}

function nextQuizQuestion() {
  if (!quizActive) return;

  // Limited mode: stop when we reach the configured question count
  if (quizGameMode === 'limited' && quizCurrentIndex >= quizTotalQuestions) {
    quizFeedback.textContent = `Done! You scored ${quizScore} / ${quizTotalQuestions}.`;
    quizProgress.textContent = '';
    quizCurrentWrapper.hidden = true;
    if (quizSubmitBtn) quizSubmitBtn.disabled = true;
    return;
  }

  const entry = chooseRandomSingleLetter();
  if (!entry) {
    quizFeedback.textContent = 'No single-letter data available.';
    quizCurrentWrapper.hidden = true;
    if (quizSubmitBtn) quizSubmitBtn.disabled = true;
    quizActive = false;
    return;
  }

  quizCurrentLetter = entry;
  const ch = entry.ch;
  // Default: plain text, no zoom wrapper
  quizLetterDisplay.classList.remove('zoomed');
  quizLetterDisplay.textContent = ch;

  // keep UI lives up to date
  updateQuizMetaUI();

  // reset option buttons each question
  if (quizOptionsWrapper) {
    quizOptionButtons.forEach((btn) => {
      btn.classList.remove('correct', 'incorrect');
      btn.disabled = false;
      btn.textContent = '';
    });
  }

  // build the correct answer depending on quiz mode
  if (quizDifficulty === 'category') {
    const catKey = letterCategories[entry.idx] || 'other';
    quizCurrentCorrectAnswer = formatCategoryAnswer(catKey);
    quizQuestionText.textContent = 'What category is this letter in?';
    quizLetterDisplay.style.fontSize = '8vh';
  } else if (quizDifficulty === 'position') {
    const pos = getPositionOfWord(ch);
    quizCurrentCorrectAnswer = pos != null ? (pos + 1n).toString() : '';
    quizQuestionText.textContent = 'What position number is this letter? (hard)';
    quizLetterDisplay.style.fontSize = '8vh';
  } else if (quizDifficulty === 'choice') {
    // Multiple-choice zoomed difficulty
    quizCurrentCorrectAnswer = ch;
    quizQuestionText.textContent = 'Which option matches this zoomed letter?';

    // Show only a small cropped area of the letter (about 25% of its normal view)
    quizLetterDisplay.classList.add('zoomed');
    quizLetterDisplay.innerHTML = `<span class="quiz-letter-inner">${ch}</span>`;

    // ensure choice UI visible and input hidden
    if (quizInputWrapper) quizInputWrapper.hidden = true;
    if (quizOptionsWrapper) quizOptionsWrapper.hidden = false;
    if (quizSubmitBtn) quizSubmitBtn.disabled = true;

    // generate 3 distinct wrong options
    const options = new Set();
    options.add(ch);
    while (options.size < 4 && SINGLE_LETTER_POOL.length > options.size) {
      const alt = chooseRandomSingleLetter().ch;
      if (!options.has(alt)) options.add(alt);
    }
    const optionArray = Array.from(options);
    // shuffle
    for (let i = optionArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [optionArray[i], optionArray[j]] = [optionArray[j], optionArray[i]];
    }

    // assign to buttons
    quizOptionButtons.forEach((btn, idx) => {
      const val = optionArray[idx] ?? '';
      btn.textContent = val;
      btn.dataset.value = val;
    });
  } else {
    // letter name mode: must match exactly
    quizCurrentCorrectAnswer = ch;
    quizQuestionText.textContent = 'Type this single letter exactly.';
    quizLetterDisplay.style.fontSize = '8vh';
  }

  if (quizDifficulty !== 'choice') {
    if (quizAnswerInput) {
      quizAnswerInput.value = '';
      quizAnswerInput.focus();
    }
  }

  if (quizGameMode === 'endless') {
    quizProgress.textContent = `Q: ${quizCurrentIndex + 1} · Score: ${quizScore}`;
  } else {
    quizProgress.textContent = `Question ${quizCurrentIndex + 1} of ${quizTotalQuestions}`;
  }
  quizFeedback.textContent = '';
}

function handleQuizResult(isCorrect) {
  if (isCorrect) {
    quizScore += 1;
    quizFeedback.textContent = 'Correct!';
  } else {
    quizFeedback.textContent = `Wrong. Correct answer: ${quizCurrentCorrectAnswer}`;
    if (quizCurrentLives != null) {
      quizCurrentLives -= 1;
      if (quizLivesDisplay) {
        // trigger heart loss animation
        quizLivesDisplay.classList.remove('quiz-lives-lost');
        void quizLivesDisplay.offsetWidth;
        // 1 in 203 chance for the "203 THROW" easter-egg animation text
        if (Math.floor(Math.random() * 203) === 0) {
          quizLivesDisplay.textContent = '203 THROW';
          quizLivesDisplay.classList.add('quiz-lives-lost');
          setTimeout(() => {
            updateQuizMetaUI();
          }, 400);
        } else {
          quizLivesDisplay.classList.add('quiz-lives-lost');
        }
      }
      if (quizCurrentLives <= 0) {
        // Game over
        quizActive = false;
        if (quizGameMode === 'endless') {
          if (quizScore > quizHighscoreEndless) {
            quizHighscoreEndless = quizScore;
            localStorage.setItem('quizEndlessHighscore', String(quizHighscoreEndless));
          }
          quizFeedback.textContent = `Game over! Endless score: ${quizScore}`;
        } else {
          quizFeedback.textContent = `Game over! You scored ${quizScore} / ${quizTotalQuestions}.`;
        }
        quizCurrentWrapper.hidden = true;
        if (quizSubmitBtn) quizSubmitBtn.disabled = true;
        updateQuizMetaUI();
        return;
      }
    }
  }

  quizCurrentIndex += 1;
  updateQuizMetaUI();

  setTimeout(() => {
    quizFeedback.textContent = '';
    nextQuizQuestion();
  }, 900);
}

function submitQuizAnswer() {
  if (!quizActive || !quizCurrentLetter || quizDifficulty === 'choice') return;
  const raw = (quizAnswerInput?.value || '').trim();

  let isCorrect = false;

  if (quizDifficulty === 'category') {
    const user = raw.toLowerCase();
    const correct = quizCurrentCorrectAnswer;
    // allow answering with either category key or label
    const catKey = letterCategories[quizCurrentLetter.idx] || 'other';
    const alt1 = (CATEGORY_LABELS[catKey] || '').toLowerCase();
    const alt2 = catKey.toLowerCase();
    if (user === correct || user === alt1 || user === alt2) {
      isCorrect = true;
    }
  } else if (quizDifficulty === 'position') {
    // numeric comparison
    const user = raw.replace(/[, ]+/g, '');
    if (quizCurrentCorrectAnswer && user === quizCurrentCorrectAnswer) {
      isCorrect = true;
    }
  } else if (quizDifficulty === 'choice') {
    // (handled via button handlers)
  } else {
    // letter name mode: must match exactly
    if (raw === quizCurrentCorrectAnswer) {
      isCorrect = true;
    }
  }

  handleQuizResult(isCorrect);
}

if (quizStartBtn) {
  quizStartBtn.addEventListener('click', () => {
    startQuiz();
  });
}

if (quizSubmitBtn) {
  quizSubmitBtn.addEventListener('click', () => {
    submitQuizAnswer();
  });
}

if (quizAnswerInput) {
  quizAnswerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitQuizAnswer();
    }
  });
}

// Multiple-choice handlers
if (quizOptionButtons && quizOptionButtons.length) {
  quizOptionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!quizActive || quizDifficulty !== 'choice' || !quizCurrentLetter) return;
      const chosen = btn.dataset.value || '';
      const correct = quizCurrentCorrectAnswer || '';

      // reveal zoomed letter by shrinking back to normal and uncropping
      quizLetterDisplay.classList.remove('zoomed');
      quizLetterDisplay.textContent = quizCurrentCorrectAnswer || '';
      quizLetterDisplay.style.fontSize = '8vh';

      // mark buttons
      quizOptionButtons.forEach((b) => {
        const val = b.dataset.value || '';
        if (val === correct) {
          b.classList.add('correct');
        }
        if (b === btn && val !== correct) {
          b.classList.add('incorrect');
        }
        b.disabled = true;
      });

      const isCorrect = chosen === correct;
      handleQuizResult(isCorrect);
    });
  });
}

if (btnQuiz && quizModal) {
  btnQuiz.addEventListener('click', () => {
    openQuizModal();
    updateQuizMetaUI();
  });
}

if (quizCloseBtn && quizModal) {
  quizCloseBtn.addEventListener('click', () => {
    closeQuizModal();
  });
}

if (quizMuteCheckbox) {
  quizMuteCheckbox.addEventListener('change', () => {
    const audio = ensureQuizAudio();
    audio.muted = quizMuteCheckbox.checked;
  });
}

if (quizDifficultySelect) {
  quizDifficultySelect.addEventListener('change', updateQuizDescription);
}

if (quizModeSelect) {
  quizModeSelect.addEventListener('change', updateQuizDescription);
}

// initialize description once
updateQuizDescription();

function updateQuizDescription() {
  if (!quizDescription) return;
  const diff = quizDifficultySelect ? quizDifficultySelect.value : 'name';
  const mode = quizModeSelect ? quizModeSelect.value : 'limited';
  let text = '';

  if (diff === 'name') {
    text = 'Type the exact single letter you see. No multi-character words like "AA".';
  } else if (diff === 'category') {
    text = 'Guess which category the single letter belongs to (emoji, standard, etc.).';
  } else if (diff === 'position') {
    text = 'Hard mode: answer with the exact position number of that single letter.';
  } else if (diff === 'choice') {
    text = 'Zoomed in letter: pick the matching one from 4 options. No typing needed.';
  }

  if (mode === 'endless') {
    text += ' Endless mode: 3 lives and your run ends when you lose them.';
  }

  quizDescription.textContent = text;
}

function openQuizModal() {
  if (!quizModal) return;
  quizModal.hidden = false;
  // show description / hide question area until Start is pressed
  quizActive = false;
  if (quizCurrentWrapper) quizCurrentWrapper.hidden = true;
  if (quizSubmitBtn) quizSubmitBtn.disabled = true;
  if (quizInputWrapper) quizInputWrapper.hidden = true;
  if (quizOptionsWrapper) quizOptionsWrapper.hidden = true;
  if (quizFeedback) quizFeedback.textContent = '';
  if (quizProgress) quizProgress.textContent = '';
  if (quizLetterDisplay) quizLetterDisplay.textContent = '';
  if (quizQuestionText) quizQuestionText.textContent = '';
  updateQuizDescription();
  startQuizAudio();
}

function closeQuizModal() {
  if (!quizModal) return;
  quizModal.hidden = true;
  quizActive = false;
  stopQuizAudio();
}

/* Quiz audio helpers */
function ensureQuizAudio() {
  if (!quizAudio) {
    quizAudio = new Audio('/Run now.wav');
    quizAudio.loop = true;
  }
  return quizAudio;
}

function startQuizAudio() {
  const audio = ensureQuizAudio();
  audio.muted = quizMuteCheckbox ? quizMuteCheckbox.checked : false;
  audio.currentTime = 0;
  audio
    .play()
    .catch(() => {
      // ignore autoplay errors; user can toggle mute to retry
    });
}

function stopQuizAudio() {
  if (quizAudio) {
    quizAudio.pause();
  }
}

/* Dice modal behaviour */
function openDiceModal() {
  if (!diceModal) return;
  if (diceErrorEl) diceErrorEl.textContent = '';
  if (diceBeforeWordInput) diceBeforeWordInput.value = '';
  if (diceRangeStartInput) diceRangeStartInput.value = '';
  if (diceRangeEndInput) diceRangeEndInput.value = '';
  diceModal.hidden = false;
}

function closeDiceModal() {
  if (!diceModal) return;
  diceModal.hidden = true;
}

function setDiceError(msg) {
  if (!diceErrorEl) return;
  diceErrorEl.textContent = msg || '';
  if (msg) {
    setTimeout(() => {
      if (diceErrorEl.textContent === msg) {
        diceErrorEl.textContent = '';
      }
    }, 1600);
  }
}

if (btnDice && diceModal) {
  btnDice.addEventListener('click', () => {
    openDiceModal();
  });
}

if (diceCloseBtn && diceModal) {
  diceCloseBtn.addEventListener('click', () => {
    closeDiceModal();
  });
}

if (diceBeforeRunBtn && diceBeforeWordInput) {
  const runBefore = () => {
    const word = diceBeforeWordInput.value || '';
    if (!word) {
      setDiceError('Type a letter or word first.');
      return;
    }
    if (word.length > 5000) {
      closeDiceModal();
      showLetterErrorModal();
      return;
    }
    const idx = getPositionOfWord(word);
    if (idx === null) {
      setDiceError('Could not find that letter/word.');
      return;
    }
    const maxExclusive = idx + 1n; // include that letter
    if (maxExclusive <= 0n) {
      setDiceError('Range is empty.');
      return;
    }
    const randIdx = randomBigIntBelow(maxExclusive);
    position = randIdx;
    stopAuto();
    update();
    closeDiceModal();
  };
  diceBeforeRunBtn.addEventListener('click', runBefore);
  diceBeforeWordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runBefore();
    }
  });
}

if (diceRangeRunBtn && diceRangeStartInput && diceRangeEndInput) {
  const runRange = () => {
    const rawStart = diceRangeStartInput.value.trim();
    const rawEnd = diceRangeEndInput.value.trim();
    if (!rawStart || !rawEnd) {
      setDiceError('Enter both start and end.');
      return;
    }
    let start, end;
    try {
      start = BigInt(rawStart);
      end = BigInt(rawEnd);
    } catch (e) {
      setDiceError('Positions must be numbers.');
      return;
    }
    if (start < 1n && end < 1n) {
      setDiceError('Positions must be ≥ 1.');
      return;
    }
    if (start < 1n) start = 1n;
    if (end < 1n) end = 1n;
    if (end < start) {
      const tmp = start;
      start = end;
      end = tmp;
    }
    const startIdx = start - 1n;
    const endIdx = end - 1n;
    const count = endIdx - startIdx + 1n;
    if (count <= 0n) {
      setDiceError('Range is empty.');
      return;
    }
    const offset = randomBigIntBelow(count);
    position = startIdx + offset;
    stopAuto();
    update();
    closeDiceModal();
  };
  diceRangeRunBtn.addEventListener('click', runRange);
  diceRangeEndInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runRange();
    }
  });
}

// open/close category modal
if (btnCategory && categoryModal) {
  btnCategory.addEventListener('click', () => {
    categoryModal.hidden = false;
  });
}

if (categoryCloseBtn && categoryModal) {
  categoryCloseBtn.addEventListener('click', () => {
    categoryModal.hidden = true;
  });
}

let customDbPage = 0;
const CUSTOM_DB_PAGE_SIZE = 5;
let customDbItems = [];

// build combined list (online + local)
async function fetchOnlineCustomCategories() {
  if (!room) return [];
  const records = room.collection('customCategory_v1').getList();
  return records || [];
}

async function refreshCustomDbList() {
  const local = loadLocalCustomCategories().map((c) => ({
    id: 'local:' + c.id,
    name: c.name,
    chars: c.chars.join(''),
    blocks: c.blocks,
    position: c.position,
    source: 'local',
    created_at: c.created_at,
  }));
  let online = [];
  if (room) {
    try {
      online = await fetchOnlineCustomCategories().then((list) =>
        list.map((r) => ({
          id: r.id,
          name: r.name || 'Untitled',
          chars: r.chars || '',
          blocks: r.blocks || '',
          position: r.position ?? null,
          source: 'online',
          created_at: r.created_at,
        }))
      );
    } catch (e) {
      online = [];
    }
  }
  // newest first
  customDbItems = [...online, ...local].sort((a, b) => {
    const ta = a.created_at || '';
    const tb = b.created_at || '';
    return ta < tb ? 1 : ta > tb ? -1 : 0;
  });
  customDbPage = 0;
  renderCustomDbPage();
}

function renderCustomDbPage() {
  if (!customDbListEl) return;
  customDbListEl.innerHTML = '';
  if (!customDbItems.length) {
    const empty = document.createElement('div');
    empty.textContent = 'No custom categories yet.';
    empty.style.fontSize = '0.8rem';
    empty.style.color = '#aaa';
    customDbListEl.appendChild(empty);
    if (customDbPageIndicator) customDbPageIndicator.textContent = '0 / 0';
    return;
  }
  const totalPages = Math.ceil(customDbItems.length / CUSTOM_DB_PAGE_SIZE);
  if (customDbPage < 0) customDbPage = 0;
  if (customDbPage >= totalPages) customDbPage = totalPages - 1;

  const start = customDbPage * CUSTOM_DB_PAGE_SIZE;
  const slice = customDbItems.slice(start, start + CUSTOM_DB_PAGE_SIZE);

  slice.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'customdb-item';

    const header = document.createElement('div');
    header.className = 'customdb-item-header';

    const nameEl = document.createElement('div');
    nameEl.className = 'customdb-item-name';
    nameEl.textContent = item.name;

    const meta = document.createElement('div');
    meta.className = 'customdb-item-meta';
    meta.textContent = item.source === 'online' ? 'Online' : 'Local';

    header.appendChild(nameEl);
    header.appendChild(meta);

    const preview = document.createElement('div');
    preview.className = 'customdb-item-preview';
    const charsPreview = Array.from(item.chars || '').slice(0, 24).join('');
    preview.textContent = charsPreview || '(no characters)';

    const actions = document.createElement('div');
    actions.className = 'customdb-item-actions';

    const loadBtn = document.createElement('button');
    loadBtn.type = 'button';
    loadBtn.textContent = 'Load';
    loadBtn.addEventListener('click', () => {
      if (customCatNameInput) customCatNameInput.value = item.name;
      if (customCatBlocksInput) customCatBlocksInput.value = item.blocks || '';
      if (customCatPositionInput)
        customCatPositionInput.value =
          item.position != null ? String(item.position) : '';
      if (customCatCharsInput) customCatCharsInput.value = item.chars || '';
      if (customCategoryModal) customCategoryModal.hidden = false;
    });

    const jumpBtn = document.createElement('button');
    jumpBtn.type = 'button';
    jumpBtn.textContent = 'Jump';
    jumpBtn.addEventListener('click', () => {
      if (item.position && !Number.isNaN(item.position)) {
        try {
          let target = BigInt(item.position);
          if (target < 1n) target = 1n;
          position = target - 1n;
          stopAuto();
          update();
        } catch (e) {
          // ignore bad position
        }
      } else if (item.chars && item.chars.length) {
        // try to find position of first character sequence
        const firstChar = Array.from(item.chars)[0];
        const idx = getPositionOfWord(firstChar);
        if (idx != null) {
          position = idx;
          stopAuto();
          update();
        }
      }
      if (customDbModal) customDbModal.hidden = true;
    });

    actions.appendChild(loadBtn);
    actions.appendChild(jumpBtn);

    row.appendChild(header);
    row.appendChild(preview);
    row.appendChild(actions);
    customDbListEl.appendChild(row);
  });

  if (customDbPageIndicator) {
    const totalPages = Math.ceil(customDbItems.length / CUSTOM_DB_PAGE_SIZE) || 1;
    customDbPageIndicator.textContent = `${customDbPage + 1} / ${totalPages}`;
  }
}

if (customDbPrevBtn) {
  customDbPrevBtn.addEventListener('click', () => {
    customDbPage -= 1;
    renderCustomDbPage();
  });
}

if (customDbNextBtn) {
  customDbNextBtn.addEventListener('click', () => {
    customDbPage += 1;
    renderCustomDbPage();
  });
}

if (customDbRefreshBtn) {
  customDbRefreshBtn.addEventListener('click', () => {
    refreshCustomDbList();
  });
}

// show epilepsy modal and remember which speedFactor to start after confirmation
function showEpilepsyWarning(speedFactor) {
  pendingCursedSpeedFactor = speedFactor;
  if (epilepsyModal) {
    epilepsyModal.hidden = false;
  }
  if (epilepsyNoShowCheckbox) {
    epilepsyNoShowCheckbox.checked = false;
  }
}

// hide epilepsy modal
function hideEpilepsyWarning() {
  if (epilepsyModal) {
    epilepsyModal.hidden = true;
  }
}

if (epilepsyStartBtn) {
  epilepsyStartBtn.addEventListener('click', () => {
    if (epilepsyNoShowCheckbox && epilepsyNoShowCheckbox.checked) {
      epilepsyAccepted = true;
      localStorage.setItem('epilepsyAccepted', '1');
    }
    hideEpilepsyWarning();
    if (pendingCursedSpeedFactor != null) {
      // always turn on with the chosen speed
      setCursed(true, pendingCursedSpeedFactor);
      pendingCursedSpeedFactor = null;
    }
  });
}

if (epilepsyCloseBtn) {
  epilepsyCloseBtn.addEventListener('click', () => {
    if (epilepsyNoShowCheckbox && epilepsyNoShowCheckbox.checked) {
      epilepsyAccepted = true;
      localStorage.setItem('epilepsyAccepted', '1');
    }
    hideEpilepsyWarning();
    pendingCursedSpeedFactor = null;
  });
}

// helper that all cursed buttons use so the epilepsy warning shows first
function requestCursed(speedFactor) {
  // if already in this cursed mode, disable without warning
  if (cursed && cursedSpeedFactor === speedFactor) {
    setCursed(false);
    return;
  }
  if (!epilepsyAccepted) {
    showEpilepsyWarning(speedFactor);
    return;
  }
  // turn on / switch to this cursed speed directly
  setCursed(true, speedFactor);
}

// cursed mode toggle
function setCursed(on, speedFactor = 1) {
  if (on === cursed && speedFactor === cursedSpeedFactor) return;
  cursedSpeedFactor = speedFactor;

  // reset shared visuals
  clearUltraBackground();
  clearUniverseBackground();
  document.body.classList.remove('ultra-cursed', 'super-cursed', 'universe-cursed');
  elLetter.classList.remove('super-cursed-letter');

  if (on) {
    cursed = true;
    // stop any auto-play
    stopAuto();
    document.body.classList.add('cursed');
    elLetter.classList.add('cursed');

    // update active states
    if (btnCursed) btnCursed.classList.remove('active');
    if (btnCursedFast) btnCursedFast.classList.remove('active');
    if (btnCursedUltra) btnCursedUltra.classList.remove('active');
    if (btnCursedSuper) btnCursedSuper.classList.remove('active');
    if (btnCursedLight) btnCursedLight.classList.remove('active');
    if (btnCursedUniverse) btnCursedUniverse.classList.remove('active');

    if (speedFactor === 1 && btnCursed) btnCursed.classList.add('active');
    if (speedFactor === 10 && btnCursedFast) btnCursedFast.classList.add('active');
    if (speedFactor === 1000 && btnCursedUltra) {
      btnCursedUltra.classList.add('active');
      document.body.classList.add('ultra-cursed');
      createUltraBackground();
    }
    if (speedFactor === 1000000 && btnCursedSuper) {
      btnCursedSuper.classList.add('active');
      document.body.classList.add('super-cursed');
      elLetter.classList.add('super-cursed-letter');
      triggerSonicBoom();
    }
    if (speedFactor === 1000000000 && btnCursedLight) {
      btnCursedLight.classList.add('active');
      document.body.classList.add('super-cursed');
      elLetter.classList.add('super-cursed-letter');
      triggerSonicBoom();
    }
    if (speedFactor === 1000000000000 && btnCursedUniverse) {
      btnCursedUniverse.classList.add('active');
      document.body.classList.add('universe-cursed');
      elLetter.classList.add('super-cursed-letter');
      createUniverseBackground();
      triggerSonicBoom();
    }

    if (cursedTimer) clearInterval(cursedTimer);
    const baseInterval = 150;
    const interval = Math.max(16, Math.floor(baseInterval / speedFactor));

    cursedTimer = setInterval(() => {
      // random jump of position scales with speedFactor for extra chaos
      const jumpBase = BigInt(1 + Math.floor(Math.random() * 9999));
      const jump = jumpBase * BigInt(Math.max(1, Math.floor(speedFactor)));

      if (infinitePositions) {
        position += jump;
      } else {
        position = (position + jump) % totalPositions;
      }

      // randomize background; more aggressive when super-cursed
      if (speedFactor >= 1000000) {
        // strobing effect
        document.body.style.backgroundColor =
          Math.random() < 0.5 ? 'hsl(0 100% 50%)' : 'hsl(60 100% 60%)';
      } else {
        document.body.style.backgroundColor = randomDarkColor();
      }

      // give the active cursed button a chaotic wobble
      let activeBtn = null;
      if (speedFactor === 1 && btnCursed) activeBtn = btnCursed;
      else if (speedFactor === 10 && btnCursedFast) activeBtn = btnCursedFast;
      else if (speedFactor === 1000 && btnCursedUltra) activeBtn = btnCursedUltra;
      else if (speedFactor === 1000000 && btnCursedSuper) activeBtn = btnCursedSuper;
      else if (speedFactor === 1000000000 && btnCursedLight) activeBtn = btnCursedLight;
      else if (speedFactor === 1000000000000 && btnCursedUniverse) activeBtn = btnCursedUniverse;

      if (activeBtn) {
        const angle = (Math.random() * 24 - 12).toFixed(1); // more shake
        const scale = 1 + Math.random() * 0.2;
        activeBtn.style.transform = `rotate(${angle}deg) scale(${scale})`;
      }

      // occasional extra sonic boom when super-cursed
      if ((speedFactor === 1000000 || speedFactor === 1000000000 || speedFactor === 1000000000000) && Math.random() < 0.15) {
        triggerSonicBoom();
      }

      update();
    }, interval);
  } else {
    cursed = false;
    if (cursedTimer) {
      clearInterval(cursedTimer);
      cursedTimer = null;
    }
    clearUltraBackground();
    clearUniverseBackground();
    document.body.classList.remove('cursed', 'ultra-cursed', 'super-cursed', 'universe-cursed');
    elLetter.classList.remove('cursed', 'super-cursed-letter');
    if (btnCursed) {
      btnCursed.classList.remove('active');
      btnCursed.style.transform = '';
    }
    if (btnCursedFast) {
      btnCursedFast.classList.remove('active');
      btnCursedFast.style.transform = '';
    }
    if (btnCursedUltra) {
      btnCursedUltra.classList.remove('active');
      btnCursedUltra.style.transform = '';
    }
    if (btnCursedSuper) {
      btnCursedSuper.classList.remove('active');
      btnCursedSuper.style.transform = '';
    }
    if (btnCursedLight) {
      btnCursedLight.classList.remove('active');
      btnCursedLight.style.transform = '';
    }
    if (btnCursedUniverse) {
      btnCursedUniverse.classList.remove('active');
      btnCursedUniverse.style.transform = '';
    }
    // restore base background respecting light mode
    if (lightMode) {
      document.body.style.backgroundColor = '#f5f5f5';
    } else {
      document.body.style.backgroundColor = '#000';
    }
  }
}

if (btnCursed) {
  btnCursed.addEventListener('click', () => {
    requestCursed(1);
  });
}

if (btnCursedFast) {
  btnCursedFast.addEventListener('click', () => {
    requestCursed(10);
  });
}

if (btnCursedUltra) {
  btnCursedUltra.addEventListener('click', () => {
    requestCursed(1000);
  });
}

if (btnCursedSuper) {
  btnCursedSuper.addEventListener('click', () => {
    requestCursed(1000000);
  });
}

if (btnCursedLight) {
  btnCursedLight.addEventListener('click', () => {
    requestCursed(1000000000);
  });
}

if (btnCursedUniverse) {
  btnCursedUniverse.addEventListener('click', (e) => {
    // Easter egg: Shift+click on the ﷽ button shows credits instead of starting cursed mode
    if (e.shiftKey) {
      alert(
        'Credits:\n' +
        'Autumn – remix\n' +
        'Happs – stole this project (and original)'
      );
      return;
    }
    requestCursed(1000000000000);
  });
}

// admin panel behaviour
if (speedInput) {
  speedInput.addEventListener('input', () => {
    const val = parseInt(speedInput.value, 10);
    if (!Number.isNaN(val) && val > 0) {
      autoInterval = val;
      // if auto is running, restart with new interval
      if (autoMode) {
        const currentMode = autoMode;
        stopAuto();
        startAuto(currentMode);
      }
    }
  });
}

if (stepInput) {
  stepInput.addEventListener('input', () => {
    const val = parseInt(stepInput.value, 10);
    if (!Number.isNaN(val) && val > 0) {
      stepSize = BigInt(val);
    }
  });
}

if (maxInput) {
  maxInput.addEventListener('input', () => {
    if (!extremeMode) {
      // normal mode is locked to infinite; keep toggle visually on
      infinitePositions = true;
      if (infToggle) infToggle.classList.add('active');
      elIndicator.textContent = !extremeMode
        ? `${(position + 1n).toString()} / ₯`
        : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
      return;
    }
    const raw = maxInput.value.trim();
    if (!raw) return;

    const lower = raw.toLowerCase();
    // Allow "inf" or "infinity" to switch to infinite mode
    if (lower === 'inf' || lower === 'infinity') {
      infinitePositions = true;
      if (infToggle) infToggle.classList.add('active');
      if (maxInput) maxInput.value = 'inf';
      elIndicator.textContent = !extremeMode
        ? `${(position + 1n).toString()} / ₯`
        : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
      return;
    }

    try {
      const big = BigInt(raw);
      if (big > 0n) {
        infinitePositions = false;
        if (infToggle) infToggle.classList.remove('active');
        totalPositions = big;
        position = position % totalPositions;
        elIndicator.textContent = !extremeMode
          ? `${(position + 1n).toString()} / ₯`
          : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
      }
    } catch (e) {
      // ignore invalid BigInt input
    }
  });
}

if (teleportBtn && teleportInput) {
  const attemptTeleport = () => {
    const raw = teleportInput.value.trim();
    if (!raw) return;
    try {
      let target = BigInt(raw);
      if (target < 1n) target = 1n;
      if (!infinitePositions) {
        if (target > totalPositions) target = totalPositions;
      }
      position = target - 1n;
      stopAuto();
      update();
    } catch (e) {
      // ignore invalid teleport input
    }
  };

  teleportBtn.addEventListener('click', attemptTeleport);
  teleportInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      attemptTeleport();
    }
  });
}

// find word -> jump to its position in infinite ordering
if (findWordBtn && findWordInput) {
  const attemptFindWord = () => {
    const word = findWordInput.value;
    if (!word) return;

    // If the user pastes something extremely long (like a full movie script),
    // treat it as an error and reset back to "A" using the existing popup.
    if (word.length > 5000) {
      showLetterErrorModal();
      return;
    }

    const idx = getPositionOfWord(word);
    if (idx === null) {
      // simple failure feedback by briefly changing button text
      const original = findWordBtn.textContent;
      findWordBtn.textContent = 'No match';
      setTimeout(() => {
        findWordBtn.textContent = original || 'Find';
      }, 800);
      return;
    }
    // use infinite combination space for word lookup
    infinitePositions = true;
    if (infToggle) infToggle.classList.add('active');
    if (maxInput) maxInput.value = 'inf';
    position = idx;
    stopAuto();
    update();
  };

  findWordBtn.addEventListener('click', attemptFindWord);
  findWordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      attemptFindWord();
    }
  });
}

if (infToggle && maxInput) {
  infToggle.addEventListener('click', () => {
    if (!extremeMode) {
      // normal mode is locked to infinite; keep toggle visually on
      infinitePositions = true;
      if (infToggle) infToggle.classList.add('active');
      if (maxInput) maxInput.value = 'inf';
      elIndicator.textContent = !extremeMode
        ? `${(position + 1n).toString()} / ₯`
        : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
      return;
    }
    // In extreme mode, allow toggling between finite and infinite-style display if needed
  });
}

 // Random jump button: goes to a random position between 1 and current max
// (Rand button removed; random features now live in the dice modal)

 // Extreme Extension mode toggle
if (btnExtreme) {
  btnExtreme.addEventListener('click', () => {
    stopAuto();
    extremeMode = !extremeMode;

    if (extremeMode) {
      // Switching ON: use Extreme Unicode combinations with finite max
      infinitePositions = false;
      if (infToggle) infToggle.classList.remove('active');
      totalPositions = TOTAL_POSITIONS;
      position = position % totalPositions;
      if (maxInput) maxInput.value = totalPositions.toString();
      if (btnExtreme) btnExtreme.classList.add('active');
    } else {
      // Switching OFF: return to standard infinite combination space
      infinitePositions = true;
      if (infToggle) infToggle.classList.add('active');
      if (maxInput) maxInput.value = 'inf';
    }

    elIndicator.textContent = !extremeMode
      ? `${(position + 1n).toString()} / ₯`
      : `${(position + 1n).toString()} / ${totalPositions.toString()}`;
    update();
  });
}

// Info button: show counts of one-symbol "letters" per script/category
if (btnInfo) {
  btnInfo.addEventListener('click', () => {
    const lines = [
      `Latin (basic + extended letters/digits): ${ONE_LETTER_COUNTS.latin}`,
      `Greek letters: ${ONE_LETTER_COUNTS.greek}`,
      `Cyrillic letters (incl. supplement): ${ONE_LETTER_COUNTS.cyrillic}`,
      `Phonetic & extra Latin letters: ${ONE_LETTER_COUNTS.phoneticLatinExtra}`,
      `CJK (Japanese/Chinese Han + symbols/punctuation): ${ONE_LETTER_COUNTS.cjk}`,
      `Japanese syllabaries (Hiragana/Katakana): ${ONE_LETTER_COUNTS.japaneseKana}`,
      `Korean (Hangul): ${ONE_LETTER_COUNTS.hangul}`,
      `Thai: ${ONE_LETTER_COUNTS.thai}`,
      `Sinhala: ${ONE_LETTER_COUNTS.sinhala}`,
      `Egyptian hieroglyphs: ${ONE_LETTER_COUNTS.egyptian}`,
      `Braille patterns: ${ONE_LETTER_COUNTS.braille}`,
      `General emoji & pictographs (including custom blocks like 𼤞 𼤟): ${ONE_LETTER_COUNTS.emoji}`,
      `People/family skin‑tone emoji sequences: ${ONE_LETTER_COUNTS.peopleFamilyEmoji}`,
      `Flags (country + subdivisions like England/Scotland/Wales): ${ONE_LETTER_COUNTS.flags}`,
      `Total distinct one-symbol units in this generator: ${ONE_LETTER_COUNTS.total}`,
    ];
    alert(lines.join('\n'));
  });
}

elCopy.addEventListener('click', async () => {
  let char;
  try {
    char = getCurrentChar();
  } catch (e) {
    showLetterErrorModal();
    return;
  }
  const text = char; // copy only the letter
  // try clipboard writeText first
  try {
    await navigator.clipboard.writeText(text);
    // small visual hint
    elCopy.textContent = 'Copied';
    setTimeout(() => (elCopy.textContent = 'Copy'), 900);
  } catch (e) {
    // fallback: select + copy using textarea
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      elCopy.textContent = 'Copied';
    } catch (err) {
      elCopy.textContent = 'Fail';
    }
    ta.remove();
    setTimeout(() => (elCopy.textContent = 'Copy'), 900);
  }
});

elExport.addEventListener('click', async () => {
  let char;
  try {
    char = getCurrentChar();
  } catch (e) {
    // Do not reset to A on export problems; just show an inline error message.
    elExport.textContent = 'Export error, please try agian later...';
    setTimeout(() => (elExport.textContent = 'PNG'), 1500);
    return;
  }
  const color = elLetter.dataset.color || getComputedStyle(elLetter).color || '#000';

  // Build SVG that:
  // - uses Catrinity font
  // - wraps every 20 characters
  // - sizes itself to tightly fit the wrapped text
  const { svg, width, height } = buildLetterSvg(char, color);

  let url;
  try {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    url = URL.createObjectURL(blob);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          elExport.textContent = 'Export error, please try agian later...';
          setTimeout(() => (elExport.textContent = 'PNG'), 1500);
          return;
        }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(pngBlob);
        const safeChar = char.replace(/\s+/g, '_').slice(0, 6) || 'glyph';
        a.download = `letter-${safeChar}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        elExport.textContent = 'Saved';
        setTimeout(() => (elExport.textContent = 'PNG'), 900);
      }, 'image/png');
    };
    img.onerror = () => {
      if (url) URL.revokeObjectURL(url);
      elExport.textContent = 'Export error, please try agian later...';
      setTimeout(() => (elExport.textContent = 'PNG'), 1500);
    };
    img.src = url;
  } catch (e) {
    if (url) URL.revokeObjectURL(url);
    elExport.textContent = 'Export error, please try agian later...';
    setTimeout(() => (elExport.textContent = 'PNG'), 1500);
  }
});

/* Export current glyph as raw SVG (transparent background),
 * using Catrinity and wrapping every 20 characters while sizing
 * the SVG to tightly fit the wrapped text. */
elExportSvg.addEventListener('click', () => {
  let char;
  try {
    char = getCurrentChar();
  } catch (e) {
    // Do not reset to A on export problems; just show an inline error message.
    elExportSvg.textContent = 'Export error, please try agian later...';
    setTimeout(() => (elExportSvg.textContent = 'SVG'), 1500);
    return;
  }
  const color = elLetter.dataset.color || getComputedStyle(elLetter).color || '#000';

  try {
    const { svg } = buildLetterSvg(char, color);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const safeChar = char.replace(/\s+/g, '_').slice(0, 6) || 'glyph';
    a.download = `letter-${safeChar}.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    elExportSvg.textContent = 'Saved';
    setTimeout(() => (elExportSvg.textContent = 'SVG'), 900);
  } catch (e) {
    elExportSvg.textContent = 'Export error, please try agian later...';
    setTimeout(() => (elExportSvg.textContent = 'SVG'), 1500);
  }
});

 // helper to escape XML special chars
function escapeXml(s) {
  return String(s).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' }[c]));
}

/**
 * Build an SVG string for a given letter string using the Catrinity font.
 * - Wraps the content every 20 characters (by Unicode code point)
 * - Computes width/height so the SVG "hugs" the wrapped text
 * - Returns both the SVG markup and its numeric width/height
 */
function buildLetterSvg(letter, color) {
  const graphemes = Array.from(letter);
  const wrapSize = 20;
  const lines = [];
  for (let i = 0; i < graphemes.length; i += wrapSize) {
    lines.push(graphemes.slice(i, i + wrapSize).join(''));
  }
  const lineCount = Math.max(1, lines.length);
  const maxLineLength = Math.max(
    1,
    ...lines.map((line) => Array.from(line).length),
  );

  // Base sizing constants
  const baseFontSize = 160; // px
  const lineHeightFactor = 1.2;
  const padding = 40; // px around the text

  const fontSize = baseFontSize;
  const textBlockWidth = fontSize * Math.max(1, maxLineLength) * 0.6;
  const textBlockHeight = fontSize * lineHeightFactor * lineCount;

  const width = Math.ceil(textBlockWidth + padding * 2);
  const height = Math.ceil(textBlockHeight + padding * 2);

  const x = padding;
  let y = padding + fontSize;

  let tspanContent = '';
  lines.forEach((line, idx) => {
    const dy = idx === 0 ? 0 : fontSize * lineHeightFactor;
    tspanContent += `<tspan x="${x}" y="${y + dy}">${escapeXml(line)}</tspan>`;
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style type="text/css">
      @font-face {
        font-family: 'CatrinityExport';
        src: url('/Catrinity.otf.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      text { font-family: 'CatrinityExport', sans-serif; white-space: pre; }
    </style>
  </defs>
  <rect width="100%" height="100%" fill="transparent"/>
  <text font-size="${fontSize}" fill="${color}" text-anchor="start">
    ${tspanContent}
  </text>
</svg>`;

  return { svg, width, height };
}

// Ensure initial render (including easter egg logic) runs at startup
update();