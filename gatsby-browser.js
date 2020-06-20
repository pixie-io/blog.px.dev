import { createMuiTheme } from '@material-ui/core';

const { MuiThemeProvider } = require('@material-ui/core/styles');

const React = require('react');

const theme = createMuiTheme();
// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MuiThemeProvider theme={theme}>
    {element}
  </MuiThemeProvider>
);
