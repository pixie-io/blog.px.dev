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

/* eslint-disable react/jsx-indent */
import React from 'react';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import cncfLogo from '../../images/footer/cncf-white.svg';
import github from '../../images/footer/github-icon.svg';

function Footer() {
  return (
        <>
            <Typography
              variant='body1'
              sx={{
                textAlign: 'center',
                pt: 12,
              }}
            >
                {' '}
                We are a
                {' '}
                <a
                  className='pixie-green bold'
                  href='https://cncf.io/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                    Cloud Native Computing Foundation
                </a>
                {' '}
                sandbox project.

            </Typography>
            <Box sx={{
              maxWidth: 360,
              margin: '0 auto',
              display: 'block',
              my: 4,
            }}
            >
                <a href='https://cncf.io/' target='_blank' rel='noopener noreferrer'>
                    <img
                      style={{
                        width: '100%',
                        display: 'block',
                      }}
                      src={cncfLogo}
                      alt='CNCF logo'
                    />
                </a>
            </Box>

            <Box sx={{
              mx: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              flexDirection: {
                xs: 'column-reverse',
                xl: 'row',
              },
            }}
            >
                <div>
                    <a href='https://www.linuxfoundation.org/terms'>Terms of Service</a>
                    <span style={{ margin: '0 8px' }}>
          |
                    </span>
                    <a href='https://www.linuxfoundation.org/privacy'>Privacy Policy</a>
                </div>

                <div>
                    Pixie was originally created and contributed by
                    {' '}
                    <a
                      href='https://newrelic.com/'
                      target='_blank'
                      className=' pixie-green'
                      rel='noopener noreferrer'
                    >
New Relic, Inc.
                    </a>
                </div>
                <a
                  href='https://github.com/pixie-io/blog.px.dev'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex-row-center pixie-green'
                >
                    <img src={github} alt='github' style={{ marginRight: 4 }} />
                    Edit on GitHub
                </a>
            </Box>
            <Typography
              variant='body1'
              sx={{
                textAlign: 'center',
                py: 4,
              }}
            >
                Copyright © 2018 - The Pixie Authors. All Rights Reserved. |
                Content distributed under CC BY 4.0.
                <br />
                The Linux Foundation has registered trademarks and uses trademarks.
                For a list of trademarks of The Linux Foundation, please see our
                {' '}
                <a href='https://www.linuxfoundation.org/trademark-usage'>Trademark Usage Page</a>
                .
                <br />
                Pixie was originally created and contributed by
                {' '}
                <a href='https://newrelic.com/' target='_blank' rel='noopener noreferrer'>
                    New Relic,
                    Inc.
                </a>
            </Typography>
        </>
  );
}

export default Footer;
