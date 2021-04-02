import { TableCell, TableRow, Chip } from '@material-ui/core';
import { useHistory } from 'react-router';
import { Orders } from '../../../interfaces/Orders';
import './OrderRow.scss';

interface Props {
  props: Orders;
}

export default function OrderRow({ props }: Props) {
  const history = useHistory();

  // Formatting date objects
  const formatdate = (props: string) => {
    if (props === null || props === '') {
      return 'N/A';
    } else {
      const date = new Date(props);
      return (
        (date.getMonth() + 1).toString() +
        '/' +
        date.getDate().toString() +
        '/' +
        date.getFullYear().toString()
      );
    }
  };

  // Formatting Status objects
  const formatstatus = (props: string) => {
    return props.charAt(0).toUpperCase() + props.slice(1);
  };

  const toOrderInfo = () => {
    history.push('/manufacturing/order-info/' + props.orderId);
  };

  return (
    <TableRow className="table-row" onClick={toOrderInfo}>
      <TableCell>#{props.orderId}</TableCell>
      <TableCell>{formatdate(props.creationDate)}</TableCell>
      <TableCell>{formatdate(props.completionDate)}</TableCell>
      <TableCell>{props.orderedGoods.length}</TableCell>
      <TableCell>
        <span className={props.status}>
          <Chip size="small" label={formatstatus(props.status)} />
        </span>
      </TableCell>
    </TableRow>
  );
}
