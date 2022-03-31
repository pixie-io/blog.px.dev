import * as React from 'react';
import MuiLink from '@mui/material/Link';
import { Link as GatsbyLink } from 'gatsby';

const Link = React.forwardRef((props: { to: string; children: any }, ref) => <MuiLink component={GatsbyLink} {...props} />);

export default Link;
