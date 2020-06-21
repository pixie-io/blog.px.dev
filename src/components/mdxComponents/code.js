import withStyles from '@material-ui/core/styles/withStyles';
// eslint-disable-next-line no-unused-vars
import { Theme } from '@material-ui/core';
import React from 'react';

const Code = withStyles((theme) => ({
  code: {
    fontFamily: 'source code pro',
    color: theme.palette.type === 'light' ? '#c7254e' : '#E0EBF7',
    borderWidth: '0.5px',
    borderStyle: 'solid',
    fontSize: '0.9em',
    borderRadius: '4px',
    padding: '1px 6px 1px 6px',
    margin: '1px 2px',
    backgroundColor: theme.palette.type === 'light' ? '#f9f7fb' : '#2a2a2a',
    borderColor: theme.palette.type === 'light' ? '#ede7f3' : '#171717',
    display: 'inline-block',
  },

}))(({ children, classes }) => (<code className={classes.code}>{children}</code>));

export default Code;
