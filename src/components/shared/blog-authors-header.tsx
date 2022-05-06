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

// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Box, Stack } from '@mui/material';
import GravatarIcon from '../gravatar';

function BlogAuthorsHeader({
  authors,
  date,
  timeToRead,
}: any) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: authors.length > 2 ? 'start' : 'center',
      flexDirection: authors.length > 2
        ? 'column' : 'row',
    }}
    >
      <Stack direction='row' spacing={0.5} mr={1}>
        {(authors || []).map((a: { email: any }) => (a
          ? <GravatarIcon email={a.email} size={32} key={a.email} /> : ''))}
      </Stack>
      <Box sx={{
        fontSize: '14px',
        lineHeight: '18px',
      }}
      >
        <Box
          component='span'
          sx={{
            color: (t) =>
            // @ts-ignore
            // eslint-disable-next-line implicit-arrow-linebreak
              t?.components?.MuiTypography?.styleOverrides?.h1?.color,
            fontSize: '16px',
          }}
        >
          {authors.map((a: { name: any }) => (a ? a.name : ''))
            .join(', ')}
          <br />
        </Box>
        {date}
        {' • '}
        {timeToRead}
        {' '}
        minutes read
      </Box>
    </Box>
  );
}
export default BlogAuthorsHeader;
