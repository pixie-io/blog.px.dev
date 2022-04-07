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

const ShareAside = () => {
  const listItems = [
    {
      href: 'https://slackin.px.dev',
      icon: slack,
      name: 'Slack',
      width: 18,
    },
    {
      href: 'https://github.com/pixie-io/pixie',
      icon: github,
      name: 'GitHub',
      width: 20,
    },
    {
      href: 'https://twitter.com/pixie_run',
      icon: twitter,
      name: 'Twitter',
      width: 20,
    }, {
      href: 'https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured',
      icon: youtube,
      name: 'YouTube',
      width: 22,
    },
  ];

  return (
    <Box sx={{
      position: {
        xs: 'relative',
        sm: 'fixed',
      },
    }}
    >
      <Typography variant='h5'>Connect with us</Typography>
      <List component='div'>
        <Grid container>
          {listItems.map((item) => (
            <ListItem
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
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </Grid>
      </List>
      <Button variant='contained'>FOLLOW US</Button>
    </Box>
  );
};

export default ShareAside;
