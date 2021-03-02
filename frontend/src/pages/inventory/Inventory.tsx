import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

import { Container, Card } from '../../components';
import { API_GOOD } from '../../utils/api';
import ImportButton from './csv-impex/csv-import';
import ExportButton from './csv-impex/csv-export';
import './Inventory.scss';
import { Item } from '../../interfaces/Items';

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);

  const getItems = async () => {
    const request = await fetch(API_GOOD, {
      headers: { Authorization: `bearer ${localStorage.token}` }
    });
    const response = await request.json();
    const items = response.message as Item[];
    setItems(items);
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
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Type</th>
              <th>Vendor</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.name}>
                <td className="name">{item.name}</td>
                <td>{item.quantity} in stock</td>
                <td>{item.type}</td>
                <td>{item.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}
