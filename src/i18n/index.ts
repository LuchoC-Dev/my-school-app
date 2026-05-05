import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import es from "./locales/es";
import en from "./locales/en";

function getDeviceLanguage(): "es" | "en" {
  const code = getLocales()[0]?.languageCode ?? "es";
  return code === "en" ? "en" : "es";
}

i18next.use(initReactI18next).init({
  resources: {
    es: { translation: es },
    en: { translation: en },
  },
  lng: getDeviceLanguage(),
  fallbackLng: "es",
  interpolation: { escapeValue: false },
});

export default i18next;
