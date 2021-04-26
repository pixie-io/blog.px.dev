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
  const [theme, setTheme] = React.useState('dark');

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
