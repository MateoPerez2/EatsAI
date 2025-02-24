// App.js
import React from 'react';
import RootNavigation from './navigation/RootNavigation';
import { AppProvider } from './AppContext'; // if you have a global context

export default function App() {
  return (
    <AppProvider>
      <RootNavigation />
    </AppProvider>
  );
}
