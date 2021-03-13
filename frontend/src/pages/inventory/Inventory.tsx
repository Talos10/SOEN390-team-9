import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputBase,
  InputLabel
} from '@material-ui/core';
import { Search } from '@material-ui/icons/';

import { Card, Progress } from '../../components';
import { API_GOOD } from '../../utils/api';
import ImportButton from './csv-impex/csv-import';
import ExportButton from './csv-impex/csv-export';
import { Item } from '../../interfaces/Items';
import ItemRow from './item-row/ItemRow';
import './Inventory.scss';

interface TableState {
  allOpen: boolean;
  typeFilter: number;
  search: string;
}

function sortItemsByType(x: Item, y: Item) {
  if (
    (x.type === 'raw' && y.type === 'semi-finished') ||
    (x.type === 'raw' && y.type === 'finished') ||
    (x.type === 'semi-finished' && y.type === 'finished')
  ) {
    return -1;
  } else {
    return 1;
  }
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>();
  const [table, setTable] = useState<TableState>({
    allOpen: false,
    typeFilter: 0,
    search: ''
  });

  const filters = ['None', 'Raw', 'Semi-finished', 'Finished'];

  const getItems = async () => {
    const request = await fetch(API_GOOD, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const items = response.message as Item[];
    setItems(items.sort(sortItemsByType));
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTable({ ...table, typeFilter: event.target.value as number });
  };

  const applyFilter = (item: Item) => {
    if (
      item.name.toLowerCase().includes(table.search.toLowerCase()) &&
      (table.typeFilter === 0 || item.type === filters[table.typeFilter].toLowerCase())
    )
      return true;
    return false;
  };

  useEffect(() => {
    getItems();
  }, []);

  return items === undefined ? (
    <Progress />
  ) : (
    <main className="Inventory">
      <div className="inventory__top">
        <h1 className="title">Summary</h1>
        <div className="inventory__top__buttons">
          <ImportButton />
          <ExportButton />
          <Button color="primary" variant="contained" component={Link} to="/inventory/add-item">
            Add Item
          </Button>
        </div>
      </div>

      <Card className="summary">
        <div className="table__search">
          <InputBase
            className="search"
            placeholder={'Search items'}
            startAdornment={<Search />}
            onChange={e => setTable({ ...table, search: e.target.value })}
          />
          <div className="table__search__filter">
            <InputLabel>Filter by type:</InputLabel>
            <Select value={table.typeFilter} onChange={handleChange}>
              {filters.map((filter, i) => (
                <MenuItem key={i} value={i}>
                  {filter}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__tr">
              <TableCell width="25%">Item</TableCell>
              <TableCell width="25%">Quantity</TableCell>
              <TableCell width="25%">Type</TableCell>
              <TableCell width="25%">Vendor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(
              item =>
                applyFilter(item) && (
                  <ItemRow key={item.name + table.allOpen} {...{ props: item }} />
                )
            )}
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
