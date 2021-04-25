import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { idFromSlug } from 'components/utils';
import Code from './code';
import Pre from './pre';
import AnchorTag from './anchor';
import CodeRenderer from './codeRenderer';
import ListItem from './listItem';
import CustomTableCell from './custom-table-cell';
import HLink from './h-link';


export default {
  // There is a bug in material plugin that overwrites the H1 with the default typography,
  // so this cannot be set here. The default mui h1 has been updated to match
  // the design and overwritten on homepage (only 1 implementation).
  // The problem seems to occur only on the H1 (to be investigated).
  h1: ({ children }) => (
    <HLink id={idFromSlug(children)} variant='h1' />
  ),
  h2: ({ children }) => <HLink id={idFromSlug(children)} variant='h2'>{children}</HLink>,
  h3: ({ children }) => <HLink id={idFromSlug(children)} variant='h3'>{children}</HLink>,
  h4: ({ children }) => <HLink id={idFromSlug(children)} variant='h4'>{children}</HLink>,
  h5: ({ children }) => <HLink id={idFromSlug(children)} variant='h5'>{children}</HLink>,
  h6: ({ children }) => <HLink id={idFromSlug(children)} variant='h6'>{children}</HLink>,
  p: (props: any) => <Typography {...props} variant='body1' />,
  pre: Pre,
  code: (props: any) => {
    const { children } = props;
    return (
      <CodeRenderer
        {...props}
        code={children}
      />
    );
  },
  inlineCode: (props: any) => <Code {...props} />,
  a: (props: any) => <AnchorTag {...props} />,
  table: (props: any) => <Table {...props} />,
  tr: (props: any) => <TableRow {...props} />,
  td: ({ align, ...props }) => <CustomTableCell {...props} align={align || undefined} />,
  th: ({ align, ...props }) => <TableCell {...props} align={align || undefined} />,
  tbody: (props: any) => <TableBody {...props} />,
  thead: (props: any) => <TableHead {...props} />,
  ul: (props: any) => <Typography {...props} component='ul' />,
  ol: (props: any) => <Typography {...props} component='ol' />,
  em: (props: any) => <Typography {...props} component='em' style={{ fontStyle: 'italic' }} />,
  li: (props: any) => <ListItem {...props} />,
  img: (props: any) => <div className='blog-image-wrapper'><img {...props} className='blog-image' /></div>,
};
