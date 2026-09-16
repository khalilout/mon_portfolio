const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setYear() {
  const el = qs("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === "light" || theme === "dark") html.dataset.theme = theme;
  else html.removeAttribute("data-theme");
}

function initTheme() {
  const stored = localStorage.getItem("theme");
  if (stored) applyTheme(stored);
  else applyTheme("dark");

  const btn = qs("[data-theme-toggle]");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    applyTheme(next);
  });
}

function initHeaderElevation() {
  const header = qs("[data-elevate]");
  if (!header) return;
  const onScroll = () => {
    header.dataset.elevated = window.scrollY > 6 ? "true" : "false";
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMenu() {
  const toggle = qs("[data-menu-toggle]");
  const mobile = qs("[data-mobile-menu]");
  if (!toggle || !mobile) return;

  const setOpen = (open) => {
    mobile.hidden = !open;
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  };

  let open = false;
  toggle.addEventListener("click", () => {
    open = !open;
    setOpen(open);
  });

  qsa("a", mobile).forEach((a) =>
    a.addEventListener("click", () => {
      open = false;
      setOpen(open);
    }),
  );

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && open) {
      open = false;
      setOpen(open);
    }
  });

  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth >= 860 && open) {
        open = false;
        setOpen(open);
      }
    },
    { passive: true },
  );
}

function initReveal() {
  const els = qsa(".reveal");
  if (!els.length) return;

  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("reveal--visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("reveal--visible");
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 },
  );

  els.forEach((el) => io.observe(el));
}

function initIcons() {
  const icons = {
    moon: "M21 14.5A8.5 8.5 0 0 1 9.5 3a6.8 6.8 0 1 0 11.5 11.5Z",
    pin: "M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z",
    cap: "M12 3 1 8l11 5 9-4.1V15h2V8L12 3Zm-7 9.2V16c0 2.2 3.1 4 7 4s7-1.8 7-4v-3.8l-7 3.2-7-3.2Z",
    car: "M3 13l1-4a3 3 0 0 1 3-2h10a3 3 0 0 1 3 2l1 4v6h-2a2 2 0 0 1-2-2H7a2 2 0 0 1-2 2H3v-6Zm4 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm10 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
    mail: "M4 6h16v12H4V6Zm8 7L4.8 7.7h14.4L12 13Z",
    phone: "M6 2h4l2 6-2.5 1.5A14 14 0 0 0 14.9 14.5L16.4 12 22 14v4c0 1.1-.9 2-2 2C10.1 20 4 13.9 4 6c0-1.1.9-2 2-2Z",
    linkedin:
      "M4 4.5A2.5 2.5 0 1 1 9 4.5 2.5 2.5 0 0 1 4 4.5ZM4.5 9H8v11H4.5V9Zm5.5 0h3.3v1.5h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8V20H18v-4.6c0-1.1 0-2.6-1.6-2.6s-1.9 1.2-1.9 2.5V20H10V9Z",
    flag: "M5 3h12l-1 3 1 3H5v12H3V3h2Z",
    lang: "M12 4v2h7v2h-2.1a12.7 12.7 0 0 1-2.6 6.1l2.4 2.4-1.4 1.4-2.4-2.4A12.6 12.6 0 0 1 9 19l-.7-1.9c1.7-.4 3.2-1.2 4.5-2.3a10.7 10.7 0 0 1-2.3-3.8H9V9h4V8H6V6h6V4Zm2.7 6a8.7 8.7 0 0 1-1.7 2.8A10.4 10.4 0 0 1 11.6 10h3.1ZM22 20h-2l-1.2-3h-4.6L13 20h-2l4.4-11h2.2L22 20Z",
    bolt: "M13 2 3 14h7l-1 8 10-12h-7l1-8Z",
    copy: "M9 9h10v12H9V9Zm-4-4h10v2H7v10H5V5Z",
    send: "M2 21 23 12 2 3v7l15 2-15 2v7Z",
    github:
      "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.001 10.001 0 0 0 22 12c0-5.52-4.48-10-10-10Z",
    external: "M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3ZM5 5h5v2H7v10h10v-3h2v5H5V5Z",
    play: "M8 5v14l11-7L8 5Z",
  };

  qsa("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    const path = icons[name];
    if (!path) return;
    const svg = `data:image/svg+xml,${encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='black'><path d='${path}'/></svg>`,
    )}`;
    el.style.webkitMaskImage = `url("${svg}")`;
    el.style.maskImage = `url("${svg}")`;
  });
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function initCopyButtons() {
  const status = qs("[data-copy-status]");
  qsa("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      const ok = await copyToClipboard(text);
      if (status) status.textContent = ok ? "Copié dans le presse‑papiers." : "Impossible de copier.";
      window.clearTimeout(btn.__t);
      btn.__t = window.setTimeout(() => {
        if (status) status.textContent = "";
      }, 1800);
    });
  });
}

function initMailtoForm() {
  const form = qs("[data-mailto-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const subject = String(fd.get("subject") || "").trim();
    const message = String(fd.get("message") || "").trim();

    const to = "Khalilouybt@gmail.com";
    const body = `Nom: ${name}\nEmail: ${email}\n\n${message}\n`;
    const url = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  });
}

setYear();
initTheme();
initHeaderElevation();
initMenu();
initReveal();
initIcons();
initCopyButtons();
initMailtoForm();
