"use strict";

/* =========================================================
   STILO BIJUTERIAS
   Conteúdo local, sem banco de dados e sem painel administrativo.
   Edite as informações abaixo para atualizar o site.
   ========================================================= */

/* 1. DADOS DA MARCA
   Use o número do WhatsApp com código do país + DDD + número,
   sem espaços, parênteses, traços ou o sinal de +.
*/
const SITE = {
  name: "Stilo Bijuterias",
  tagline: "Detalhes que contam histórias.",
  email: "contato@stilobijuterias.com.br",
  whatsapp: "", // Exemplo de formato: 5511999999999
  instagram: "https://www.instagram.com/",
};

/* 2. PRODUTOS
   Para cadastrar uma peça, copie um objeto e altere os valores.
   As imagens devem ficar dentro da pasta images/.
*/
const PRODUCTS = [
  {
    slug: "colar-dourado",
    name: "Colar Dourado",
    category: "Colares",
    description: "Uma peça delicada para complementar diferentes estilos.",
    price: "Consulte o valor",
    image: "images/colar-dourado.jpg",
    featured: true,
  },
  {
    slug: "brincos-organicos",
    name: "Brincos Orgânicos",
    category: "Brincos",
    description: "Formas marcantes com uma estética contemporânea.",
    price: "Consulte o valor",
    image: "images/brincos-organicos.jpg",
    featured: true,
  },
  {
    slug: "pulseira-minimalista",
    name: "Pulseira Minimalista",
    category: "Pulseiras",
    description: "Um detalhe discreto para acompanhar o dia a dia.",
    price: "Consulte o valor",
    image: "images/pulseira-minimalista.jpg",
    featured: true,
  },
  {
    slug: "anel-contemporaneo",
    name: "Anel Contemporâneo",
    category: "Anéis",
    description: "Design versátil para composições cheias de personalidade.",
    price: "Consulte o valor",
    image: "images/anel-contemporaneo.jpg",
    featured: false,
  },
];

/* 3. ARTIGOS DO JOURNAL
   Cada artigo pode ter vários parágrafos no array content.
   Para adicionar outro artigo, copie um objeto completo.
*/
const POSTS = [
  {
    slug: "como-combinar-acessorios",
    title: "A arte de combinar acessórios",
    excerpt:
      "Pequenos detalhes podem transformar uma produção simples em algo especial.",
    date: "2026-01-15",
    category: "Estilo",
    image: "images/journal-acessorios.jpg",
    content: [
      "Os acessórios são uma forma de expressar personalidade sem precisar mudar todo o guarda-roupa.",
      "Experimente combinar peças delicadas com elementos de maior destaque. O equilíbrio entre formas, texturas e cores ajuda a criar composições interessantes.",
      "Mais importante do que seguir regras é escolher peças que façam sentido para você e para cada ocasião.",
    ],
  },
  {
    slug: "acessorios-para-todos-os-dias",
    title: "Acessórios para acompanhar sua rotina",
    excerpt:
      "Ideias para escolher peças versáteis que funcionam em diferentes momentos.",
    date: "2026-02-02",
    category: "Inspiração",
    image: "images/journal-rotina.jpg",
    content: [
      "Peças versáteis ajudam a criar combinações práticas para o cotidiano.",
      "Colares discretos, brincos confortáveis e pulseiras simples podem acompanhar diferentes estilos e ocasiões.",
      "Escolha acessórios que combinem com sua rotina e cuide de cada peça conforme as orientações de conservação.",
    ],
  },
];

/* =========================================================
   FUNÇÕES AUXILIARES
   ========================================================= */

/* Escapa textos antes de inseri-los no HTML. */
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

/* Cria uma data em português sem depender do formato regional do PC. */
function formatDate(dateString) {
  const parts = dateString.split("-").map(Number);

  if (
    parts.length !== 3 ||
    !parts[0] ||
    parts[1] < 1 ||
    parts[1] > 12 ||
    parts[2] < 1 ||
    parts[2] > 31
  ) {
    return "";
  }

  const date = new Date(parts[0], parts[1] - 1, parts[2]);

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* Normaliza a busca, ignorando maiúsculas e acentos. */
function normalizeText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* Cria um endereço de WhatsApp com mensagem inicial. */
function createWhatsAppURL(message) {
  const number = SITE.whatsapp.replace(/\D/g, "");

  if (!number) {
    return "";
  }

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/* =========================================================
   PRODUTOS E FILTROS
   ========================================================= */

function renderCategoryOptions() {
  const select = document.getElementById("product-filter");

  if (!select) return;

  const categories = [...new Set(PRODUCTS.map((product) => product.category))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  // Mantém a opção "Todas" e adiciona as categorias cadastradas.
  select.innerHTML =
    '<option value="Todas">Todas as categorias</option>' +
    categories
      .map(
        (category) =>
          `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`,
      )
      .join("");
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  const emptyMessage = document.getElementById("product-empty");
  const searchInput = document.getElementById("product-search");
  const filterSelect = document.getElementById("product-filter");

  if (!grid || !emptyMessage || !searchInput || !filterSelect) return;

  const query = normalizeText(searchInput.value);
  const selectedCategory = filterSelect.value;

  const filteredProducts = PRODUCTS.filter((product) => {
    const searchableText = normalizeText(
      `${product.name} ${product.category} ${product.description}`,
    );

    const matchesSearch = searchableText.includes(query);
    const matchesCategory =
      selectedCategory === "Todas" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  grid.innerHTML = filteredProducts
    .map((product) => {
      const message = `Olá! Gostaria de saber mais sobre ${product.name}.`;
      const whatsappURL = createWhatsAppURL(message);

      return `
        <article class="product-card">
          <div class="product-image">
            <img
              src="${escapeHTML(product.image)}"
              alt="${escapeHTML(product.name)}"
              loading="lazy"
              data-fallback="${escapeHTML(product.name)}"
            >
          </div>

          <div class="product-info">
            <p class="eyebrow">${escapeHTML(product.category)}</p>
            <h3>${escapeHTML(product.name)}</h3>
            <p>${escapeHTML(product.description)}</p>
            <span class="product-price">${escapeHTML(product.price)}</span>

            ${
              whatsappURL
                ? `<a
                    class="product-contact"
                    href="${escapeHTML(whatsappURL)}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >Consultar pelo WhatsApp ↗</a>`
                : `<a class="product-contact" href="#contato">
                    Consultar disponibilidade ↗
                  </a>`
            }
          </div>
        </article>
      `;
    })
    .join("");

  emptyMessage.hidden = filteredProducts.length > 0;

  // Trata imagens depois de inserir os cartões no documento.
  setupImageFallbacks(grid);
}

/* =========================================================
   JOURNAL E LEITURA DOS ARTIGOS
   ========================================================= */

function renderPosts() {
  const grid = document.getElementById("post-grid");
  const emptyMessage = document.getElementById("post-empty");

  if (!grid || !emptyMessage) return;

  // Apresenta os artigos mais recentes primeiro.
  const orderedPosts = [...POSTS].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  grid.innerHTML = orderedPosts
    .map(
      (post) => `
        <article class="post-card">
          <a
            class="post-image"
            href="#artigo-${escapeHTML(post.slug)}"
            data-open-article="${escapeHTML(post.slug)}"
            aria-label="Ler artigo: ${escapeHTML(post.title)}"
          >
            <img
              src="${escapeHTML(post.image)}"
              alt=""
              loading="lazy"
              data-fallback="${escapeHTML(post.title)}"
            >
          </a>

          <div class="post-info">
            <p class="eyebrow">
              ${escapeHTML(post.category)} · ${escapeHTML(formatDate(post.date))}
            </p>

            <h3>
              <a
                href="#artigo-${escapeHTML(post.slug)}"
                data-open-article="${escapeHTML(post.slug)}"
              >${escapeHTML(post.title)}</a>
            </h3>

            <p>${escapeHTML(post.excerpt)}</p>

            <a
              class="text-link"
              href="#artigo-${escapeHTML(post.slug)}"
              data-open-article="${escapeHTML(post.slug)}"
            >Ler artigo ↗</a>
          </div>
        </article>
      `,
    )
    .join("");

  emptyMessage.hidden = orderedPosts.length > 0;

  setupImageFallbacks(grid);
}

function openArticle(slug) {
  const post = POSTS.find((item) => item.slug === slug);

  if (!post) return;

  const section = document.getElementById("article-section");
  const detail = document.getElementById("article-detail");

  if (!section || !detail) return;

  detail.innerHTML = `
    <header class="article-header">
      <p class="eyebrow">${escapeHTML(post.category)}</p>
      <h2>${escapeHTML(post.title)}</h2>
      <p class="article-excerpt">${escapeHTML(post.excerpt)}</p>
      <p class="article-date">${escapeHTML(formatDate(post.date))}</p>
    </header>

    <div class="article-image">
      <img
        src="${escapeHTML(post.image)}"
        alt="${escapeHTML(post.title)}"
        data-fallback="${escapeHTML(post.title)}"
      >
    </div>

    <div class="article-content">
      ${post.content
        .map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`)
        .join("")}
    </div>
  `;

  section.hidden = false;

  setupImageFallbacks(detail);

  // Mostra o início do artigo sem recarregar a página.
  section.scrollIntoView({ behavior: "smooth", block: "start" });

  // Atualiza o fragmento da URL para facilitar o compartilhamento local.
  history.replaceState(null, "", `#artigo-${encodeURIComponent(post.slug)}`);
}

function closeArticle() {
  const section = document.getElementById("article-section");

  if (section) {
    section.hidden = true;
  }

  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );

  document.getElementById("journal")?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/* =========================================================
   IMAGENS AUSENTES
   Se a foto não existir, mostra um espaço visual neutro.
   ========================================================= */

function setupImageFallbacks(root = document) {
  const images = root.querySelectorAll("img[data-fallback]");

  images.forEach((img) => {
    // Evita registrar o mesmo tratamento mais de uma vez.
    if (img.dataset.fallbackReady === "true") return;

    img.dataset.fallbackReady = "true";

    img.addEventListener("error", () => {
      const placeholder = document.createElement("div");

      placeholder.className = "image-placeholder";
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute(
        "aria-label",
        img.dataset.fallback || "Imagem indisponível",
      );
      placeholder.textContent = img.dataset.fallback || "Stilo Bijuterias";

      // Substitui apenas a imagem que não carregou.
      img.replaceWith(placeholder);
    }, { once: true });

    // Trata o caso em que a imagem falhou antes do evento ser registrado.
    if (img.complete && img.naturalWidth === 0) {
      img.dispatchEvent(new Event("error"));
    }
  });
}

/* =========================================================
   CONTATO E REDES SOCIAIS
   ========================================================= */

function setupContact() {
  const whatsappLink = document.getElementById("whatsapp-link");
  const emailLink = document.getElementById("email-link");
  const instagramLink = document.getElementById("instagram-link");
  const note = document.getElementById("contact-note");

  const whatsappURL = createWhatsAppURL(
    `Olá! Gostaria de conhecer as peças da ${SITE.name}.`,
  );

  if (whatsappLink) {
    if (whatsappURL) {
      whatsappLink.href = whatsappURL;
    } else {
      // Mantém o usuário informado se o número não foi configurado.
      whatsappLink.href = "#contato";
      whatsappLink.addEventListener("click", (event) => {
        event.preventDefault();

        if (note) {
          note.textContent =
            "Configure o número de WhatsApp no início do arquivo script.js.";
        }
      });
    }
  }

  if (emailLink) {
    emailLink.href = `mailto:${SITE.email}`;
    emailLink.textContent = `${SITE.email} ↗`;
  }

  if (instagramLink && SITE.instagram) {
    instagramLink.href = SITE.instagram;
  }

  const copyright = document.getElementById("copyright");

  if (copyright) {
    copyright.textContent =
      `© ${new Date().getFullYear()} ${SITE.name}. Todos os direitos reservados.`;
  }

  document.querySelectorAll(".brand").forEach((brand) => {
    // Atualiza o nome da marca nos links que já existem no HTML.
    brand.innerHTML =
      `${escapeHTML(SITE.name.split(" ")[0])} ` +
      `<span>${escapeHTML(SITE.name.split(" ").slice(1).join(" "))}</span>`;
  });
}

/* =========================================================
   MENU PARA DISPOSITIVOS MÓVEIS
   ========================================================= */

function setupMobileMenu() {
  const button = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");

  if (!button || !nav) return;

  function closeMenu() {
    nav.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu");
  }

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");

    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu" : "Abrir menu",
    );
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fecha o menu com Escape para facilitar a navegação pelo teclado.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderCategoryOptions();
  renderProducts();
  renderPosts();
  setupContact();
  setupMobileMenu();
  setupImageFallbacks();

  // Permite pesquisar produtos enquanto o usuário digita.
  document.getElementById("product-search")?.addEventListener(
    "input",
    renderProducts,
  );

  document.getElementById("product-filter")?.addEventListener(
    "change",
    renderProducts,
  );

  // Abre os artigos usando delegação de eventos.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-open-article]");

    if (!link) return;

    event.preventDefault();
    openArticle(link.dataset.openArticle);
  });

  document.getElementById("article-back")?.addEventListener(
    "click",
    closeArticle,
  );
});