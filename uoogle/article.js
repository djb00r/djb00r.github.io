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
          content: `Respond with JSON only for a concise Uikiuedia article.
{
  "title": string,
  "summary": string,
  "sections": [{"heading": string, "content": string}]
}
Family-friendly, dog-focused when applicable.`,
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

  const hero = el("img", { src: "dog.png", alt: "Article image", style: "width:96px;height:96px;display:block;margin:0 auto 1rem;" });
  const h1 = el("h1", null, d.title);
  const p = el("p", { style: "color:#4d5156;" }, d.summary);
  article.append(hero, h1, p);

  if (Array.isArray(d.sections)) {
    d.sections.forEach(s => {
      const h2 = el("h2", null, s.heading);
      const c = el("p", null, s.content);
      article.append(h2, c);
    });
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
    summary: `Overview of ${q} for dog owners.`,
    sections: [
      { heading: "Background", content: `Key facts about ${q}.` },
      { heading: "Relevance to Dogs", content: `How ${q} relates to dogs, training, care, or behavior.` },
    ],
  };
}