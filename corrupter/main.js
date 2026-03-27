// Suppress wake lock errors and safely no-op requests
window.addEventListener('unhandledrejection', (e) => {
  if (String(e.reason?.message || e.reason).includes('Wake Lock') || e.reason?.name === 'NotAllowedError') e.preventDefault();
});
if (navigator.wakeLock?.request) {
  const _req = navigator.wakeLock.request.bind(navigator.wakeLock);
  navigator.wakeLock.request = async (...a) => { try { return await _req(...a); } catch (err) { if (err?.name === 'NotAllowedError' || String(err.message || err).includes('Wake Lock')) return { released: true, release(){} }; throw err; } };
}

// Initialize EmulatorJS
const ROM_PATH = "/Super Mario World (USA).sfc";
const LIBRARY = [
  { name: "Super Mario World (default)", path: "/Super Mario World (USA).sfc", core: "snes" },
  { name: "Super Mario Kart", path: "/Super Mario Kart (U) [!].smc", core: "snes" },
  { name: "Star Fox", path: "/Star Fox (USA) (Rev 2).sfc", core: "snes" },
  { name: "Donkey Kong Country 3", path: "/Donkey Kong Country 3 - Dixie Kong's Double Trouble! (USA) (En,Fr).sfc", core: "snes" },
  { name: "Mario Paint", path: "/Mario Paint (JU) [h1] (Joystick).smc", core: "snes" },
  { name: "Super Mario Bros.", path: "/supermariobros.nes", core: "nes" },
  { name: "Super Mario Bros. (Alt)", path: "/supermariobros (1).nes", core: "nes" },
  { name: "Super Mario Bros. 3", path: "/supermariobros3.nes", core: "nes" },
  { name: "Super Mario Land 2", path: "/Super Mario Land 2 - 6 Golden Coins (UE) (V1.2) [!].gb", core: "gb" },
  { name: "Tetris", path: "/Tetris.gb", core: "gb" },
  { name: "Pokémon Red", path: "/Pokemon Red.gb", core: "gb" },
  { name: "Pokémon Leaf Green", path: "/Pokemon Leaf Green.gba", core: "gba" },
  { name: "Sonic The Hedgehog", path: "/Sonic The Hedgehog (USA, Europe).bin", core: "segaMD" },
  { name: "Hotel Mario", path: "/Hotel Mario (CD-i).iso", core: "cdi" },
];

// Configure EmulatorJS globals before it boots
window.EJS_player = "#game";
window.EJS_core = "snes";
window.EJS_gameUrl = ROM_PATH;
window.EJS_pathtodata = "https://cdn.emulatorjs.org/latest/data/";
window.EJS_startOnLoaded = true;
window.EJS_disableMenus = false; // keep built-in menu available
window.EJS_fullscreenOnLoad = false;

// UI controls
const controlsBtn = document.getElementById("controlsBtn");
const resetBtn = document.getElementById("resetBtn");
const dlg = document.getElementById("controlsDialog");
const closeDialog = document.getElementById("closeDialog");
const bookBtn = document.getElementById("bookBtn");
const bookDialog = document.getElementById("bookDialog");
const closeBookDialog = document.getElementById("closeBookDialog");
const uploadBtn = document.getElementById("uploadBtn");
const uploadDialog = document.getElementById("uploadDialog");
const uploadTitle = document.getElementById("uploadTitle");
const uploadConfirm = document.getElementById("uploadConfirm");
const uploadCancel = document.getElementById("uploadCancel");
const uploadClose = document.getElementById("uploadClose");
const loadDialog = document.getElementById("loadConsoleDialog");
const loadConfirm = document.getElementById("loadConfirm");
const loadCancel = document.getElementById("loadCancel");
const loadClose = document.getElementById("loadClose");

controlsBtn.addEventListener("click", () => {
  try { dlg.showModal(); } catch { /* fallback */ }
});
closeDialog.addEventListener("click", () => dlg.close());
dlg.addEventListener("click", (e) => {
  if (e.target === dlg) dlg.close();
});
bookBtn.addEventListener("click", () => { try { bookDialog.showModal(); } catch {} refreshBookList(); });
closeBookDialog.addEventListener("click", () => bookDialog.close());

// Reset: simple page reload for a clean emulator state
resetBtn.addEventListener("click", () => {
  // Try emulator reset if available; fall back to page reload
  const emu = window.EJS_emulator;
  if (emu && typeof emu.reset === "function") {
    try { emu.reset(); return; } catch { /* ignore and reload */ }
  }
  location.reload();
});

// Prevent page scrolling when using arrow keys/space during gameplay
window.addEventListener("keydown", (e) => {
  const keys = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "];
  const t = (e.target?.tagName || "").toLowerCase();
  if (t === "input" || t === "textarea" || e.target?.isContentEditable) return;
  if (keys.includes(e.key)) e.preventDefault();
}, { passive: false });

// helper to load EmulatorJS script after globals are set
function loadEmulatorScript() {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = "https://cdn.emulatorjs.org/latest/data/loader.js";
    s.onload = resolve; s.onerror = reject; s.dataset.ejs = "loader";
    document.body.appendChild(s);
  });
}

// Corrupt ROM bytes
async function buildCorruptedROM({ seed, count, baseBuffer, core }) {
  const buf = baseBuffer || await (await fetch(ROM_PATH)).arrayBuffer();
  const u8 = new Uint8Array(buf.slice(0));
  const rand = rngFromSeed(seed);
  const offset = core === "segaMD" ? 0x200 : 0; // skip header for Genesis
  const n = Math.max(1, count | 0), len = Math.max(1, u8.length - offset);
  for (let i = 0; i < n; i++) { const idx = offset + Math.floor(rand() * len); u8[idx] = Math.floor(rand() * 256); }
  return new Blob([u8], { type: "application/octet-stream" });
}

// Stronger single-instance boot guard
let bootToken = 0;
async function bootWithGameUrl(url, core = "snes") {
  const token = ++bootToken;
  await destroyEmulator();
  if (token !== bootToken) return;
  window.EJS_core = mapCoreForEmulator(core);
  window.EJS_gameUrl = url;
  await loadEmulatorScript();
}

// Destroy emulator
async function destroyEmulator() {
  try { await window.EJS_emulator?.stop?.(); } catch {}
  try { await window.EJS_emulator?.pause?.(); } catch {}
  try { window.EJS_emulator = null; } catch {}
  try { window.Module?.SDL2?.audioContext?.close?.(); } catch {}
  const container = document.querySelector(window.EJS_player);
  if (container) {
    const fresh = container.cloneNode(false);
    container.replaceWith(fresh);
    window.EJS_player = "#" + (fresh.id = "game"); // ensure selector still valid
  }
  document.querySelectorAll('script[data-ejs="loader"]').forEach(n => n.remove());
  await new Promise(r => setTimeout(r, 50));
}

// Upload to shared Corrupt Book
uploadBtn.addEventListener("click", async () => {
  uploadBtn.disabled = true;
  try {
    await ensureDefaultBase();
    const seed = seedInput.value.trim();
    const count = Math.max(1, parseInt(bytesInput.value, 10) || 75);
    const suggest = (currentBaseName||'ROM').replace(/\.[a-z0-9]+$/i,'') + (seed?` • ${seed}`:'');
    const meta = await askUploadMeta(suggest); if(!meta) return;
    const blob = await buildCorruptedROM({ seed, count, baseBuffer: currentBaseROM, core: currentBaseCore });
    const file = new File([blob], `${(meta.title||currentBaseName||'ROM').replace(/\s+/g,'_')}.bin`, { type: 'application/octet-stream' });
    const url = await websim.upload(file);
    await room.collection('corruption_v1').create({
      title: meta.title || null,
      base_name: currentBaseName,
      seed, count, size: blob.size, url,
      core: meta.core || currentBaseCore
    });
    if (bookDialog.open) refreshBookList();
  } catch (e) { console.error(e); }
  finally { uploadBtn.disabled = false; }
});

// Ensure default base ROM
let currentBaseROM = null;
let currentBaseName = "Super Mario World (USA).sfc";
let currentBaseCore = "snes";
async function ensureDefaultBase() {
  if (!currentBaseROM) {
    const res = await fetch(ROM_PATH);
    currentBaseROM = await res.arrayBuffer();
    currentBaseName = "Super Mario World (USA).sfc";
    currentBaseCore = "snes";
  }
}

// Form handling for corruption
const form = document.getElementById("corruptForm");
const seedInput = document.getElementById("seedInput");
const bytesInput = document.getElementById("bytesInput");
const fileInput = document.getElementById("romFileInput");

fileInput.addEventListener("change", async () => {
  const f = fileInput.files?.[0];
  if (!f) return;
  currentBaseROM = await f.arrayBuffer();
  currentBaseName = f.name || "Imported ROM";
  currentBaseCore = detectCore(currentBaseName);
  const chosen = await askLoadCore(currentBaseCore);
  if (chosen) currentBaseCore = chosen;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  await ensureDefaultBase();
  const seed = seedInput.value.trim();
  const count = Math.max(1, parseInt(bytesInput.value, 10) || 75);
  const blob = await buildCorruptedROM({ seed, count, baseBuffer: currentBaseROM, core: currentBaseCore });
  await bootWithGameUrl(URL.createObjectURL(blob), currentBaseCore);
});

// Websim shared database setup
const room = new WebsimSocket();
const PAGE_SIZE = 10;

// Replace local IndexedDB-backed Corrupt Book with shared records + pagination
let currentPage = 1;
async function refreshBookList() {
  const list = document.getElementById("bookList");
  const pageInfo = document.getElementById("pageInfo");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  const items = room.collection('corruption_v1').getList() || [];
  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  currentPage = Math.min(Math.max(1, currentPage), pages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = items.slice(start, start + PAGE_SIZE);

  list.innerHTML = "";
  for (const it of slice) {
    const li = document.createElement("li");
    const title = document.createElement("div");
    const who = it.username ? ` • by @${it.username}` : "";
    const icon=document.createElement("span"); icon.className="console-icon";
    const img=document.createElement("img"); img.alt=(it.core==="nes"?"NES":it.core==="gb"?"Game Boy":it.core==="segaMD"?"Genesis":"SNES");
    img.src=getIconForCore(it.core); icon.appendChild(img);
    title.innerHTML=""; title.appendChild(icon);
    const t=document.createElement("span"); t.textContent=` ${(it.title||it.base_name||'ROM')} • ${it.count} bytes • seed "${it.seed||"random"}"${who}`; title.appendChild(t);
    const meta = document.createElement("div"); meta.className = "meta"; meta.textContent = new Date(it.created_at || Date.now()).toLocaleString();
    const loadBtn = document.createElement("button"); loadBtn.className = "btn"; loadBtn.textContent = "Load";
    loadBtn.addEventListener("click", async () => { await bootWithGameUrl(it.url, it.core || detectCore(it.base_name)); });
    li.appendChild(title); li.appendChild(loadBtn); li.appendChild(meta); list.appendChild(li);
  }

  pageInfo.textContent = `Page ${currentPage} / ${pages}`;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= pages;

  // wire once
  if (!prevBtn.dataset.wired) {
    prevBtn.dataset.wired = "1";
    prevBtn.addEventListener("click", () => { currentPage = Math.max(1, currentPage - 1); refreshBookList(); });
    nextBtn.addEventListener("click", () => { currentPage = currentPage + 1; refreshBookList(); });
    room.collection('corruption_v1').subscribe(() => { refreshBookList(); });
  }
}

// Library cache and rendering
const libCache = new Map();
function renderLibrary() {
  const el = document.getElementById("gameLib"); if (!el) return;
  el.innerHTML = ""; LIBRARY.forEach(item => {
    const li = document.createElement("li");
    const icon = document.createElement("span"); icon.className = "console-icon";
    const img = document.createElement("img"); img.alt = (item.core==="nes"?"NES":item.core==="gb"?"Game Boy":item.core==="gba"?"GBA":item.core==="segaMD"?"Genesis":"SNES");
    img.src = getIconForCore(item.core); icon.appendChild(img);
    const title = document.createElement("div"); title.textContent = item.name;
    const btn = document.createElement("button"); btn.className = "btn btn-outline"; btn.textContent = "Load as corrupter";
    btn.addEventListener("click", async () => {
      try {
        if (!libCache.has(item.path)) {
          const res = await fetch(item.path);
          if (!res.ok) { btn.textContent = "ROM missing"; btn.disabled = true; alert('This ROM is not included. Upload your own via "Base ROM" and select GBA.'); return; }
          libCache.set(item.path, await res.arrayBuffer());
        }
      } catch (err) { btn.textContent = "ROM missing"; btn.disabled = true; alert('This ROM is not included. Upload your own via "Base ROM" and select GBA.'); return; }
      currentBaseROM = libCache.get(item.path); currentBaseName = item.path.split("/").pop(); currentBaseCore = item.core;
      btn.textContent = "Selected ✓"; setTimeout(()=>btn.textContent="Load as corrupter", 1200);
    });
    li.appendChild(icon); li.appendChild(title); li.appendChild(btn); el.appendChild(li);
  });
}
renderLibrary();

// initial boot for default SNES game
loadEmulatorScript();

function getIconForCore(core){
  return core==="nes"?"/nes_controller.png":core==="gb"?"/gameboy.png":core==="gba"?"/gba.png":core==="segaMD"?"/genesis_controller.png":core==="cdi"?"/cd_icon.png":"/snes_controller.png";
}

// Seeded RNG (xorshift32) from string
function rngFromSeed(seedStr) {
  if (!seedStr) return () => Math.random();
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let x = (h || 0x9e3779b9) >>> 0;
  return () => {
    x ^= x << 13; x >>>= 0;
    x ^= x >>> 17; x >>>= 0;
    x ^= x << 5; x >>>= 0;
    return (x >>> 0) / 0xFFFFFFFF;
  };
}

function askUploadMeta(defaultTitle){return new Promise(res=>{uploadTitle.value=defaultTitle;try{uploadDialog.showModal();}catch{};const done=v=>{uploadConfirm.onclick=uploadCancel.onclick=uploadClose.onclick=null;uploadDialog.close();res(v)};uploadConfirm.onclick=()=>{const core=document.querySelector('input[name="uploadCore"]:checked')?.value||currentBaseCore;done({core,title:uploadTitle.value.trim()})};uploadCancel.onclick=uploadClose.onclick=()=>done(null);});}

function askLoadCore(defaultCore){return new Promise(res=>{try{loadDialog.querySelector(`input[value="${defaultCore}"]`)?.click();}catch{};try{loadDialog.showModal();}catch{};const done=v=>{loadConfirm.onclick=loadCancel.onclick=loadClose.onclick=null;loadDialog.close();res(v)};loadConfirm.onclick=()=>{const core=document.querySelector('input[name="loadCore"]:checked')?.value||defaultCore;done(core)};loadCancel.onclick=loadClose.onclick=()=>done(null);});}

function detectCore(name){
  const n = String(name||"").toLowerCase();
  if (n.endsWith(".sfc")||n.endsWith(".smc")) return "snes";
  if (n.endsWith(".nes")) return "nes";
  if (n.endsWith(".gb")||n.endsWith(".gbc")) return "gb";
  if (n.endsWith(".gba")) return "gba";
  if (n.endsWith(".iso")||n.endsWith(".cue")) return "cdi";
  if (n.endsWith(".md")||n.endsWith(".gen")||n.endsWith(".bin")) return "segaMD";
  return currentBaseCore || "snes";
}

function mapCoreForEmulator(core){
  return core==="cdi" ? "cdi-legacy" : core;
}

const tabs=[...document.querySelectorAll('#controlsDialog .tab')];
function setActiveTab(core){tabs.forEach(b=>{const on=b.dataset.core===core; b.setAttribute('aria-selected',on); const p=document.getElementById('tab-'+b.dataset.core); if(p) p.hidden=!on;});}
tabs.forEach(b=>b.addEventListener('click',()=>setActiveTab(b.dataset.core)));