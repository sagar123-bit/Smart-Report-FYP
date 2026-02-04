import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import english from "./languages/english";
import nepali from "./languages/nepali";

const savedLanguage = localStorage.getItem("preferredLanguage") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: english,
      ne: nepali,
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
