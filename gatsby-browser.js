const { MuiThemeProvider } = require('@material-ui/core/styles');

const React = require('react');

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MuiThemeProvider>
    {element}
  </MuiThemeProvider>
);
