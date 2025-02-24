//useTranslation.js

import { useContext } from 'react';
import { AppContext } from './AppContext'; 
import { translations } from './translations-en-es-po';

export function useTranslation() {
  const { language } = useContext(AppContext);

  function t(key) {
    const langData = translations[language] || translations.en; 
    return langData[key] || key; 
  }

  return { t };
}
