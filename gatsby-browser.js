import MainThemeProvider from './src/components/mainThemeProvider.tsx';
import './src/scss/style.scss';


const React = require('react');

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MainThemeProvider>
    {element}
  </MainThemeProvider>
);
