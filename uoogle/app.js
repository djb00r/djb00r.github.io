// ...existing code...

import Fuse from "fuse.js";

const els = {
  form: document.getElementById("searchForm"),
  input: document.getElementById("searchInput"),
  mic: document.getElementById("micBtn"),
  suggestions: document.getElementById("suggestions"),
  grid: document.getElementById("imageGrid"),
  articles: document.getElementById("articles"),
  woofy: document.getElementById("feelingWoofy"),
  chips: document.querySelectorAll(".chip"),
  lightbox: document.getElementById("lightbox"),
  lightboxImg: document.getElementById("lightboxImg"),
  closeLightbox: document.getElementById("closeLightbox"),
  openImg: document.getElementById("openImg"),
  copyImg: document.getElementById("copyImg"),
  anotherLikeThis: document.getElementById("anotherLikeThis"),
};

let breeds = []; // [{label, breed, subBreed}]
let fuse;

// Boot
init();
async function init() {
  await loadBreeds();
  setupFuse();
  wireEvents();

  // Restore last query if present
  const last = localStorage.getItem("uoogle:lastQuery");
  if (last) {
    els.input.value = last;
    search(last);
  } else {
    feelingWoofy();
  }
}

async function loadBreeds() {
  try {
    const res = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await res.json();
    const list = data.message;
    breeds = Object.keys(list).flatMap((breed) => {
      const subs = list[breed];
      if (!subs || subs.length === 0) return [{ label: title(breed), breed, subBreed: null }];
      return subs.map((sub) => ({
        label: `${title(sub)} ${title(breed)}`,
        breed,
        subBreed: sub
      }));
    });
  } catch (e) {
    console.error("Failed to load breeds", e);
    breeds = [];
  }
}

function setupFuse() {
  fuse = new Fuse(breeds, {
    includeScore: true,
    threshold: 0.4,
    keys: ["label", "breed", "subBreed"]
  });
}

function wireEvents() {
  els.form.addEventListener("submit", (e) => {
    const q = els.input.value.trim();
    if (!q) return e.preventDefault();
    if (isBadQuery(q)) { e.preventDefault(); location.href = `blocked.html?q=${encodeURIComponent(q)}`; return; }
    // let the browser navigate to results.html?q=...
  });

  // change woofy to drop a dog with gravity
  els.woofy.addEventListener("click", (e) => { e.preventDefault(); addDog(); });

  // Chips quick search
  els.chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.chip;
      els.input.value = q;
      search(q);
    });
  });

  // Suggestions
  els.input.addEventListener("input", onSuggest);
  els.input.addEventListener("keydown", onSuggestKey);

  // Voice search (best-effort)
  els.mic.addEventListener("click", startVoice);

  // Lightbox controls
  els.closeLightbox.addEventListener("click", () => els.lightbox.close());
  els.copyImg.addEventListener("click", async () => {
    const url = els.openImg.href;
    try {
      await navigator.clipboard.writeText(url);
      toast("Image URL copied");
    } catch {
      toast("Couldn't copy URL");
    }
  });
  els.anotherLikeThis.addEventListener("click", async () => {
    const url = els.openImg.dataset.sourceUrl;
    const hint = parseBreedFromImageUrl(url);
    if (hint) {
      const { breed, subBreed } = hint;
      const one = await fetchImages({ breed, subBreed }, 1);
      if (one[0]) openLightbox(one[0], labelFor({ breed, subBreed }));
    } else {
      const one = await fetchRandom(1);
      if (one[0]) openLightbox(one[0], "Random Dog");
    }
  });
}

function onSuggest() {
  const q = els.input.value.trim();
  const list = getSuggestions(q).slice(0, 8);
  renderSuggestions(list);
}
function onSuggestKey(e) {
  const items = [...els.suggestions.querySelectorAll("li")];
  if (!items.length) return;
  const currentIndex = items.findIndex((li) => li.getAttribute("aria-selected") === "true");
  if (e.key === "ArrowDown") {
    e.preventDefault();
    const next = (currentIndex + 1) % items.length;
    setActiveSuggestion(items, next);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    const prev = (currentIndex - 1 + items.length) % items.length;
    setActiveSuggestion(items, prev);
  } else if (e.key === "Enter") {
    const active = items[currentIndex];
    if (active) {
      els.input.value = active.dataset.value;
      hideSuggestions();
    }
  } else if (e.key === "Escape") {
    hideSuggestions();
  }
}

function getSuggestions(q) {
  if (!q) {
    return breeds.slice(0, 8).map(labelFor);
  }
  const res = fuse.search(q).slice(0, 8).map((r) => r.item);
  const core = res.map(labelFor);
  // Add generic topics
  const topics = ["puppy training", "healthy treats", "best dog parks", "grooming tips", "dog toys"];
  const matchTopics = topics.filter((t) => t.toLowerCase().includes(q.toLowerCase()));
  return [...new Set([...core, ...matchTopics])];
}

function renderSuggestions(items) {
  els.suggestions.innerHTML = "";
  if (!items.length) {
    hideSuggestions();
    return;
  }
  els.suggestions.classList.add("show");
  items.forEach((text, i) => {
    const li = document.createElement("li");
    li.role = "option";
    li.dataset.value = text;
    li.textContent = text;
    if (i === 0) li.setAttribute("aria-selected", "true");
    li.addEventListener("click", () => {
      els.input.value = text;
      hideSuggestions();
      search(text);
    });
    els.suggestions.appendChild(li);
  });
}

function setActiveSuggestion(items, idx) {
  items.forEach((li) => li.setAttribute("aria-selected", "false"));
  const li = items[idx];
  if (li) li.setAttribute("aria-selected", "true");
}

function hideSuggestions() {
  els.suggestions.classList.remove("show");
  els.suggestions.innerHTML = "";
}

async function search(query) {
  hideSuggestions();
  localStorage.setItem("uoogle:lastQuery", query);

  // Try to find a breed from query
  const match = fuse.search(query)[0]?.item;
  let images = [];
  if (match) {
    images = await fetchImages(match, 12);
  } else {
    images = await fetchRandom(12);
  }
  renderImages(images, match ? labelFor(match) : "Random Dogs");

  // remove renderArticles on index
}

async function feelingWoofy() {
  els.input.value = "";
  localStorage.removeItem("uoogle:lastQuery");
  renderImages(await fetchRandom(12), "Random Dogs");
  // remove renderArticles on index
}

async function fetchImages({ breed, subBreed }, count = 12) {
  try {
    const path = subBreed ? `${breed}/${subBreed}` : breed;
    const res = await fetch(`https://dog.ceo/api/breed/${path}/images/random/${count}`);
    const data = await res.json();
    return Array.isArray(data.message) ? data.message : [data.message];
  } catch (e) {
    console.error("Failed to fetch breed images", e);
    return [];
  }
}
async function fetchRandom(count = 12) {
  try {
    const res = await fetch(`https://dog.ceo/api/breeds/image/random/${count}`);
    const data = await res.json();
    return data.message;
  } catch (e) {
    console.error("Failed to fetch random images", e);
    return [];
  }
}

function renderImages(urls, label) {
  els.grid.innerHTML = "";
  if (!urls.length) {
    els.grid.innerHTML = `<p>No images found. Try another search.</p>`;
    return;
  }
  urls.forEach((url) => {
    const meta = parseBreedFromImageUrl(url);
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = url;
    img.alt = `${meta ? labelFor(meta) : label}`;
    img.loading = "lazy";
    img.addEventListener("click", () => openLightbox(url, img.alt));
    const metaBar = document.createElement("div");
    metaBar.className = "meta";
    const name = document.createElement("span");
    name.textContent = meta ? labelFor(meta) : label;
    const openBtn = document.createElement("button");
    openBtn.className = "open";
    openBtn.textContent = "Open";
    openBtn.addEventListener("click", () => openLightbox(url, img.alt));
    metaBar.append(name, openBtn);
    card.append(img, metaBar);
    els.grid.appendChild(card);
  });
}

function openLightbox(url, alt) {
  els.lightboxImg.src = url;
  els.lightboxImg.alt = alt;
  els.openImg.href = url;
  els.openImg.dataset.sourceUrl = url;
  if (!els.lightbox.open) els.lightbox.showModal();
}

async function fetchArticles(query) {
  try {
    const completion = await websim.chat.completions.create({
      messages: [
        { role: "system", content: `Respond with JSON only: [{"title":string,"snippet":string}] about "${query}" in a dog-focused context. 6 concise items.` },
        { role: "user", content: [{ type: "text", text: query }], json: true },
      ],
    });
    let items = [];
    try { items = JSON.parse(completion.content); } catch {}
    if (!Array.isArray(items) || !items.length) throw new Error("AI empty");
    return items.slice(0,6).map(a => ({ title: a.title, snippet: a.snippet, url: `uikiuedia.html?q=${encodeURIComponent(a.title)}` }));
  } catch (e) {
    const q = encodeURIComponent(`dog ${query}`.trim());
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&format=json&srsearch=${q}`);
    const data = await res.json();
    const hits = data?.query?.search || [];
    return hits.slice(0, 6).map((h) => ({
      title: h.title,
      snippet: h.snippet,
      url: `uikiuedia.html?q=${encodeURIComponent(h.title)}`
    }));
  }
}

function renderArticles(items) {
  els.articles.innerHTML = "";
  if (!items.length) {
    els.articles.innerHTML = `<li>No articles found.</li>`;
    return;
  }
  for (const a of items) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = a.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = a.title;
    const snippet = document.createElement("div");
    snippet.className = "snippet";
    snippet.innerHTML = a.snippet + "…";
    li.append(link, snippet);
    els.articles.appendChild(li);
  }
}

function title(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
const BAD_WORDS = ["sex","pron","porn","p0rn","xxx","nsfw","nude","nudity","violence","gore","kill","drugs","weapon","gun","bomb","hate","racist","slur","suicide","self harm","self-harm","fetish","adult","explicit","erotic","rape","abuse","inappropriate","inappropiate","innapropiate","inapropriate","swear","swearing","curse","cursing","obscene","profanity","fuck","f*ck","fuk","shit","sh1t","bitch","biatch","ass","a55","asshole","a**hole","bastard","dick","d1ck","douche","piss","prick","wank","twat","bollocks","motherfucker","goddamn","wtf"];
function normalize(q) {
  return q.toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[@]/g,"a").replace(/[$]/g,"s").replace(/0/g,"o").replace(/[1!]/g,"i")
    .replace(/3/g,"e").replace(/4/g,"a").replace(/5/g,"s").replace(/7/g,"t")
    .replace(/[^a-z\s]/g," ").replace(/\s+/g," ").trim();
}
function isBadQuery(q) {
  const parts = normalize(q).split(" ");
  return BAD_WORDS.some(w => parts.includes(normalize(w)));
}
function labelFor({ breed, subBreed }) {
  return subBreed ? `${title(subBreed)} ${title(breed)}` : title(breed);
}

// Parse breed from dog.ceo image URL if possible
function parseBreedFromImageUrl(url) {
  // Example: https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg
  try {
    const [, breedPart] = url.match(/breeds\/([^/]+)\//) || [];
    if (!breedPart) return null;
    if (breedPart.includes("-")) {
      const [breed, subBreed] = breedPart.split("-");
      return { breed, subBreed };
    }
    return { breed: breedPart, subBreed: null };
  } catch {
    return null;
  }
}

function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    toast("Voice search not supported in this browser");
    return;
  }
  const rec = new SpeechRecognition();
  rec.lang = "en-US";
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => {
    const text = e.results[0][0].transcript;
    if (isBadQuery(text)) { location.href = `blocked.html?q=${encodeURIComponent(text)}`; return; }
    els.input.value = text;
    search(text);
  };
  rec.onerror = () => toast("Voice search failed");
  rec.start();
}

let toastTimer;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    Object.assign(el.style, {
      position: "fixed",
      left: "50%",
      bottom: "24px",
      transform: "translateX(-50%)",
      background: "#ffffff",
      color: "#202124",
      border: "1px solid #dadce0",
      padding: ".6rem .9rem",
      borderRadius: "12px",
      zIndex: 9999,
      boxShadow: "0 10px 30px rgba(0,0,0,.12)"
    });
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = "1";
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.opacity = "0";
  }, 1600);
}

const dogLayer = document.getElementById("dogLayer");
const dogBodies = [];
let lastT = performance.now();
function physicsTick(t) {
  const dt = (t - lastT) / 1000; lastT = t;
  const floor = window.innerHeight - 64;
  dogBodies.forEach(d => {
    if (d.drag) return;
    d.vy += 1500 * dt; d.y += d.vy * dt;
    if (d.y > floor) { d.y = floor; d.vy = 0; }
    d.x = Math.max(0, Math.min(window.innerWidth - 64, d.x));
    d.el.style.transform = `translate(${d.x}px, ${d.y}px)`;
  });
  requestAnimationFrame(physicsTick);
}
requestAnimationFrame(physicsTick);

function addDog() {
  const el = document.createElement("img");
  el.src = "dog.png"; el.alt = "dog"; el.className = "dog-instance";
  const body = { el, x: window.innerWidth / 2 - 32, y: -80, vy: 0, drag: false };
  el.style.transform = `translate(${body.x}px, ${body.y}px)`; dogLayer.appendChild(el); dogBodies.push(body);
  const down = (e) => {
    body.drag = true; el.classList.add("dragging");
    const getPt = ev => (ev.touches ? ev.touches[0] : ev);
    const start = getPt(e); const ox = start.clientX - body.x; const oy = start.clientY - body.y;
    const move = ev => { const p = getPt(ev); body.x = p.clientX - ox; body.y = p.clientY - oy; el.style.transform = `translate(${body.x}px, ${body.y}px)`; };
    const up = () => { body.drag = false; el.classList.remove("dragging");
      window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move); window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false }); window.addEventListener("touchend", up);
  };
  el.addEventListener("mousedown", down);
  el.addEventListener("touchstart", down, { passive: false });
}