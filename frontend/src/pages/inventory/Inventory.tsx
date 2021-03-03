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
  Menu,
  MenuItem,
  InputBase
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, Search } from '@material-ui/icons/';

import { Container, Card } from '../../components';
import { API_ARCHIVE_GOOD, API_GOOD } from '../../utils/api';
import ImportButton from './csv-impex/csv-import';
import ExportButton from './csv-impex/csv-export';
import './Inventory.scss';
import { Item } from '../../interfaces/Items';
import ItemRow from './item-row/ItemRow';
import {
  sortItemsByType,
  filterForRawItems,
  filterForSemiItems,
  filterForFinishedItems
} from './Filters';

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const [displayItems, setDisplayItems] = useState<Item[]>([]);
  const [allOpen, setAllOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filter, setFilter] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const filters = ['None', 'Raw', 'Semi-finished', 'Finished'];

  const getItems = async () => {
    const request = await fetch(API_GOOD, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const items = response.message as Item[];
    setItems(items.sort(sortItemsByType));
    setDisplayItems(items);
  };

  const archiveItem = async (id: number) => {
    const data = [{ id: id, archive: true }];

    fetch(API_ARCHIVE_GOOD, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    setItems(items.filter(item => item.id !== id));
    setDisplayItems(displayItems.filter(item => item.id !== id));
  };

  const handleClickFilter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const filterItems = (type: number, search: string) => {
    let itemsList = items;
    switch (type) {
      case 0:
        break;
      case 1:
        itemsList = itemsList.filter(filterForRawItems);
        break;
      case 2:
        itemsList = itemsList.filter(filterForSemiItems);
        break;
      case 3:
        itemsList = itemsList.filter(filterForFinishedItems);
        break;
      default:
        break;
    }
    setFilter(type);
    setSearch(search);
    setDisplayItems(
      itemsList.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    );
  };

  const handleCloseFilter = (type: number) => {
    filterItems(type, search);
    setAnchorEl(null);
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container title="Inventory" className="Inventory">
      <div className="inventory__top">
        <div className="inventory__top__search">
          <h1 className="title">Summary</h1>
          <InputBase
            className="search"
            placeholder={'Search...'}
            startAdornment={<Search />}
            onChange={e => filterItems(filter, e.target.value)}
          />
          <Button color="primary" variant="outlined" onClick={handleClickFilter}>
            Filter by
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleCloseFilter}>
            <MenuItem onClick={() => handleCloseFilter(0)}>{filters[0]}</MenuItem>
            <MenuItem onClick={() => handleCloseFilter(1)}>{filters[1]}</MenuItem>
            <MenuItem onClick={() => handleCloseFilter(2)}>{filters[2]}</MenuItem>
            <MenuItem onClick={() => handleCloseFilter(3)}>{filters[3]}</MenuItem>
          </Menu>
          <p>{filters[filter]}</p>
        </div>
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
            <TableRow className="table__tr">
              <TableCell width="10%" onClick={() => setAllOpen(!allOpen)}>
                {' '}
                <IconButton size="small">
                  {allOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </TableCell>
              <TableCell width="22.5%">Item</TableCell>
              <TableCell width="22.5%">Quantity</TableCell>
              <TableCell width="22.5%">Type</TableCell>
              <TableCell width="22.5%">Vendor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayItems.map(item => (
              <ItemRow
                key={item.name + allOpen}
                {...{ props: item, archiveFunc: archiveItem, open: allOpen }}
              />
            ))}
          </TableBody>
        </Table>
      </Card>
    </Container>
  );
}
