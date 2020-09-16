import MainThemeProvider from './src/components/mainThemeProvider.tsx';
import './src/scss/style.scss';
import { processClientEntry, runZoom } from './src/components/image-zoom-modal.plugin';


const React = require('react');

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MainThemeProvider>
    {element}
  </MainThemeProvider>
);

export const onClientEntry = () => {
  processClientEntry();
};
export const onRouteUpdate = () => {
  runZoom();
};
