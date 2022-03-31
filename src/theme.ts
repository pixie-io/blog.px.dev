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
