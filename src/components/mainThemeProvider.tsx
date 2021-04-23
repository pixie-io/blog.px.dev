import * as React from 'react';
import { useEffect, useRef } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, useMediaQuery } from '@material-ui/core';

import AppThemeOptions from './theme';

export const ThemeModeContext = React.createContext(
  {
    theme: null,
    toggleTheme: null,
  },
);
export default function MainThemeProvider({ children }) {
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [theme, setTheme] = React.useState('dark');
  // const firstRun = useRef(true);
  // useEffect(
  //   () => {
  //     if (firstRun.current) {
  //       firstRun.current = false;
  //       return;
  //     }
  //     setTheme(prefersDarkMode ? 'dark' : 'light');
  //   }, [prefersDarkMode],
  // );

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  const muiTheme = createMuiTheme(AppThemeOptions[theme]);

  return (
    <ThemeModeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
