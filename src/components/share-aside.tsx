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

const ShareAside = () => (
  <Box sx={{ position: 'fixed' }}>
    <Typography variant='h5'>Connect with us</Typography>
    <List>
      <ListItem disablePadding>
        <ListItemButton component='a' href='https://slackin.px.dev' target='_blank'>
          <ListItemIcon sx={{
            minWidth: 0,
            pr: 1,
          }}
          >
            {' '}
            <img width={18} src={slack} alt='slack' />
            {' '}
          </ListItemIcon>
          <ListItemText primary='Slack' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component='a'
          href='https://github.com/pixie-io/pixie'
          target='_blank'
        >
          <ListItemIcon sx={{
            minWidth: 0,
            pr: 1,
          }}
          >
            {' '}
            <img width={20} src={github} alt='github' />
            {' '}
          </ListItemIcon>
          <ListItemText primary='Github' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component='a'
          href='https://twitter.com/pixie_run'
          target='_blank'
        >
          <ListItemIcon sx={{
            minWidth: 0,
            pr: 1,
          }}
          >
            {' '}
            <img width={20} src={twitter} alt='twitter' />
          </ListItemIcon>
          <ListItemText primary='Twitter' />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component='a'
          href='https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured'
          target='_blank'
        >
          <ListItemIcon sx={{
            minWidth: 0,
            pr: 1,
          }}
          >
            {' '}
            <img width={22} src={youtube} alt='youtube' />
          </ListItemIcon>
          <ListItemText primary='Youtube' />
        </ListItemButton>
      </ListItem>
    </List>
    <Button variant='contained'>FOLLOW US</Button>
  </Box>
);

export default ShareAside;
