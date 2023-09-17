import i18n from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import fr from './fr.json';
import rw from './rw.json';

// set default fallback language
export const DEFAULT_LANGUAGE = 'rw';

const resources = {
  en: {
    translation: en,
  },
  rw: {
    translation: rw,
  },
  fr: {
    translation: fr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  // language to use if translations in user language are not available
  fallbackLng: 'rw',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
