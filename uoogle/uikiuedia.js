const params = new URLSearchParams(location.search);
const topic = (params.get("q") || "Dogs").trim();
document.title = `Uikiuedia — ${topic}`;
const loading = document.getElementById("loading");
const article = document.getElementById("article");

(async function run() {
  try {
    const completion = await websim.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Respond with JSON only for a concise encyclopedia-style article.
{
  "title": string,
  "summary": string,
  "sections": [{"heading": string, "content": string}] ,
  "references": [{"title": string, "url": string}]
}
Keep it family-friendly, dog-focused when applicable, and factual.`,
        },
        { role: "user", content: [{ type: "text", text: topic }], json: true },
      ],
    });
    let data = {};
    try { data = JSON.parse(completion.content); } catch {}
    render(data && data.title ? data : fallback(topic));
  } catch {
    render(fallback(topic));
  }
})();

function render(d) {
  loading.style.display = "none";
  article.style.display = "block";
  article.innerHTML = "";

  const h1 = el("h1", null, d.title);
  const p = el("p", { style: "color:#4d5156;" }, d.summary);
  article.append(h1, p);

  if (Array.isArray(d.sections)) {
    d.sections.forEach(s => {
      const h2 = el("h2", null, s.heading);
      const c = el("p", null, s.content);
      article.append(h2, c);
    });
  }

  if (Array.isArray(d.references) && d.references.length) {
    const h3 = el("h3", null, "References");
    const ul = el("ul");
    d.references.forEach(r => {
      const li = el("li");
      const a = el("a", { href: r.url, target: "_blank", rel: "noopener" }, r.title || r.url);
      li.append(a); ul.append(li);
    });
    article.append(h3, ul);
  }
}

function el(tag, attrs = null, text = null) {
  const e = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
  if (text) e.textContent = text;
  return e;
}

function fallback(q) {
  return {
    title: q,
    summary: `Overview of ${q}.`,
    sections: [
      { heading: "Background", content: `Basic information about ${q}.` },
      { heading: "Relevance to Dogs", content: `How ${q} relates to dogs, training, care, or behavior.` },
    ],
    references: [],
  };
}