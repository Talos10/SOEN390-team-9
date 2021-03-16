import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox
} from '@material-ui/core';
import { Orders } from '../../interfaces/Orders';
import { API_MAN } from '../../utils/api';
import { Card } from '../../components';
import './Manufacturing.scss';
import OrderRow from './order-row/OrderRow';

export default function Manufacturing() {
  const [orders, setOrders] = useState<Orders[]>([]);

  // Get orders from backend
  const getOrders = async () => {
    const request = await fetch(API_MAN, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const orders = response.message as Orders[];
    setOrders(orders);
  };

  // Check all orders when clicked

  // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
  //     setState({ ...state, [event.target.name]: event.target.checked });
  //   };

  // Use orders from backend
  useEffect(() => {
    getOrders();
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
              <TableCell width="10%">
                <Checkbox color="primary" /*onChange={handleChange}*/ />
              </TableCell>
              <TableCell width="15%">Order</TableCell>
              <TableCell width="15%">Creation Date</TableCell>
              <TableCell width="15%">Product</TableCell>
              <TableCell width="15%">Due Date</TableCell>
              <TableCell width="15%">Quantity</TableCell>
              <TableCell width="15%">Status</TableCell>
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
