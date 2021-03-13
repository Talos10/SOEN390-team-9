import { TableCell, TableRow } from '@material-ui/core';
import { Item } from '../../../interfaces/Items';
import './ItemRow.scss';
import { useHistory } from 'react-router';

interface Props {
  props: Item;
}

export default function ItemRow({ props }: Props) {
  const history = useHistory();

  return (
    <>
      <TableRow
        onClick={() => history.push(`/inventory/item-info/${props.id}`)}
        className="ItemRow table-row">
        <TableCell scope="row">{props.name}</TableCell>
        <TableCell align="left">{props.quantity} in stock</TableCell>
        <TableCell align="left" style={{ textTransform: 'capitalize' }}>
          {props.type}
        </TableCell>
        <TableCell align="left">{props.vendor}</TableCell>
      </TableRow>
    </>
  );
}
