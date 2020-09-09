import React from 'react';

import baseComponents from './baseComponents';
import SvgRenderer from './svg';
import Command from './command';

export default {
  ...baseComponents,
  svg: (props: any) => <SvgRenderer {...props} />,
  command: (props: any) => <Command {...props} />,
};
