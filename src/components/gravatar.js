import React, { useMemo } from 'react';
import { toUrl } from 'gatsby-source-gravatar';
import GatsbyImage from 'gatsby-image';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
  icon: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
  },
}));


const GravatarIcon = (({ email }) => {
  const url = useMemo(() => toUrl(email || ''), []);
  const classes = useStyles();
  return (
    <GatsbyImage
      className={classes.icon}
      fluid={{
        aspectRatio: 1 / 1,
        src: `${url}?size=45`,
        srcSet: `${url}?size=90 90w, ${url}?size=180 180w`,
        sizes: '(max-width: 45px) 90px, 180px',
      }}
    />
  );
});

export default GravatarIcon;
