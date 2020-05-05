import { MenuCountersProvider } from './src/components/shared/header-counters.provider';

const React = require('react');

// eslint-disable-next-line import/prefer-default-export
export const wrapRootElement = ({ element }) => (
  <MenuCountersProvider>
    {element}
  </MenuCountersProvider>
);
