import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  InputBase,
  InputLabel
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, Search } from '@material-ui/icons/';

import { Container, Card } from '../../components';
import { API_ARCHIVE_GOOD, API_GOOD } from '../../utils/api';
import ImportButton from './csv-impex/csv-import';
import ExportButton from './csv-impex/csv-export';
import { Item } from '../../interfaces/Items';
import ItemRow from './item-row/ItemRow';
import { useSnackbar } from '../../contexts';
import './Inventory.scss';

interface Response {
  status: true;
  message: string;
}

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
  const snackbar = useSnackbar();
  const [items, setItems] = useState<Item[]>([]);
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

  const archiveItem = async (id: number) => {
    const data = [{ id: id, archive: true }];

    const request = await fetch(API_ARCHIVE_GOOD, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    getItems();

    const responses = (await request.json()) as Response[];

    // Will only run at max 1 time because we archive 1 item at a time
    for (var i = 0; i < responses.length; i++) {
      const response = responses[i];
      if (!response.status) {
        snackbar.push(response.message);
        return;
      }
    }
    snackbar.push('Archive successful.');
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

  return (
    <Container title="Inventory" className="Inventory">
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
        <Table size="small" className="table">
          <TableHead>
            <TableRow className="table__search">
              <TableCell colSpan={2}>
                <InputBase
                  className="search"
                  placeholder={'Search items'}
                  startAdornment={<Search />}
                  fullWidth={true}
                  onChange={e => setTable({ ...table, search: e.target.value })}
                />
              </TableCell>
              <TableCell colSpan={3}>
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
              </TableCell>
            </TableRow>
            <TableRow className="table__tr">
              <TableCell width="10%">
                <IconButton
                  size="small"
                  onClick={() => setTable({ ...table, allOpen: !table.allOpen })}>
                  {table.allOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </TableCell>
              <TableCell width="22.5%">Item</TableCell>
              <TableCell width="22.5%">Quantity</TableCell>
              <TableCell width="22.5%">Type</TableCell>
              <TableCell width="22.5%">Vendor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(
              item =>
                applyFilter(item) && (
                  <ItemRow
                    key={item.name + table.allOpen}
                    {...{ props: item, archiveFunc: archiveItem, open: table.allOpen }}
                  />
                )
            )}
          </TableBody>
        </Table>
      </Card>
    </Container>
  );
}
