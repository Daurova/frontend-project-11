



import i18next from 'i18next';
import * as yup from 'yup';
import en from './locales/en/translation.json';
import ru from './locales/ru/translation.json';

const initPromise = i18next.init({
  resources: { en: { translation: en }, ru: { translation: ru } },
  lng: 'ru',
  fallbackLng: 'ru',
  debug: true,
});

initPromise.then(() => {
  yup.setLocale({
    mixed: { required: () => i18next.t('errorEmptyInputMessage') },
    string: { url: () => i18next.t('errorMessage') },
  });
});

export {initPromise};
export  default i18next;
