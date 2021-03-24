import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@material-ui/core';
import { Card, Progress } from '../../components';
import { useBackend } from '../../contexts';
import { Order } from '../../interfaces/CustomerOrder';
import './Sales.scss';

export default function Sales() {
  const [orders, setOrders] = useState<Order[]>();

  const { sales } = useBackend();
  const history = useHistory();

  const toOrderInfo = (id: number) => {
    history.push('/sales/order-info/' + id);
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === null || dateStr === '') {
      return 'N/A';
    } else {
      const date = new Date(dateStr);
      return (
        date.getDate().toString() +
        '/' +
        date.getMonth().toString() +
        '/' +
        date.getFullYear().toString()
      );
    }
  };

  const getOrders = useCallback(async () => {
    const orders = await sales.getAllOrders();
    setOrders(orders);
  }, [sales]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return orders === undefined ? (
    <Progress />
  ) : (
    <div className="Sales">
      <div className="sales__top">
        <h1 className="title">Customer Orders</h1>
        <div className="sales__top__buttons">
          <Button color="primary" variant="outlined" component={Link} to="/sales/customers">
            Customers
          </Button>
          <Button color="primary" variant="contained" component={Link} to="/sales/create-order">
            Create Order
          </Button>
        </div>
      </div>
      <Card className="summary">
        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__tr">
              <TableCell width="10%">Order</TableCell>
              <TableCell width="18%">Customer</TableCell>
              <TableCell width="18%">Creation Date</TableCell>
              <TableCell width="18%">Completion Date</TableCell>
              <TableCell width="18%">Total Price</TableCell>
              <TableCell width="18%">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow
                key={order.orderId}
                className="table-row"
                onClick={() => toOrderInfo(order.orderId)}>
                <TableCell>#{order.orderId}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{formatDate(order.creationDate)}</TableCell>
                <TableCell>{formatDate(order.completionDate)}</TableCell>
                <TableCell>$ {order.totalPrice}</TableCell>
                <TableCell>
                  <span className={order.status}>
                    <Chip size="small" label={order.status} />
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
