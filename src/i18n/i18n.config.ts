import {initReactI18next} from 'react-i18next';
import {en, mar} from './translations';
import i18next from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initializeI18n = async () => {
  const lng = await AsyncStorage.getItem('language');

  const resources = {
    en: {
      translation: en,
    },
    mar: {
      translation: mar,
    },
  };

  i18next.use(initReactI18next).init({
    debug: true,
    lng: lng || 'en',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
};

initializeI18n();

export default i18next;