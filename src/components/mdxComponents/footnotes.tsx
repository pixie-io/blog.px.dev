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

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  footnotes: {
    '& hr': {
      display: 'none',
    },
    '& li': {
      display: 'list-item',
      fontStyle: 'italic',
      fontSize: '14px',
      lineHeight: '1.4em',
      opacity: 0.6,
      '& a': {
        lineHeight: 'inherit',
      },
    },
  },
}));
const Footnotes = ({ children, id }) => (
  <div className={useStyles().footnotes} id={id}>{children}</div>
);
export default Footnotes;
