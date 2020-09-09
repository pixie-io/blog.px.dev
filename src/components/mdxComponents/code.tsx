import withStyles from '@material-ui/core/styles/withStyles';
// eslint-disable-next-line no-unused-vars
import { Theme } from '@material-ui/core';
import React from 'react';

const Code = withStyles((theme: Theme) => ({
  code: {
    fontFamily: '"Roboto Mono", Monospace',
    color: theme.palette.type === 'light' ? '#c7254e' : '#E0EBF7',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    borderRadius: '4px',
    padding: '2.72px 5.44px',
    margin: 0,
    fontSize: '85%',
    backgroundColor: theme.palette.type === 'light' ? '#f9f7fb' : '#292929',
    borderColor: theme.palette.type === 'light' ? '#ede7f3' : '#171717',
  },

}))(({ children, classes }) => (<code className={classes.code}>{children}</code>));

export default Code;
