import { getActiveIndex, next, prev, setActiveIndex } from "./utils";
import { THEME_STORAGE_KEY, Theme } from "@/models/theme";

import cv from "@/data/cv.json";

const { email, phone } = cv.basics;

// footer
const footerButton = document.getElementById("footer-button")!;
footerButton.addEventListener("click", () => {
  const event = new KeyboardEvent("keydown", {
    key: "k",
    ctrlKey: true,
  });
  document.dispatchEvent(event);
});

// command menu
const getStyles = (gap: number) => `body {
  --removed-body-scroll-bar-size: ${gap}px;
}

body {
  overflow: hidden !important;
  overscroll-behavior: contain;
  position: relative !important;
  padding: 0px;
  padding-right: var(--removed-body-scroll-bar-size) !important;
}`;

const instance = document.querySelector(".dialog") as HTMLElement;
const style = document.createElement("style");
const input = document.querySelector(".search__input") as HTMLInputElement;

function open() {
  const gap = window.innerWidth - document.documentElement.clientWidth;
  style.textContent = getStyles(gap);
  document.head.appendChild(style);

  instance.style.display = "block";
  instance.style.pointerEvents = "auto";

  input.focus();
}

function close() {
  style.remove();

  instance.style.display = "none";
  instance.style.pointerEvents = "none";
}

const Urls = {
  Email: `mailto:${email}`,
  Phone: `https://wa.me/${phone.split(" ").join("")}`,
  LinkedIn: "https://linkedin.com/in/TM10YMhp",
  GitHub: "https://github.com/TM10YMhp",
  X: "https://x.com/TM10YMhp",
};
const sectionHandlers: Record<string, () => void> = {
  Print: () => {
    window.print();
  },
  Email: () => {
    window.open(Urls.Email, "_blank", "noopener,noreferrer");
  },
  Phone: () => {
    window.open(Urls.Phone, "_blank", "noopener,noreferrer");
  },
  LinkedIn: () => {
    window.open(Urls.LinkedIn, "_blank", "noopener,noreferrer");
  },
  GitHub: () => {
    window.open(Urls.GitHub, "_blank", "noopener,noreferrer");
  },
  X: () => {
    window.open(Urls.X, "_blank", "noopener,noreferrer");
  },
  ...Object.values(Theme).reduce(
    (acc, el) => ({
      ...acc,
      [el]: () => {
        document.documentElement.className = el;
        window.localStorage.setItem(THEME_STORAGE_KEY, el);
      },
    }),
    {},
  ),
};

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    instance.style.display === "block" ? close() : open();
  } else if (event.key === "Escape") {
    close();
  }
});

const backdrop = document.querySelector(".dialog__backdrop") as HTMLElement;
backdrop.addEventListener("click", () => close());

let mouseMove = false;

const container = document.querySelector(".dialog__container") as HTMLElement;
container.addEventListener(
  "mousemove",
  () => {
    if (!mouseMove) mouseMove = true;
  },
  { passive: true },
);

let currentIndex = 0;
const sections = document.querySelector(".dialog__sections") as HTMLElement;
container.addEventListener("keydown", (event) => {
  mouseMove = false;

  const items: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.section__content:not([style*="display: none"])',
  );

  if (event.key === "ArrowUp" || (event.shiftKey && event.key === "Tab")) {
    event.preventDefault();
    const prevIndex = prev(getActiveIndex(items), items.length);
    currentIndex = setActiveIndex(items, currentIndex, prevIndex);

    const item = items[currentIndex] as HTMLElement;
    const itemTop = item.offsetTop;
    const itemCenter = itemTop + item.offsetHeight / 2;

    const topMiddle = sections.offsetHeight / 2;

    const bottomMiddle =
      sections.offsetHeight / 2 +
      (sections.scrollHeight - sections.offsetHeight);
    const offset = itemCenter < bottomMiddle;

    if (offset) {
      sections.scrollTop = itemCenter - topMiddle;
    } else {
      sections.scrollTop = sections.scrollHeight - sections.offsetHeight;
    }
  } else if (event.key === "ArrowDown" || event.key === "Tab") {
    event.preventDefault();
    const nextIndex = next(getActiveIndex(items), items.length);
    currentIndex = setActiveIndex(items, currentIndex, nextIndex);

    const item = items[currentIndex] as HTMLElement;
    const itemTop = item.offsetTop;
    const itemCenter = itemTop + item.offsetHeight / 2;

    const topMiddle = sections.offsetHeight / 2;
    const offset = itemCenter > topMiddle;

    if (offset) {
      sections.scrollTop = itemCenter - topMiddle;
    } else {
      sections.scrollTop = 0;
    }
  } else if (event.key === "Enter") {
    if (getActiveIndex(items) >= 0) {
      const id = items[currentIndex].id;
      if (sectionHandlers[id]) sectionHandlers[id]();
    }
  }
});

const items: NodeListOf<HTMLElement> =
  document.querySelectorAll(".section__content");
items.forEach((el) => {
  el.addEventListener(
    "pointerenter",
    (e) => {
      if (!mouseMove) return;

      items.forEach((item) => item.removeAttribute("data-active"));
      const target = e.target as HTMLElement;
      target.setAttribute("data-active", "");
      currentIndex = Array.from(items).indexOf(target);
    },
    { passive: true },
  );

  // el.addEventListener("pointerleave", () => {
  //   items.forEach((item) => item.removeAttribute("data-active"));
  // });

  el.addEventListener("click", () => {
    const id = el.id;
    if (sectionHandlers[id]) sectionHandlers[id]();
  });
});

const indexedItems = [
  "Imprimir",
  "Mandar Correo",
  "Mandar Mensaje",
  "Visitar LinkedIn",
  "Visitar X",
  "Visitar GitHub",
  "Light",
  "Dark",
  "Bruma",
  "Classic",
  "Forest",
  "Serene",
  "Soft Dark",
  "Solarized Dark",
  "Solarized Light",
  "Tokyonight",
  "Twilight",
];

// input
input.addEventListener("input", (e) => {
  const value = (e.target as HTMLInputElement).value;
  const results: string[] = [];

  for (const key in indexedItems) {
    const item = indexedItems[key];
    if (item.toLowerCase().includes(value.toLowerCase())) {
      results.push(item.toLowerCase());
    }
  }
  results.sort((a, b) => a.localeCompare(b));

  items.forEach((el) => {
    items.forEach((item) => item.removeAttribute("data-active"));

    const _items: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.section__content:not([style*="display: none"])',
    );
    if (_items.length > 0) currentIndex = setActiveIndex(_items, 0, 0);

    const name = el.children[1] as HTMLElement;
    if (results.includes(name.innerText.toLowerCase())) {
      el.style.display = "flex";
    } else {
      el.style.display = "none";
    }
  });
});
