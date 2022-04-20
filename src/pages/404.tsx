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
import { Link } from 'gatsby';
import { Container, Typography } from '@mui/material';
import { Box, width } from '@mui/system';
import SEO from '../components/seo';
import Header from '../components/header';
import Footer from '../components/footer';
import img404 from '../images/404.svg';

function NotFoundPage() {
  return (
    <>
      <SEO
        title='404'
        description={undefined}
        lang={undefined}
        meta={undefined}
        url={undefined}
        creators={undefined}
        image={undefined}
      />
      <Header />
      <Container>
        <Box sx={{
          width: {
            xs: '80%',
            sm: 'fit-content',
          },
          margin: {
            xs: '0 auto',
            sm: '100px auto',
          },
        }}
        >
          <img src={img404} alt='' className='w-100' />
        </Box>

        <Typography
          variant='body1'
          sx={{ textAlign: 'center' }}
        >
          Oops! Looks like you are lost in space.
          <br />
          Let&apos;s head back
          {' '}
          <Link to='/'> home</Link>
          .
        </Typography>
        <Footer />
      </Container>
    </>
  );
}

export default NotFoundPage;
