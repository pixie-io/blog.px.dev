import React from 'react';

import baseComponents from './baseComponents';
import SvgRenderer from './svg';
import Command from './command';
import Quote from './quote';
import BlockQuote from './block-quote';

export default {
  ...baseComponents,
  svg: (props: any) => <SvgRenderer {...props} />,
  quote: (props: any) => <Quote {...props} />,
  blockquote: (props: any) => <BlockQuote {...props} />,
  command: (props: any) => <Command {...props} />,
};
