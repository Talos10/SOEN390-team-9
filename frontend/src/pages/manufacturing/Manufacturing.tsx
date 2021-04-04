import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputBase,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import { Orders } from '../../interfaces/Orders';
import { Card } from '../../components';
import './Manufacturing.scss';
import OrderRow from './order-row/OrderRow';
import { useBackend } from '../../contexts';
import { Search, ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

interface Filter {
  id: string;
  status: '' | 'completed' | 'confirmed' | 'processing';
}

interface Sort {
  column: 'id' | 'creationDate' | 'completionDate' | 'quantity' | 'status';
  order: boolean; // true = ascending, false = descending
}

export default function Manufacturing() {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [filter, setFilter] = useState<Filter>({ id: '', status: '' });
  const [sort, setSort] = useState<Sort>({ column: 'id', order: true });
  const { manufacturing } = useBackend();

  // Get orders from backend
  const getOrders = async () => {
    const orders = await manufacturing.getAllOrders();
    setOrders(orders);
  };

  const applyFilters = (order: Orders) => {
    if (
      order.orderId.toString().includes(filter.id) &&
      order.status.includes(filter.status)
    )
      return true;
    return false;
  };

  const applySorts = (order1: Orders, order2: Orders) => {
    const xor = (x: boolean, y: boolean) => {
      return !x !== !y;
    };
    switch (sort.column) {
      case 'id':
        return xor(order1.orderId < order2.orderId, sort.order) ? 1 : -1;
      case 'status':
        return xor(
          (order1.status === 'confirmed' && order2.status === 'completed') ||
            (order1.status === 'confirmed' && order2.status === 'processing') ||
            (order1.status === 'completed' && order2.status === 'processing'),
          sort.order
        )
          ? 1
          : -1;
      case 'quantity':
        return xor(order1.orderedGoods.length < order2.orderedGoods.length, sort.order) ? 1 : -1;
      case 'creationDate':
        return xor(new Date(order1.creationDate) < new Date(order2.creationDate), sort.order)
          ? -1
          : 1;
      case 'completionDate':
        return xor(new Date(order1.completionDate) < new Date(order2.completionDate), sort.order)
          ? -1
          : 1;
      default:
        return 1;
    }
  };

  function SortIcon(
    column: 'id' | 'creationDate' | 'completionDate' | 'quantity' | 'status',
    sort: Sort
  ) {
    return sort.column === column ? <>{sort.order ? <ArrowDropDown /> : <ArrowDropUp />}</> : <></>;
  }

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
        <div className="table__search">
          <InputBase
            className="search"
            placeholder={'Search order'}
            startAdornment={<Search />}
            onChange={e => setFilter({ ...filter, id: e.target.value })}
          />
          <div className="table__search__filter">
            <InputLabel>Filter by status:</InputLabel>
            <Select
              onChange={e =>
                setFilter({
                  ...filter,
                  status: e.target.value as '' | 'completed' | 'confirmed' | 'processing'
                })
              }>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="confirmed">Confirmed</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </div>
        </div>
        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__tr">
              <TableCell width="10%"
                onClick={() =>
                  setSort({ column: 'id', order: sort.column === 'id' ? !sort.order : true })
                }>
                  <div>Order{SortIcon('id', sort)}</div>
                </TableCell>
              <TableCell width="18%"
                onClick={() =>
                  setSort({
                    column: 'creationDate',
                    order: sort.column === 'creationDate' ? !sort.order : true
                  })
                }>
                  <div>Creation Date (M/D/Y){SortIcon('creationDate', sort)}</div>
              </TableCell>
              <TableCell width="18%"
                onClick={() =>
                  setSort({
                    column: 'completionDate',
                    order: sort.column === 'completionDate' ? !sort.order : true
                  })
                }>
                  <div>Completion Date{SortIcon('completionDate', sort)}</div>
              </TableCell>
              <TableCell width="18%"
                onClick={() =>
                  setSort({
                    column: 'quantity',
                    order: sort.column === 'quantity' ? !sort.order : true
                  })
                }>
                  <div>Quantity{SortIcon('quantity', sort)}</div>
              </TableCell>
              <TableCell width="18%"
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
                <OrderRow key={order.orderId} props={order} />
              ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
