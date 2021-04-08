import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  InputBase,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Card, Progress } from '../../components';
import { useBackend } from '../../contexts';
import { Order } from '../../interfaces/CustomerOrder';
import './Sales.scss';
import { Search, ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

interface Filter {
  customer: string;
  status: '' | 'completed' | 'confirmed' | 'cancelled';
}

interface Sort {
  column: 'id' | 'customer' | 'price' | 'status' | 'creationDate' | 'completionDate';
  order: boolean; // true = ascending, false = descending
}

export default function Sales() {
  const [orders, setOrders] = useState<Order[]>();
  const [filter, setFilter] = useState<Filter>({ customer: '', status: '' });
  const [sort, setSort] = useState<Sort>({ column: 'id', order: true });

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
        (date.getMonth() + 1).toString() +
        '/' +
        date.getDate().toString() +
        '/' +
        date.getFullYear().toString()
      );
    }
  };

  const applyFilters = (order: Order) => {
    if (
      order.customer.name.toLowerCase().includes(filter.customer.toLowerCase()) &&
      order.status.includes(filter.status)
    )
      return true;
    return false;
  };

  const applySorts = (order1: Order, order2: Order) => {
    const xor = (x: boolean, y: boolean) => {
      return !x !== !y;
    };
    switch (sort.column) {
      case 'id':
        return xor(order1.orderId < order2.orderId, sort.order) ? 1 : -1;
      case 'price':
        return xor(order1.totalPrice < order2.totalPrice, sort.order) ? 1 : -1;
      case 'customer':
        return xor(order1.customer.name < order2.customer.name, sort.order) ? 1 : -1;
      case 'status':
        return xor(
          (order1.status === 'confirmed' && ['completed', 'cancelled'].includes(order2.status)) ||
            (order1.status === 'completed' && ['cancelled'].includes(order2.status)),
          sort.order
        )
          ? 1
          : -1;
      case 'creationDate':
        return xor(new Date(order1.creationDate) < new Date(order2.creationDate), sort.order)
          ? -1
          : 1;
      case 'completionDate':
        return xor(new Date(order1.completionDate) < new Date(order2.completionDate), sort.order)
          ? -1
          : 1;
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
        <div className="table__search">
          <InputBase
            className="search"
            placeholder={'Search customer'}
            startAdornment={<Search />}
            onChange={e => setFilter({ ...filter, customer: e.target.value })}
          />
          <div className="table__search__filter">
            <InputLabel>Filter by status:</InputLabel>
            <Select
              onChange={e =>
                setFilter({
                  ...filter,
                  status: e.target.value as '' | 'completed' | 'confirmed' | 'cancelled'
                })
              }>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </div>
        </div>
        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__tr">
              <TableCell
                width="10%"
                onClick={() =>
                  setSort({ column: 'id', order: sort.column === 'id' ? !sort.order : true })
                }>
                <div>Order{SortIcon('id', sort)}</div>
              </TableCell>
              <TableCell
                width="18%"
                onClick={() =>
                  setSort({
                    column: 'customer',
                    order: sort.column === 'customer' ? !sort.order : true
                  })
                }>
                <div>Customer{SortIcon('customer', sort)}</div>
              </TableCell>
              <TableCell
                width="18%"
                onClick={() =>
                  setSort({
                    column: 'creationDate',
                    order: sort.column === 'creationDate' ? !sort.order : true
                  })
                }>
                <div>Creation Date (M/D/Y){SortIcon('creationDate', sort)}</div>
              </TableCell>
              <TableCell
                width="18%"
                onClick={() =>
                  setSort({
                    column: 'completionDate',
                    order: sort.column === 'completionDate' ? !sort.order : true
                  })
                }>
                <div>Completion Date{SortIcon('completionDate', sort)}</div>
              </TableCell>
              <TableCell
                width="18%"
                onClick={() =>
                  setSort({ column: 'price', order: sort.column === 'price' ? !sort.order : true })
                }>
                <div>Total Price{SortIcon('price', sort)}</div>
              </TableCell>
              <TableCell
                width="18%"
                onClick={() =>
                  setSort({
                    column: 'status',
                    order: sort.column === 'status' ? !sort.order : true
                  })
                }>
                <div>Status{SortIcon('status', sort)}</div>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .filter(applyFilters)
              .sort(applySorts)
              .map(order => (
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

function SortIcon(
  column: 'id' | 'customer' | 'price' | 'status' | 'creationDate' | 'completionDate',
  sort: Sort
) {
  return sort.column === column ? <>{sort.order ? <ArrowDropDown /> : <ArrowDropUp />}</> : <></>;
}
