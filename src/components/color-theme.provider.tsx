import React, { createContext, useState } from 'react';

const getInitialColorMode = () => (typeof window !== 'undefined' && !!window.localStorage && document.body.classList.contains('dark') ? 'dark' : 'light');

export const ColorThemeContext = createContext({
  colorMode: 'light',
  setColorMode: (_: string) => {
  },
});
// @ts-ignore
export const ColorThemeProvider = ({ children }) => {
  const [colorMode, rawSetColorMode] = useState(getInitialColorMode);
  const setColorMode = (mode: string) => {
    rawSetColorMode(mode);

    if (mode === 'light') {
      window.localStorage.setItem('theme', 'light');
      document.body.classList.remove('dark');
    } else {
      window.localStorage.setItem('theme', 'dark');
      document.body.classList.add('dark');
    }
  };
  return (
    <ColorThemeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ColorThemeContext.Provider>
  );
};
