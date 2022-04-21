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
import React, { useContext } from 'react';
import {
  AppBar,
  Box,
  Button, Collapse,
  Container,
  IconButton,
  Stack,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import { Brightness4, Brightness7, Close } from '@mui/icons-material';
import MuiLink from '@mui/material/Link';
import { ColorThemeContext } from '../color-theme.provider';
import Link from '../link';
import pixieLogo from '../../images/pixie-logo-header.svg';
import SearchModal from './search/search-modal';

function ElevationScroll(props: { children: any }) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const MobileAlertBar = () => (
    <MuiLink
      href='https://www.cncf.io/projects/pixie/'
      target='_blank'
      sx={{
        color: 'success.main',
        textDecoration: 'none',
        textAlign: 'center',
        width: '100%',
        mx: 1,
        fontSize: 13,
        display: {
          xs: 'block',
          sm: 'none',
        },
      }}
    >
        Pixie is now a CNCF Sandbox project!
    </MuiLink>
);
const DesktopAlertBar = () => (
    <Box sx={{
      textAlign: 'center',
      flexGrow: '1',
      fontSize: 13,
      display: {
        xs: 'none',
        sm: 'block',
      },
    }}
    >
        Pixie is now a CNCF Sandbox project!
        <MuiLink
          href='https://www.cncf.io/projects/pixie/'
          target='_blank'
          sx={{
            color: 'success.main',
            textDecoration: 'none',
            mx: 1,
          }}
        >
Learn more
        </MuiLink>
        🚀
    </Box>
);

function Header() {
  const colorContext = useContext(ColorThemeContext);
  const [open, setOpen] = React.useState(true);

  const onThemeTypeSwitch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    colorContext.setColorMode(colorContext.colorMode === 'light' ? 'dark' : 'light');
  };

  return (
        <>
            <ElevationScroll>
                <AppBar>
                    <Collapse in={open}>
                        <Box
                          sx={{
                            backgroundColor: '#212324',
                            color: 'white',
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                            <DesktopAlertBar />
                            <MobileAlertBar />
                            <IconButton
                              aria-label='close'
                              color='inherit'
                              size='small'
                              onClick={() => {
                                setOpen(false);
                              }}
                            >
                                <Close
                                  fontSize='inherit'
                                  sx={{ color: 'rgba(150, 150, 165, 1)' }}
                                />
                            </IconButton>
                        </Box>

                    </Collapse>
                    <Toolbar>
                            <Stack
                              direction='row'
                              justifyContent='space-between'
                              alignItems='center'
                              width='100%'
                            >
                                <Link to='/'>
                                    <Box sx={{
                                      width: {
                                        xs: 108,
                                        sm: 132,
                                      },
                                    }}
                                    >
                                        <img
                                          src={pixieLogo}
                                          alt='pixie logo'
                                          className='block w-100'
                                        />
                                    </Box>
                                </Link>
                                <div>
                                    <SearchModal />
                                    <IconButton size='small' onClick={onThemeTypeSwitch}>
                                        {colorContext.colorMode === 'light'
                                          ? <Brightness4 style={{ color: '#B2B5BB' }} />
                                          : <Brightness7 style={{ color: '#B2B5BB' }} />}
                                    </IconButton>
                                    <Button
                                      sx={{
                                        mx: {
                                          xs: 0,
                                          sm: 4,
                                        },
                                        p: 0,
                                      }}
                                      component='a'
                                      href='https://docs.px.dev'
                                      target='_bank'
                                    >
                                        Docs
                                    </Button>
                                    <Button
                                      component='a'
                                      href='https://docs.px.dev/installing-pixie/'
                                      target='_bank'
                                      variant='contained'
                                      sx={{
                                        display: {
                                          xs: 'none',
                                          sm: 'inline-block',
                                        },
                                      }}
                                    >
                                        GET STARTED
                                    </Button>
                                </div>
                            </Stack>
                    </Toolbar>
                </AppBar>
            </ElevationScroll>
            <Collapse sx={{ height: open ? 92 : 64 }} />
        </>
  );
}

export default Header;
