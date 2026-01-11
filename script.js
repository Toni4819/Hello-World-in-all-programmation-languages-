const repoUser = "Toni4819";
const repoName = "Hello-World-in-all-programmation-languages";
const branch = "resources";

const cardsContainer = document.getElementById("cards");
const filterSelect = document.getElementById("filter");

async function loadFiles() {
  const apiURL = `https://api.github.com/repos/${repoUser}/${repoName}/contents?ref=${branch}`;
  const res = await fetch(apiURL);
  const files = await res.json();

  const languages = new Set();

  for (const file of files) {
    if (file.type !== "file") continue;

    const content = await fetch(file.download_url).then(r => r.text());
    const ext = file.name.split(".").pop().toLowerCase();

    languages.add(ext);
    createCard(file.name, content, ext);
  }

  updateFilter([...languages]);
}

function updateFilter(langs) {
  langs.sort().forEach(lang => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang.toUpperCase();
    filterSelect.appendChild(opt);
  });

  filterSelect.addEventListener("change", () => {
    const selected = filterSelect.value;
    document.querySelectorAll(".card").forEach(card => {
      card.style.display =
        selected === "all" || card.dataset.lang === selected
          ? "block"
          : "none";
    });
  });
}

function createCard(name, code, lang) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.lang = lang;

  const highlighted = Prism.highlight(
    code,
    Prism.languages[lang] || Prism.languages.markup,
    lang
  );

  card.innerHTML = `
    <h3>${name}</h3>
    <button class="copy-btn">Copy</button>
    <pre><code class="language-${lang}">${highlighted}</code></pre>
  `;

  card.querySelector(".copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(code);
  });

  cardsContainer.appendChild(card);
}

loadFiles();
