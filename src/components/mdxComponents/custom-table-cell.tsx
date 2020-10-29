import withStyles from '@material-ui/core/styles/withStyles';
import { Theme } from '@material-ui/core';
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import parseMd from './parseMd';

const CustomTableCell = withStyles((theme: Theme) => ({
  td: {
    '& li, & *': theme.typography.body2,
  },
}))((props: any) => {
  const { children, classes, align } = props;
  let parsableChildren;
  if (children && children.props && children.props.originalType === 'inlineCode') {
    parsableChildren = children.props.children.split('//').join('\n');
  }
  return (
    <TableCell className={classes.td} align={align || undefined}>{parsableChildren ? parseMd(parsableChildren) : children}</TableCell>
  );
});

export default CustomTableCell;
