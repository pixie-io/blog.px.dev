import React from 'react';
import MDX from '@mdx-js/runtime';
import mdxComponents from './index';

const parseMd = (input) => (
  <MDX components={mdxComponents}>
    {input}
  </MDX>
);
export default parseMd;
