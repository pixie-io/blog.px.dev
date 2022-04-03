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
import React, { createContext, useLayoutEffect, useState } from 'react';

const getInitialColorMode = () => (typeof window !== 'undefined' && !!window.localStorage && document.body.classList.contains('dark') ? 'dark' : 'light');

export const ColorThemeContext = createContext({
  colorMode: 'light',
  setColorMode: (_: string) => {
  },
});
// @ts-ignore
export const ColorThemeProvider = ({ children }) => {
  const [colorMode, rawSetColorMode] = useState(getInitialColorMode());

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      rawSetColorMode(getInitialColorMode());
    }
  });
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
