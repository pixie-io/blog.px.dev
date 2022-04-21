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

import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { Button, Collapse } from '@mui/material';
import { Box } from '@mui/system';

const CookiesConsentBanner = () => {
  const isBrowser = typeof window !== 'undefined';
  const [consent, setConsent] = useState<boolean>(isBrowser ? !!Cookies.get('consent') : false);
  const close = () => {
    Cookies.set('consent', 'true');
    setConsent(true);
  };
  return (
    <Collapse in={!consent}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          backgroundColor: '#353535',
          color: 'white',
          opacity: 0.9,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          fontSize: 14,
        }}
      >
        This site uses cookies to provide you with a better user experience.
        By using Pixie, you consent to our&nbsp;
        <a
          href='https://pixielabs.ai/privacy/#Cookies'
          target='_blank'
          className='pixie-green bold'
          rel='noopener noreferrer'
        >
          use of cookies
        </a>
        .
        <Button sx={{ ml: 4 }} type='button' onClick={() => close()} size='small' variant='contained'>
          Close
        </Button>
      </Box>

    </Collapse>
  );
};
export default CookiesConsentBanner;
