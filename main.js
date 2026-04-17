// ===== Конфигурация навигации =====
// Чтобы добавить новую дисциплину — добавьте один объект в массив ниже.
// Страница появится во всех остальных страницах автоматически.
const NAV_CONFIG = [
  { label: "Главная",              href: "index.html",                  icon: "⌂"  },
  {
    label: "Мобильная разработка", icon: "◎",
    children: [
      { label: "Android", href: "labs/android/index.html" },
      { label: "Flutter", href: "labs/flutter/index.html" },
    ],
  },
  { label: "ИСРПО",  href: "labs/isrpo/index.html",        icon: "⚙"  },
  { label: "3D",     href: "labs/modeling/index.html",      icon: "◈"  },
  { label: "ААС",    href: "labs/architecture/index.html",  icon: "⬡"  },
  { label: "АП",     href: "labs/algorithms/index.html",    icon: "λ"  },
  { label: "Контакты", href: "contacts.html",               icon: "✉"  },
];

// ===== Построение навигации =====
function buildNav() {
  const ul = document.getElementById("main-nav");
  if (!ul) return;

  const root = document.documentElement.dataset.root || ".";

  // Строит абсолютный href из пути относительно корня сайта
  function resolveHref(href) {
    const a = document.createElement("a");
    a.href = root + "/" + href;
    return a.href;
  }

  // Сравнивает href с текущей страницей
  function isCurrent(href) {
    const resolved = resolveHref(href);
    const current = window.location.href.split("?")[0].split("#")[0];
    return (
      resolved === current || resolved.replace(/\/index\.html$/, "/") === current || current.replace(/\/index\.html$/, "/") === resolved
    );
  }

  NAV_CONFIG.forEach((item) => {
    const li = document.createElement("li");

    if (item.children) {
      li.classList.add("dropdown");

      const a = document.createElement("a");
      a.href = "#";
      a.className = "dropdown-toggle";
      if (item.icon) {
        const ic = document.createElement("span");
        ic.className = "nav-icon";
        ic.textContent = item.icon;
        a.appendChild(ic);
      }
      a.appendChild(document.createTextNode(item.label));
      li.appendChild(a);

      const subUl = document.createElement("ul");
      subUl.className = "dropdown-menu";

      item.children.forEach((child) => {
        const subLi = document.createElement("li");
        const subA = document.createElement("a");
        const cur = isCurrent(child.href);
        subA.href = cur ? "#" : resolveHref(child.href);
        subA.textContent = child.label;
        if (cur) subA.classList.add("active");
        subLi.appendChild(subA);
        subUl.appendChild(subLi);
      });

      li.appendChild(subUl);
    } else {
      const a = document.createElement("a");
      const cur = isCurrent(item.href);
      a.href = cur ? "#" : resolveHref(item.href);
      if (item.icon) {
        const ic = document.createElement("span");
        ic.className = "nav-icon";
        ic.textContent = item.icon;
        a.appendChild(ic);
      }
      a.appendChild(document.createTextNode(item.label));
      if (cur) a.classList.add("active");
      li.appendChild(a);
    }

    ul.appendChild(li);
  });
}

// ===== Переходы между страницами =====
function initPageTransitions() {
  // Fade-in при загрузке: ставим opacity 0 сразу,
  // затем двойной rAF гарантирует что браузер успел зафиксировать стиль до анимации
  document.body.style.opacity = "0";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = "";
    });
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");

    // Пропускаем: модифицированные клики, новая вкладка, скачивание,
    // якорные ссылки, спецпротоколы, активная страница
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === "_blank") return;
    if (link.hasAttribute("download")) return;
    if (link.classList.contains("active")) return;
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;

    e.preventDefault();
    const dest = link.href;
    document.body.style.opacity = "0";
    setTimeout(() => { window.location.href = dest; }, 260);
  });
}

// ===== Прогресс-трекер =====
function initProgressTracker() {
  const cards = document.querySelectorAll(".lab-card");
  if (!cards.length) return;

  const storageKey = "itlabs_progress_" + location.pathname;
  const saved = JSON.parse(localStorage.getItem(storageKey) || "{}");

  // Вставляем сводку перед .labs-list или перед первой карточкой
  const anchor = document.querySelector(".labs-list") || cards[0];
  const summary = document.createElement("div");
  summary.className = "progress-summary";
  anchor.insertAdjacentElement("beforebegin", summary);

  function updateSummary() {
    const done = document.querySelectorAll(".lab-card--done").length;
    const total = cards.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    const allDone = done === total;
    summary.innerHTML =
      `<div class="progress-text">` +
        `<span class="progress-label">Прогресс</span>` +
        `<span class="progress-count${allDone ? " progress-count--full" : ""}">${done}&thinsp;/&thinsp;${total}</span>` +
      `</div>` +
      `<div class="progress-bar-track">` +
        `<div class="progress-bar-fill" style="width:${pct}%"></div>` +
      `</div>`;
  }

  cards.forEach((card, i) => {
    card.classList.add("lab-card--trackable");

    const btn = document.createElement("button");
    btn.className = "lab-check";
    btn.setAttribute("aria-label", "Отметить как выполненную");
    btn.setAttribute("title", "Отметить / снять отметку");
    btn.textContent = "✓";
    card.appendChild(btn);

    if (saved[i]) card.classList.add("lab-card--done");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isDone = card.classList.toggle("lab-card--done");
      if (isDone) {
        saved[i] = true;
      } else {
        delete saved[i];
      }
      localStorage.setItem(storageKey, JSON.stringify(saved));
      updateSummary();
    });
  });

  updateSummary();
}

// ===== Scroll-to-top =====
function initScrollTop() {
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.setAttribute("aria-label", "Наверх");
  btn.textContent = "↑";
  document.body.appendChild(btn);

  window.addEventListener("scroll", () => {
    btn.classList.toggle("scroll-top--visible", window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ===== Анимация карточек =====
function initCardAnimations() {
  const cards = document.querySelectorAll(".lab-card, .specialty-card");
  if (!cards.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      card.classList.add("card--visible");
      card.addEventListener("animationend", () => {
        card.classList.remove("card--hidden", "card--visible");
      }, { once: true });
      observer.unobserve(card);
    });
  }, { threshold: 0.07 });

  cards.forEach((card) => {
    card.classList.add("card--hidden");
    observer.observe(card);
  });
}

// ===== Тема =====
function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.dataset.theme = saved;

  const btn = document.createElement("button");
  btn.className = "theme-toggle";
  btn.setAttribute("aria-label", "Переключить тему");
  btn.textContent = saved === "light" ? "☾" : "☀";

  btn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    btn.textContent = next === "light" ? "☾" : "☀";
  });

  const container = document.querySelector("header .container");
  if (container) container.appendChild(btn);
}

// ===== Инициализация =====
document.addEventListener("DOMContentLoaded", () => {
  initPageTransitions();
  initTheme();
  buildNav();
  initProgressTracker();
  initCardAnimations();
  initScrollTop();

  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    const link = dropdown.querySelector("a");
    link.addEventListener("click", (e) => {
      e.preventDefault();
      dropdowns.forEach((d) => {
        if (d !== dropdown) d.classList.remove("active");
      });
      dropdown.classList.toggle("active");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      dropdowns.forEach((d) => d.classList.remove("active"));
    }
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const mainMenu = document.querySelector(".main-menu");
  if (menuToggle && mainMenu) {
    menuToggle.addEventListener("click", () => mainMenu.classList.toggle("open"));
  }
});
