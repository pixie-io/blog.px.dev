import withStyles from '@material-ui/core/styles/withStyles';
// eslint-disable-next-line no-unused-vars
import React from 'react';

const BlockQuote = withStyles(() => ({
  blockQuote: {
    padding: '17px',
    borderStyle: 'solid',
    border: '0',
    borderLeft: '5px',
    borderColor: '#12D6D6',
    backgroundColor: '#353535',
    borderRadius: '0 5px 5px 0',
    marginBottom: '32px',
    marginTop: '32px',
    fontSize: '18px',
    lineHeight: '30px',
  },

}))((props) => {
  const { children, classes } = props;
  return (<div className={classes.blockQuote}>{children}</div>);
});

export default BlockQuote;
