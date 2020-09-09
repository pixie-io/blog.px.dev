import React from 'react';

import baseComponents from './baseComponents';
import SvgRenderer from './svg';
import Command from './command';
import Quote from './quote';

export default {
  ...baseComponents,
  svg: (props: any) => <SvgRenderer {...props} />,
  quote: (props: any) => <Quote {...props} />,
  command: (props: any) => <Command {...props} />,
};
