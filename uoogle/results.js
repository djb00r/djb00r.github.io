const params = new URLSearchParams(location.search);
const q = (params.get("q") || "").trim();
const list = document.getElementById("serpList");

/* redirect on bad words */
const BAD_WORDS = ["sex","pron","porn","p0rn","xxx","nsfw","nude","nudity","violence","gore","kill","drugs","weapon","gun","bomb","hate","racist","slur","suicide","self harm","self-harm","fetish","adult","explicit","erotic","rape","abuse","inappropriate","inappropiate","innapropiate","inapropriate","swear","swearing","curse","cursing","obscene","profanity","fuck","f*ck","fuk","shit","sh1t","bitch","biatch","ass","a55","asshole","a**hole","bastard","dick","d1ck","douche","piss","prick","wank","twat","bollocks","motherfucker","goddamn","wtf"];

/* Easter egg trigger phrases (these should never be treated as blocked) */
const EASTER_EGGS = ["uoogle", "og", "2021 uoogle", "uoogle in 2021", "uoogle 2021", "uoogle scratch", "scratch uoogle", "scratch", "classic", "2021", "classic uoogle", "uoogle classi", "dognett", "easter egg", "easteregg"];

/* normalize helper */
function normalize(q) {
  return (q || "").toLowerCase()
    .normalize("NFKD").replace(/[\\u0300-\\u036f]/g,"")
    .replace(/[@]/g,"a").replace(/[$]/g,"s").replace(/0/g,"o").replace(/[1!]/g,"i")
    .replace(/3/g,"e").replace(/4/g,"a").replace(/5/g,"s").replace(/7/g,"t")
    .replace(/[^a-z\\s]/g," ").replace(/\\s+/g," ").trim();
}

/* If query matches an easter egg phrase, return true (we'll show a first-result link) */
function tryEasterEgg(q) {
  if (!q) return false;
  const nq = normalize(q);
  for (const phrase of EASTER_EGGS) {
    if (nq === normalize(phrase)) {
      return true;
    }
  }
  return false;
}

/* run easter egg first; if matched show classic Uoogle as the top result link (do not auto-open) */
if (tryEasterEgg(q)) {
  const list = document.getElementById("serpList");
  if (list) {
    list.innerHTML = `<li class="result-item"><div style="font-weight:700;">Classic Uoogle (top result)</div><div style="margin-top:.5rem;"><a href="uoogle.html" target="_blank" rel="noopener">Open classic Uoogle</a></div></li>`;
  }
} else {
  if (q && BAD_WORDS.some(w => normalize(q).split(" ").includes(normalize(w)))) {
    location.replace(`blocked.html?q=${encodeURIComponent(q)}`);
  }

  if (!q) {
    list.innerHTML = `<li>No query provided.</li>`;
  } else {
    fetchWikipediaResults(q);
  }
}

async function fetchWikipediaResults(query) {
  list.innerHTML = `<li>Loading Wikipedia results…</li>`;
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&origin=*&format=json&srprop=snippet&srinfo=&srlimit=10&srsearch=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();
    const items = (data?.query?.search || []).map(h => ({
      title: h.title,
      snippet: h.snippet,
      url: `viewer.html?title=${encodeURIComponent(h.title)}&q=${encodeURIComponent(query)}`
    }));
    renderWiki(items);
  } catch (e) {
    console.error(e);
    list.innerHTML = `<li>Failed to load results.</li>`;
  }
}

function openViewerPopup(title, q) {
  // compute a centered popup size
  const w = Math.min(1100, Math.floor(window.innerWidth * 0.85));
  const h = Math.min(700, Math.floor(window.innerHeight * 0.85));
  const left = Math.max(0, Math.floor((window.screenX || window.screenLeft) + (window.innerWidth - w) / 2));
  const top = Math.max(0, Math.floor((window.screenY || window.screenTop) + (window.innerHeight - h) / 2));
  const features = `width=${w},height=${h},left=${left},top=${top},resizable=yes,scrollbars=yes`;
  const url = `viewer.html?title=${encodeURIComponent(title)}&q=${encodeURIComponent(q || "")}`;
  window.open(url, `uoogle_viewer_${Date.now()}`, features);
}

function renderWiki(items) {
  list.innerHTML = "";
  if (!Array.isArray(items) || !items.length) {
    list.innerHTML = `<li>No results found.</li>`;
    return;
  }
  for (const r of items) {
    const li = document.createElement("li");
    li.className = "result-item";

    // Title as a clickable element that opens a centered popup viewer
    const a = document.createElement("a");
    a.href = "#";
    a.className = "serp-title";
    a.textContent = r.title;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openViewerPopup(r.title, new URLSearchParams(location.search).get("q") || "");
    });

    // Provide an explicit "Open in new tab" link for accessibility
    const newTab = document.createElement("a");
    newTab.href = r.url;
    newTab.target = "_blank";
    newTab.rel = "noopener";
    newTab.className = "serp-url";
    newTab.textContent = r.url;

    const snippet = document.createElement("div");
    snippet.className = "serp-snippet";
    snippet.innerHTML = r.snippet;

    li.appendChild(a);
    li.appendChild(newTab);
    li.appendChild(snippet);
    list.appendChild(li);
  }
}

const form = document.querySelector("form.search-bar");
const input = document.getElementById("q");
form?.addEventListener("submit", (e) => {
  const v = input.value.trim();
  if (!v) return;
  if (BAD_WORDS.some(w => normalize(v).split(" ").includes(normalize(w)))) {
    e.preventDefault();
    location.href = `blocked.html?q=${encodeURIComponent(v)}`;
  }
});