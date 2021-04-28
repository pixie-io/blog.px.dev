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

import withStyles from '@material-ui/core/styles/withStyles';
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import parseMd from './parseMd';

const CustomTableCell = withStyles(() => ({
  td: {
    '& li, & *': 'inherit',
  },
}))((props: any) => {
  const { children, classes, align } = props;
  let parsableChildren;
  if (children && children.props && children.props.originalType === 'inlineCode') {
    parsableChildren = children.props.children.split('//').join('\n');
  }
  return (
    <TableCell className={classes.td} align={align || undefined}>{parsableChildren ? parseMd(parsableChildren) : children}</TableCell>
  );
});

export default CustomTableCell;
