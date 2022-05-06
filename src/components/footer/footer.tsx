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
import CookiesConsentBanner from '../cookies-consent-banner';

function Footer() {
  return (
        <Box sx={{
          backgroundColor: 'rgba(18, 18, 18, 1)',
          color: 'rgba(150, 150, 165, 1)',
        }}
        >
            <Typography
              variant='body1'
              sx={{
                textAlign: 'center',
                color: 'inherit',
                pt: 2,
                fontSize: '14px',
              }}
            >
                <a
                  href='https://www.linuxfoundation.org/terms'
                  target='_blank'
                  rel='noreferrer'
                >
                    Terms of Service
                </a>
                <span style={{ margin: '0 12px' }}>|</span>
                <a
                  href='https://www.linuxfoundation.org/privacy'
                  target='_blank'
                  rel='noreferrer'
                >
                    Privacy Policy
                </a>

            </Typography>

            <Typography
              variant='body1'
              sx={{
                textAlign: 'center',
                color: 'inherit',
                pt: 2,
                fontSize: '14px',
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
              my: 2,
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
            <Typography
              variant='body1'
              sx={{
                textAlign: 'center',
                color: 'inherit',
                pt: 1,
                fontSize: '14px',
              }}
            >

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
            </Typography>

            <Typography
              variant='body1'
              sx={{
                textAlign: 'center',
                fontSize: 10,
                color: 'inherit',
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
            <CookiesConsentBanner />
        </Box>
  );
}

export default Footer;
