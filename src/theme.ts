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
import { createTheme, ThemeOptions } from '@mui/material/styles';
import createBreakpoints from '@mui/system/createTheme/createBreakpoints';

const breakpoints = createBreakpoints({});
const themeOptions: ThemeOptions = {
  palette: {
    background: {
      default: 'rgba(var(--color-background))',
      paper: 'rgba(var(--color-background-paper))',
    },
    primary: {
      main: 'rgba(var(--color-primary))',
      contrastText: 'rgba(var(--color-primary-contrast))',
    },
    secondary: {
      main: 'rgba(var(--color-secondary))',
    },
  },
  typography: {
    body1: {
      color: 'rgba(var(--color-primary))',
    },

  },
  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 18, 18, 1)',
          color: '#9696A5',
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          width: 'auto',
          minWidth: '50%',
          marginBottom: '24px',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottomWidth: '3px',
          borderBottomStyle: 'solid',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          '&:last-child': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          color: 'rgba(var(--color-primary))',
        },
        head: {
          fontWeight: 'bold',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          color: 'rgba(var(--color-headings))',
          fontFamily: 'Manrope',
          fontWeight: 400,
          fontSize: '64px',
          lineHeight: '87px',
          [breakpoints.down('sm')]: {
            fontSize: '44px',
            lineHeight: '60px',
          },
        },
        h2: {
          color: 'rgba(var(--color-headings))',
          fontFamily: 'Manrope',
          fontWeight: 700,
          fontSize: '30px',
          lineHeight: '41px',
        },
        h5: {
          color: 'rgba(var(--color-headings))',
          fontFamily: 'Manrope',
          fontWeight: 700,
          fontSize: '22px',
          lineHeight: '30px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(var(--color-button-background))',
          color: 'black',
          letterSpacing: '3px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },

  },

};

const theme: ThemeOptions = createTheme(themeOptions);

export default theme;
