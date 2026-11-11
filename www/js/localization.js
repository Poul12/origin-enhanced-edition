/* =========================================
   localization.js
   GŁÓWNY SYSTEM
========================================= */

const LANG = {
  en: {},
  pl: {}
};

let currentLang = localStorage.getItem("lang") || "en";

function t(key, vars = {}) {
  let text = LANG[currentLang]?.[key] || LANG.en[key] || key;

  //console.log(`key, text`, key, text);
  
  for (const k in vars) {
    text = text.replaceAll(`{${k}}`, vars[k]);
  }

  return text;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
}

function detectLanguage() {
  const saved = localStorage.getItem("lang");

  if (saved) {
    currentLang = saved.toLowerCase().startsWith("pl") ? "pl" : "en";
    return;
  }

  const browserLang = (navigator.language || "en").toLowerCase();

  currentLang = browserLang.startsWith("pl") ? "pl" : "en";
}