import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  listItem: {
    color: 'inherit',
    fontFamily: 'inherit',
    fontStyle: 'inherit',
    fontSize: 'inherit',
    lineHeight: 'inherit',
  },
}));
const ListItem = ({ children }) => (<li className={useStyles().listItem}>{children}</li>);
export default ListItem;
