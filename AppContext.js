import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [language, setLang] = useState('en');

  useEffect(() => {
    // Load language from storage
    const loadLang = async () => {
      try {
        const stored = await AsyncStorage.getItem('userLanguage');
        if (stored) setLang(stored);
      } catch {}
    };
    loadLang();
  }, []);

  const setLanguage = async (lang) => {
    setLang(lang);
    await AsyncStorage.setItem('userLanguage', lang);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}
