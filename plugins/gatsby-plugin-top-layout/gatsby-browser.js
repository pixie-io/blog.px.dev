/* eslint-disable import/prefer-default-export */
import * as React from 'react';
import TopLayout from './TopLayout';
import '../../src/scss/style.scss';

export const wrapRootElement = ({ element }) => {
  return <TopLayout>{element}</TopLayout>;
};
