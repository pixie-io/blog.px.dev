import React from 'react';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Code from './code';
import Pre from './pre';
import AnchorTag from './anchor';
import CodeRenderer from './codeRenderer';
import ListItem from './listItem';

const getChildren = (props) => props.children;

export default {
  // There is a bug in material plugin that overwrites the H1 with the default typography,
  // so this cannot be set here. The default mui h1 has been updated to match
  // the design and overwritten on homepage (only 1 implementation).
  // The problem seems to occur only on the H1 (to be investigated).

  p: (props: any) => <Typography {...props} variant='body1' />,
  pre: Pre,
  code: (props: any) => (
    <CodeRenderer
      {...props}
      code={getChildren(props)}
    />
  ),
  inlineCode: (props: any) => <Code {...props} />,
  a: (props: any) => <AnchorTag {...props} />,
  table: (props: any) => <Table {...props} />,
  tr: (props: any) => <TableRow {...props} />,
  td: ({ align, ...props }) => <TableCell {...props} align={align || undefined} />,
  th: ({ align, ...props }) => <TableCell {...props} align={align || undefined} />,
  tbody: (props: any) => <TableBody {...props} />,
  thead: (props: any) => <TableHead {...props} />,
  ul: (props: any) => <Typography {...props} component='ul' />,
  ol: (props: any) => <Typography {...props} component='ol' />,
  em: (props: any) => <Typography {...props} component='em' style={{ fontStyle: 'italic' }} />,
  li: (props: any) => <ListItem {...props} />,
  img: (props: any) => <img {...props} className='blog-image' />,
};
