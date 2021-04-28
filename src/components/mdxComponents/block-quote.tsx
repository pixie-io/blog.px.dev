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
// eslint-disable-next-line no-unused-vars
import React from 'react';

const BlockQuote = withStyles((theme) => ({
  blockQuote: {
    padding: '17px',
    borderStyle: 'solid',
    border: '0',
    borderLeft: '5px',
    borderColor: '#12D6D6',
    backgroundColor: theme.palette.type === 'light' ? '#ddd' : '#353535',
    borderRadius: '0 5px 5px 0',
    marginBottom: '32px',
    marginTop: '32px',
    fontSize: '18px',
    lineHeight: '30px',
  },

}))((props) => {
  const { children, classes } = props;
  return (<div className={classes.blockQuote}>{children}</div>);
});

export default BlockQuote;
