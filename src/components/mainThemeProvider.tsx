/*
 * Copyright 2018- The Pixie Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme, ThemeOptions } from '@material-ui/core';

import AppThemeOptions from './theme';

const canUseLocalStorage = typeof window !== 'undefined' && !!window.localStorage;

function setManualPreference(mode: 'light'|'dark') {
  if (!canUseLocalStorage) {
    return;
  }

  if (mode === 'light') {
    window.localStorage.removeItem('theme');
  } else {
    window.localStorage.setItem('theme', 'dark');
  }
}

function selectTheme(): 'light'|'dark' {
  if (!canUseLocalStorage) {
    return 'light';
  }

  if (window.localStorage.getItem('theme') === 'dark') {
    return 'dark';
  }
  return 'light';
}

export const ThemeModeContext = React.createContext(
  {
    theme: null,
    toggleTheme: null,
  },
);
export default function MainThemeProvider({ children }) {
  const [theme, setTheme] = React.useState<'light'|'dark'>(selectTheme());

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    setManualPreference(next);
  };
  const muiTheme = createMuiTheme(AppThemeOptions[theme] as unknown as ThemeOptions);

  return (
    <ThemeModeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={muiTheme}>
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
