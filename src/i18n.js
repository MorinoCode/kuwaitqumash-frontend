import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationFA from "./locales/fa/translation.json";

const DEFAULT_LANGUAGE = "fa";
const SUPPORTED_LANGUAGES = ["fa", "ar", "en"];

// Lazy-load non-default language bundles so only the active locale is shipped
// in the initial JS entry chunk (~70% less translation payload on first load).
const localeLoaders = {
  fa: () => Promise.resolve({ default: translationFA }),
  en: () => import("./locales/en/translation.json"),
  ar: () => import("./locales/ar/translation.json"),
};

const inFlightLoads = new Map();

const normalizeLanguage = (lng) => {
  if (!lng || typeof lng !== "string") return DEFAULT_LANGUAGE;
  const base = lng.split("-")[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(base) ? base : DEFAULT_LANGUAGE;
};

export const ensureLanguageLoaded = async (lng) => {
  const base = normalizeLanguage(lng);
  if (i18n.hasResourceBundle(base, "translation")) {
    return base;
  }

  const loader = localeLoaders[base];
  if (!loader) return base;

  if (!inFlightLoads.has(base)) {
    const loadPromise = loader()
      .then((mod) => {
        const bundle = mod?.default || mod;
        if (bundle && !i18n.hasResourceBundle(base, "translation")) {
          i18n.addResourceBundle(base, "translation", bundle, true, true);
        }
        return base;
      })
      .finally(() => {
        inFlightLoads.delete(base);
      });
    inFlightLoads.set(base, loadPromise);
  }

  await inFlightLoads.get(base);
  return base;
};

i18n.use(initReactI18next).init({
  resources: {
    fa: {
      translation: translationFA,
    },
  },
  lng: DEFAULT_LANGUAGE,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

const originalChangeLanguage = i18n.changeLanguage.bind(i18n);
i18n.changeLanguage = async (lng, callback) => {
  if (lng) {
    await ensureLanguageLoaded(lng);
  }
  return originalChangeLanguage(lng, callback);
};

export default i18n;
