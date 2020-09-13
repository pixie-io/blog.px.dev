import withStyles from '@material-ui/core/styles/withStyles';
// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Theme } from '@material-ui/core';

const Quote = withStyles((theme: Theme) => ({
  quote: {
    padding: '30px 50px',
    fontFamily: 'Source Sans Pro',
    fontStyle: 'italic',
    fontSize: '32px',
    lineHeight: '54px',
    [theme.breakpoints.down('md')]: {
      fontSize: '20px',
      lineHeight: '34px',
      padding: '10px 30px',
    },
  },
  author: {
    color: '#B2B5BB',
    fontWeight: 'bold',
    fontSize: '22px',
    lineHeight: '30px',
    paddingTop: '16px',
  },

}))((props) => {
  const { children, classes, author } = props;
  return (
    <div className={classes.quote}>
      {children}
      {author && (
        <div className={classes.author}>
          -
          {' '}
          {author}
        </div>
      )}
    </div>
  );
});

export default Quote;
