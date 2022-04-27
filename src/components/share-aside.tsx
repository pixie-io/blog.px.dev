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
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import slack from '../images/header/slack-icon.svg';
import github from '../images/header/github-icon.svg';
import twitter from '../images/header/twitter-icon.svg';
import youtube from '../images/header/youtube-icon.svg';
import rss from '../images/header/rss-icon.svg';

function ShareAside() {
  const listItems = [
    {
      href: 'https://github.com/pixie-io/pixie',
      icon: github,
      name: 'GitHub',
      width: 20,
    },
    {
      href: 'https://slackin.px.dev',
      icon: slack,
      name: 'Slack',
      width: 18,
    },

    {
      href: 'https://twitter.com/pixie_run',
      icon: twitter,
      name: 'Twitter',
      width: 20,
    },
    {
      href: 'https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured',
      icon: youtube,
      name: 'YouTube',
      width: 22,
    },
    {
      href: '/rss.xml',
      icon: rss,
      name: 'RSS Feed',
      width: 22,
    },
  ];

  return (
    <Box sx={{
      position: {
        xs: 'relative',
        sm: 'sticky',
      },
      top: {
        xs: 0,
        sm: 100,
      },
      ml: {
        xs: 0,
        sm: 4,
      },
      mt: {
        xs: 0,
        sm: 20,
      },
    }}
    >
      <Typography variant='h5' sx={{ whiteSpace: 'nowrap' }}>Connect with us</Typography>
      <List component='div' sx={{ width: { sm: 'min-content', xs: 'auto' } }}>
        <Grid container>
          {listItems.map((item) => (
            <ListItem
              key={item.href}
              component='div'
              sx={{
                width: {
                  xs: '50%',
                  sm: '100%',
                },
              }}
              disablePadding
            >
              <ListItemButton component='a' href={item.href} target='_blank'>
                <ListItemIcon sx={{
                  minWidth: 0,
                  pr: 1,
                }}
                >
                  {' '}
                  <img width={18} src={item.icon} alt='slack' />
                  {' '}
                </ListItemIcon>
                <ListItemText primary={item.name} sx={{ whiteSpace: 'nowrap', m: 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </Grid>
      </List>
    </Box>
  );
}

export default ShareAside;
