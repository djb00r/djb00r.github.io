const params = new URLSearchParams(location.search);
const q = (params.get("q") || "").trim();
const grid = document.getElementById("imageGrid");

/* Easter egg triggers for image search too */
const EASTER_EGGS = ["uoogle", "og", "2021 uoogle", "uoogle in 2021", "uoogle 2021", "uoogle scratch", "scratch uoogle", "scratch", "classic", "2021", "classic uoogle", "uoogle classi", "dognett", "easter egg", "easteregg"];
function normalize(q) {
  return (q || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z\s]/g," ").replace(/\s+/g," ").trim();
}
if (q && EASTER_EGGS.includes(normalize(q))) {
  // show classic uoogle as the top (first) result link instead of auto-opening a popup
  grid.innerHTML = `<div class="card" style="padding:1rem;"><div style="font-weight:700;margin-bottom:.5rem;">Classic Uoogle (first result)</div><div><a href="uoogle.html" target="_blank" rel="noopener">Open classic Uoogle</a></div></div>`;
} else {
  if (!q) {
    grid.innerHTML = `<p>No query provided.</p>`;
  } else {
    loadImages(q);
  }
}

async function loadImages(query) {
  grid.innerHTML = `<p>Loading images…</p>`;
  try {
    const api = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=40&prop=pageimages|info&inprop=url&piprop=thumbnail&pithumbsize=400`;
    const res = await fetch(api);
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const items = Object.values(pages)
      .filter(p => p.thumbnail && p.thumbnail.source)
      .map(p => ({
        title: p.title,
        thumb: p.thumbnail.source,
        url: p.fullurl || `https://en.wikipedia.org/?curid=${p.pageid}`
      }));
    render(items);
  } catch (e) {
    console.error(e);
    grid.innerHTML = `<p>Failed to load images.</p>`;
  }
}

function render(items) {
  grid.innerHTML = "";
  if (!items.length) {
    grid.innerHTML = `<p>No images found.</p>`;
    return;
  }
  items.forEach(it => {
    const card = document.createElement("div");
    card.className = "card";
    const img = document.createElement("img");
    img.src = it.thumb;
    img.alt = it.title;
    const meta = document.createElement("div");
    meta.className = "meta";
    const name = document.createElement("span");
    name.textContent = it.title;
    const a = document.createElement("a");
    a.href = it.url; a.target = "_blank"; a.rel = "noopener"; a.className = "open"; a.textContent = "Open";
    meta.append(name, a);
    card.append(img, meta);
    grid.appendChild(card);
  });
}