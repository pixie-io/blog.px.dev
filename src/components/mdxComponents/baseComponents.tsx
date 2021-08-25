/*
 * Copyright 2018- The Pixie Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { idFromSlug } from 'components/utils';
import Code from './code';
import Pre from './pre';
import AnchorTag from './anchor';
import CodeRenderer from './codeRenderer';
import ListItem from './listItem';
import CustomTableCell from './custom-table-cell';
import HLink from './h-link';
import Footnotes from './footnotes';


export default {
  // There is a bug in material plugin that overwrites the H1 with the default typography,
  // so this cannot be set here. The default mui h1 has been updated to match
  // the design and overwritten on homepage (only 1 implementation).
  // The problem seems to occur only on the H1 (to be investigated).
  h1: ({ children }) => (
    <HLink id={idFromSlug(children)} variant='h1' />
  ),
  h2: ({ children }) => <HLink id={idFromSlug(children)} variant='h2'>{children}</HLink>,
  h3: ({ children }) => <HLink id={idFromSlug(children)} variant='h3'>{children}</HLink>,
  h4: ({ children }) => <HLink id={idFromSlug(children)} variant='h4'>{children}</HLink>,
  h5: ({ children }) => <HLink id={idFromSlug(children)} variant='h5'>{children}</HLink>,
  h6: ({ children }) => <HLink id={idFromSlug(children)} variant='h6'>{children}</HLink>,
  p: (props: any) => <Typography {...props} variant='body1' />,
  pre: Pre,
  code: (props: any) => {
    const { children } = props;
    return (
      <CodeRenderer
        {...props}
        code={children}
      />
    );
  },
  inlineCode: (props: any) => <Code {...props} />,
  a: (props: any) => <AnchorTag {...props} />,
  table: (props: any) => <Table {...props} />,
  tr: (props: any) => <TableRow {...props} />,
  td: ({ align, ...props }) => <CustomTableCell {...props} align={align || undefined} />,
  th: ({ align, ...props }) => <TableCell {...props} align={align || undefined} />,
  tbody: (props: any) => <TableBody {...props} />,
  thead: (props: any) => <TableHead {...props} />,
  ul: (props: any) => <Typography {...props} component='ul' />,
  wrapper: ({ children }) => {
    // eslint-disable-next-line no-prototype-builtins
    const updatedChildren = children.hasOwnProperty('map') ? children.map((child) => {
      if (child.props.className === 'footnotes') {
        return <Footnotes key={1} {...child.props} />;
      }
      return child;
    }) : children;
    return <>{updatedChildren}</>;
  },
  ol: (props: any) => <Typography {...props} component='ol' />,
  em: (props: any) => <Typography {...props} component='em' style={{ fontStyle: 'italic' }} />,
  li: (props: any) => <ListItem {...props} />,
  img: (props: any) => <div className='blog-image-wrapper'><img {...props} className='blog-image' /></div>,
};
