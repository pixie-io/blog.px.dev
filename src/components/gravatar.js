import React, { useMemo } from 'react';
import { toUrl } from 'gatsby-source-gravatar';
import GatsbyImage from 'gatsby-image';
import withStyles from '@material-ui/core/styles/withStyles';

const GravatarIcon = withStyles(() => ({
  icon: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
  },
}))(({ email, classes }) => {
  const url = useMemo(() => toUrl(email || ''), []);

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
