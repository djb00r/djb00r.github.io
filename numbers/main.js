const PAGE_SIZE = 100n;
const START_PAGE = 1n;

// Zoom level: 0 = integers (original view), 1 = tenths, 2 = hundredths, etc.
let zoomLevel = 0;

const numbersContainer = document.getElementById("numbers-container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInput = document.getElementById("page-input");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const zoomInBtn = document.getElementById("zoom-in-btn");
const zoomOutBtn = document.getElementById("zoom-out-btn");
const zoomLabel = document.getElementById("zoom-label");
const modal = document.getElementById("number-modal");
const modalNumberEl = document.getElementById("modal-number");
const modalMetaEl = document.getElementById("modal-meta");
const modalEquationEl = document.getElementById("modal-equation");
const modalDescriptionEl = document.getElementById("modal-description");
const modalCloseBtn = document.getElementById("modal-close-btn");
// Milestones
const milestonesBtn = document.getElementById("milestones-btn");
const milestoneModal = document.getElementById("milestone-modal");
const milestoneCloseBtn = document.getElementById("milestone-close-btn");
const milestoneListEl = document.getElementById("milestone-list");

let currentPage = START_PAGE;
let currentSearchIndex = null;

// Helpers

function bigintFromString(str) {
  const cleaned = (str || "").trim();
  if (!cleaned) return null;
  if (!/^-?[0-9]+$/.test(cleaned)) return null;
  try {
    return BigInt(cleaned);
  } catch {
    return null;
  }
}

function formatBigInt(n) {
  return n.toString();
}

// Parse a numeric input that can be integer or decimal, returns
// { zoom, scaled, valueStr } where `scaled` is a BigInt of value * 10^zoom.
function parseNumericInput(str) {
  const cleaned = (str || "").trim();
  if (!cleaned) return null;

  const match = cleaned.match(/^([+-])?(\d*)(?:\.(\d+))?$/);
  if (!match) return null;

  const sign = match[1] === "-" ? "-" : "";
  let intPart = match[2] || "0";
  let fracPart = match[3] || "";

  // Remove leading zeros in integer part
  intPart = intPart.replace(/^0+(?=\d)/, "");
  if (!intPart) intPart = "0";

  // Zoom level is number of fractional digits
  const zoom = fracPart.length;

  const combined = sign + intPart + fracPart;
  try {
    const scaled = BigInt(combined || "0");
    const valueStr =
      zoom === 0
        ? scaled.toString()
        : sign +
          (intPart === "0" ? "0" : intPart) +
          "." +
          fracPart;
    return { zoom, scaled, valueStr };
  } catch {
    return null;
  }
}

// Convert a scaled integer back to a decimal string for given zoom level.
function formatScaledNumber(n, zoom) {
  if (zoom === 0) return n.toString();

  const sign = n < 0n ? "-" : "";
  let abs = n < 0n ? -n : n;
  let s = abs.toString();

  if (s.length <= zoom) {
    const zeros = "0".repeat(zoom - s.length);
    s = "0." + zeros + s;
  } else {
    const intPart = s.slice(0, s.length - zoom);
    const fracPart = s.slice(s.length - zoom);
    s = intPart + "." + fracPart;
  }

  return sign + s;
}

function formatScientific(n) {
  const str = n.toString();
  if (str.length <= 12) return str;

  const firstNonZero = str.search(/[1-9]/);
  if (firstNonZero === -1) return "0";

  const exponent = str.length - firstNonZero - 1;
  const mantissaRaw = str.slice(firstNonZero, firstNonZero + 4);
  const mantissa =
    mantissaRaw.length > 1
      ? mantissaRaw[0] + "." + mantissaRaw.slice(1).replace(/0+$/, "")
      : mantissaRaw[0];

  return `${mantissa}×10^${exponent}`;
}

function formatDisplayNumber(n) {
  const str = n.toString();

  // Exact powers of 10 get a neat scientific form early
  if (/^10*$/.test(str) && str.length > 4) {
    return `1×10^${str.length - 1}`;
  }

  // Very long numbers switch to scientific notation
  if (str.length > 12) {
    return formatScientific(n);
  }

  return str;
}

function formatDisplayPage(page, zoom) {
  const str = page.toString();
  const base =
    str.length > 12
      ? formatScientific(page)
      : str;

  // Always show just the page number here; zoom is controlled only by the zoom buttons
  return base;
}

function getHashState() {
  const hashRaw = window.location.hash.replace("#", "").trim();
  if (!hashRaw) return null;

  // New format: Z{zoom}.{page}
  if (hashRaw.startsWith("Z")) {
    const m = hashRaw.match(/^Z(\d+)\.(.+)$/);
    if (!m) return null;
    const zoom = parseInt(m[1], 10);
    if (!Number.isFinite(zoom) || zoom < 0) return null;
    const page = bigintFromString(m[2]);
    if (page === null) return null;
    return { page, zoom };
  }

  // Old format: just page (zoom 0)
  const page = bigintFromString(hashRaw);
  if (page === null) return null;
  return { page, zoom: 0 };
}

function setHashState(page, zoom) {
  const label = zoom > 0 ? `Z${zoom}.${formatBigInt(page)}` : formatBigInt(page);
  history.replaceState(null, "", `#${label}`);
}

function clearSearchHighlight() {
  if (currentSearchIndex === null) return;
  const cells = numbersContainer.children;
  if (currentSearchIndex >= 0 && currentSearchIndex < cells.length) {
    cells[currentSearchIndex].classList.remove("search-hit");
  }
  currentSearchIndex = null;
}

function highlightSearchIndex(index) {
  clearSearchHighlight();
  const cells = numbersContainer.children;
  if (index >= 0 && index < cells.length) {
    cells[index].classList.add("search-hit");
    currentSearchIndex = index;
  }
}

// AI description

async function describeNumberAI(valueStr) {
  const value = valueStr;
  const isInteger = !value.includes(".");
  let parityInfo = "non-integer";
  let digits = value.replace("-", "").replace(".", "").length;

  if (isInteger) {
    try {
      const n = BigInt(value);
      const isEven = n % 2n === 0n;
      parityInfo = isEven ? "even integer" : "odd integer";
    } catch {
      parityInfo = "integer (too large to inspect precisely here)";
    }
  }

  // Fallback description in case AI fails
  const fallback = `This is ${value}, a ${parityInfo} with ${digits} digit${digits === 1 ? "" : "s"} living in the endless sea of numbers.`;

  if (typeof websim === "undefined" || !websim.chat || !websim.chat.completions) {
    return fallback;
  }

  try {
    const completion = await websim.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a playful but precise math explainer. Describe an integer in 2–3 short sentences, mixing math facts with internet/culture references when relevant. Keep it concise, friendly, and non-repetitive.",
        },
        {
          role: "user",
          content: `Number: ${value}
Type: ${isInteger ? "integer" : "non-integer real"}
Parity (if integer): ${parityInfo}
Digit count (excluding sign and decimal point): ${digits}

Write about:
- Interesting math properties (primes, powers, patterns, famous appearances if any). If it's not an integer, talk about how it could appear as a measurement, probability, constant approximation, or coordinate.
- Any meme / pop culture / internet references for this exact number if they exist.
- If the number is extremely large, talk about scale (astronomy, cryptography, combinatorics, etc.).

Do NOT format as a list, just a tiny paragraph.`,
        },
      ],
    });

    const text =
      (completion && completion.content && completion.content.trim()) || "";
    return text || fallback;
  } catch {
    return fallback;
  }
}

// Rendering

function ensureGrid() {
  const existing = numbersContainer.children.length;
  if (existing === 100) return;

  numbersContainer.innerHTML = "";
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.className = "number-cell";
    numbersContainer.appendChild(cell);
  }
}

function shouldUseTallCell(valueStr) {
  // Only care about the integer part before any decimal point
  const negativeStripped = valueStr.startsWith("-")
    ? valueStr.slice(1)
    : valueStr;
  const [intPartRaw] = negativeStripped.split(".");
  const intPart = intPartRaw.replace(/^0+(?=\d)/, "") || "0";

  // If the integer part is effectively zero (e.g. "0" in "0.0000001"), don't make it tall
  if (intPart === "0") return false;

  // Make the cell taller when the integer part itself is long
  return intPart.length > 6;
}

function renderPage(page) {
  ensureGrid();

  currentPage = page;

  let startIndex;
  if (page >= 1n) {
    startIndex = (page - 1n) * PAGE_SIZE + 1n;
  } else {
    // Page 0: -99..0, page -1: -199..-100, etc.
    startIndex = page * PAGE_SIZE - (PAGE_SIZE - 1n);
  }

  // Helper to detect positive powers of 10 (10, 100, 1000, …)
  function isPositivePowerOfTen(n) {
    if (n <= 0n || n === 1n) return false;
    let v = n;
    while (v % 10n === 0n) {
      v /= 10n;
    }
    return v === 1n;
  }

  const cells = numbersContainer.children;
  for (let i = 0; i < 100; i++) {
    const indexValue = startIndex + BigInt(i);
    const cell = cells[i];

    let valueStr;
    let display;

    if (zoomLevel === 0) {
      const value = indexValue;
      valueStr = value.toString();
      display = formatDisplayNumber(value);

      // Reset state
      cell.classList.remove(
        "highlight",
        "negative-highlight",
        "search-hit",
        "meme-number",
        "golden-number",
        "starting-number"
      );

      // Multiples of 10: yellow for >= 0, blue for negatives (integers only)
      if (value % 10n === 0n) {
        if (value < 0n) {
          cell.classList.add("negative-highlight");
        } else {
          cell.classList.add("highlight");
        }
      }

      // Special styling
      cell.classList.toggle("meme-number", value === 69420n);
      cell.classList.toggle("golden-number", value === 0n || value === -100n);

      // Starting numbers: 1 and positive powers of 10
      if (value === 1n || isPositivePowerOfTen(value)) {
        cell.classList.add("starting-number");
      }
    } else {
      // Decimal view: use scaled integers with zoomLevel decimals
      const value = indexValue;
      valueStr = formatScaledNumber(value, zoomLevel);
      display = valueStr;

      // Reset state
      cell.classList.remove(
        "highlight",
        "negative-highlight",
        "search-hit",
        "meme-number",
        "golden-number",
        "starting-number"
      );
    }

    cell.dataset.value = valueStr;
    cell.textContent = display;

    // Adjust cell height only for numbers with a large, non-zero integer part
    if (shouldUseTallCell(valueStr)) {
      cell.classList.add("tall-number");
    } else {
      cell.classList.remove("tall-number");
    }
  }
  currentSearchIndex = null;

  pageInput.value = formatDisplayPage(page, zoomLevel);
  zoomLabel.textContent = `Z${zoomLevel}`;
  // Allow paging endlessly in both directions
  prevBtn.disabled = false;
  setHashState(page, zoomLevel);
}

function goToScaledNumber(nScaled, zoom) {
  zoomLevel = zoom;
  const PAGE = PAGE_SIZE;

  // Compute page using floor division for negatives, in scaled space
  const num = nScaled + (PAGE - 1n); // n + 99
  let q = num / PAGE;
  const r = num % PAGE;
  if (r !== 0n && num < 0n) {
    q -= 1n;
  }
  const page = q;

  const startIndex =
    page >= 1n
      ? (page - 1n) * PAGE + 1n
      : page * PAGE - (PAGE - 1n);

  const indexBig = nScaled - startIndex;
  const index = Number(indexBig);

  renderPage(page);
  if (index >= 0 && index < 100) {
    highlightSearchIndex(index);
  }
}

// Keep integer navigation helper for milestones and old behavior
function goToNumber(n) {
  goToScaledNumber(n, 0);
}

// Modal

async function openModalForNumber(valueStr) {
  const isInteger = !valueStr.includes(".");
  let meta = "";

  if (isInteger) {
    const n = bigintFromString(valueStr);
    if (n !== null) {
      const isEven = n % 2n === 0n;
      meta = `${valueStr} is ${isEven ? "even" : "odd"}.`;
    } else {
      meta = `${valueStr} is an integer (very large).`;
    }
  } else {
    meta = `${valueStr} is a non-integer real number.`;
  }

  modalNumberEl.textContent = valueStr;
  modalMetaEl.textContent = meta;
  modalDescriptionEl.textContent = "Thinking about this number…";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");

  const description = await describeNumberAI(valueStr);
  // Only update if modal is still open
  if (!modal.classList.contains("hidden")) {
    modalDescriptionEl.textContent = description;
  }
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

// Milestones

const milestones = (() => {
  const result = [];
  const push = (label, value) => result.push({ label, value });

  push("0", 0n);
  push("-100", -100n);
  push("1", 1n);
  push("1,000", 1000n);
  push("10,000", 10000n);
  push("69,420", 69420n);
  push("100K", 100000n);
  push("1 Million", 1000000n);
  push("100 Million", 100000000n);
  push("1 Billion", 1000000000n);
  push("1 Trillion", 1000000000000n);
  push("1 Quadrillion", 1000000000000000n);
  push("1 Quintillion", 1000000000000000000n);
  // Septendecillion: 10^54
  push("1 Septendecillion (10^54)", 10n ** 54n);
  // Googol: 10^100
  push("Googol (10^100)", 10n ** 100n);

  // Conceptual milestones without exact jump targets
  result.push({ label: "Googolplex (10^(10^100))", value: null });
  result.push({ label: "More…", value: null });
  result.push({ label: "Beyond Googol…", value: null });
  result.push({ label: "∞ (Infinity)", value: null });
  result.push({ label: "Absolute Infinity", value: null });

  return result;
})();

function renderMilestones() {
  milestoneListEl.innerHTML = "";
  milestones.forEach((m) => {
    const btn = document.createElement("button");
    btn.className = "milestone-item";
    btn.textContent = m.label;
    if (m.value !== null) {
      btn.dataset.value = m.value.toString();
    } else {
      btn.disabled = true;
      btn.classList.add("milestone-disabled");
    }
    milestoneListEl.appendChild(btn);
  });
}

function openMilestonesModal() {
  milestoneModal.classList.remove("hidden");
  milestoneModal.setAttribute("aria-hidden", "false");
}

function closeMilestonesModal() {
  milestoneModal.classList.add("hidden");
  milestoneModal.setAttribute("aria-hidden", "true");
}

// Events

prevBtn.addEventListener("click", () => {
  renderPage(currentPage - 1n);
});

nextBtn.addEventListener("click", () => {
  renderPage(currentPage + 1n);
});

pageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyPageInput();
  } else if (e.key === "Escape") {
    pageInput.value = formatDisplayPage(currentPage, zoomLevel);
    pageInput.blur();
  }
});

pageInput.addEventListener("blur", () => {
  applyPageInput();
});

function applyPageInput() {
  const raw = (pageInput.value || "").trim();

  // Page input now only accepts plain numeric pages; zoom cannot be set here
  const page = bigintFromString(raw);
  if (page === null) {
    pageInput.value = formatDisplayPage(currentPage, zoomLevel);
    return;
  }
  renderPage(page);
}

function applySearchInput() {
  const parsed = parseNumericInput(searchInput.value);
  if (!parsed) {
    return;
  }
  const { zoom, scaled } = parsed;
  goToScaledNumber(scaled, zoom);
}

searchBtn.addEventListener("click", () => {
  applySearchInput();
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applySearchInput();
  } else if (e.key === "Escape") {
    searchInput.value = "";
    searchInput.blur();
  }
});

numbersContainer.addEventListener("click", (e) => {
  const cell = e.target.closest(".number-cell");
  if (!cell || !cell.dataset.value) return;
  openModalForNumber(cell.dataset.value);
});

modalCloseBtn.addEventListener("click", () => {
  closeModal();
});

modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    closeModal();
  }
});

// Zoom controls
zoomInBtn.addEventListener("click", () => {
  zoomLevel += 1;
  renderPage(currentPage);
});

zoomOutBtn.addEventListener("click", () => {
  if (zoomLevel > 0) {
    zoomLevel -= 1;
    renderPage(currentPage);
  }
});

// Milestones events
milestonesBtn.addEventListener("click", () => {
  openMilestonesModal();
});

milestoneCloseBtn.addEventListener("click", () => {
  closeMilestonesModal();
});

milestoneModal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    closeMilestonesModal();
  }
});

milestoneListEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".milestone-item");
  if (!btn || !btn.dataset.value) return;
  const n = bigintFromString(btn.dataset.value);
  if (!n) return;
  closeMilestonesModal();
  goToNumber(n);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!modal.classList.contains("hidden")) {
      closeModal();
    } else if (!milestoneModal.classList.contains("hidden")) {
      closeMilestonesModal();
    }
  }
});

// Hash navigation (deep linking)

window.addEventListener("hashchange", () => {
  const state = getHashState();
  if (!state) return;
  const { page, zoom } = state;
  if (page === currentPage && zoom === zoomLevel) return;
  zoomLevel = zoom;
  renderPage(page);
});

// Init

const initialState = getHashState() ?? { page: START_PAGE, zoom: 0 };
zoomLevel = initialState.zoom;
renderPage(initialState.page);
renderMilestones();