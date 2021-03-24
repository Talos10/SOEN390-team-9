import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Orders } from '../../interfaces/Orders';
import { Card } from '../../components';
import './Manufacturing.scss';
import OrderRow from './order-row/OrderRow';
import { useBackend } from '../../contexts';

export default function Manufacturing() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const { manufacturing } = useBackend();

  // Get orders from backend
  const getOrders = async () => {
    const orders = await manufacturing.getAllOrders();
    setOrders(orders);
  };

  // Check all orders when clicked

  // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //     setState({ ...state, [event.target.name]: event.target.checked });
  //   };

  // Use orders from backend
  useEffect(() => {
    getOrders();
    //eslint-disable-next-line
  }, []);

  return (
    <div className="Manufacturing">
      <div className="manufacturing__top">
        <h1 className="title">Manufacturing</h1>
        <div className="manufacturing__top__buttons">
          <Button
            color="primary"
            variant="contained"
            component={Link}
            to="/manufacturing/create-order">
            Create Order
          </Button>
        </div>
      </div>
      <Card className="summary">
        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__tr">
              <TableCell width="10%">Order</TableCell>
              <TableCell width="20%">Creation Date</TableCell>
              <TableCell width="20%">Due Date</TableCell>
              <TableCell width="20%">Quantity</TableCell>
              <TableCell width="20%">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <OrderRow key={order.orderId} props={order} />
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
