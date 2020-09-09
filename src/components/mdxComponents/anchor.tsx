import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// eslint-disable-next-line no-unused-vars
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    color: theme.palette.secondary.main,
    fontFamily: 'inherit',
    fontStyle: 'inherit',
    fontSize: 'inherit',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.secondary.main,
      textDecoration: 'underline',
    },
  },
}));
const AnchorTag = ({ children: link, ...props }) => {
  const classes = useStyles();
  // This assumes that any internal link (intended for Gatsby)
  // will start with exactly one slash, and that anything else is external.
  const { href } = props;
  const internal = /^\/(?!\/)/.test(href);
  let target = '_self';
  if (!internal) {
    target = '_blank';
  }
  if (link) {
    return (
      <Typography {...props} target={target} component='a' rel='noopener noreferrer' className={classes.link}>
        {link}
      </Typography>
    );
  }
  return null;
};

export default AnchorTag;
