/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
import React from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import MainThemeProvider from './src/components/mainThemeProvider.tsx';
import './src/scss/style.scss';

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <StyledEngineProvider injectFirst>
    <MainThemeProvider>
      {element}
    </MainThemeProvider>
  </StyledEngineProvider>
);
