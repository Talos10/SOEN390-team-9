import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

import { Container, Card } from '../../components';
import { API_ARCHIVE_GOOD, API_GOOD } from '../../utils/api';
import ImportButton from './csv-impex/csv-import';
import ExportButton from './csv-impex/csv-export';
import './Inventory.scss';
import { Item } from '../../interfaces/Items';
import ItemRow from './item-row/ItemRow';
import sortItemsByType from './Filters'


export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);

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

    fetch(API_ARCHIVE_GOOD, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    setItems(items.filter(item => item.id !== id))
  };

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Container>
      <div className="Inventory">
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
              <TableRow>
                <TableCell width="10%" />
                <TableCell width="22.5%">Item</TableCell>
                <TableCell width="22.5%">Quantity</TableCell>
                <TableCell width="22.5%">Type</TableCell>
                <TableCell width="22.5%">Vendor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <ItemRow key={item.name} {...{props:item, archiveFunc:archiveItem}} />
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </Container>
  );
}
