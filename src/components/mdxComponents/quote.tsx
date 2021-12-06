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

import { withStyles } from '@mui/styles';

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Theme } from '@mui/material';

const Quote = withStyles((theme: Theme) => ({
  quote: {
    padding: '30px 50px',
    fontFamily: 'Source Sans Pro',
    fontStyle: 'italic',
    fontSize: '32px',
    lineHeight: '54px',
    [theme.breakpoints.down('md')]: {
      fontSize: '20px',
      lineHeight: '34px',
      padding: '10px 30px',
    },
  },
  author: {
    color: '#B2B5BB',
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '30px',
    paddingTop: '16px',
  },

}))((props) => {
  const { children, classes, author } = props;
  return (
    <div className={classes.quote}>
      {children}
      {author && (
        <div className={classes.author}>
          -
          {' '}
          {author}
        </div>
      )}
    </div>
  );
});

export default Quote;
