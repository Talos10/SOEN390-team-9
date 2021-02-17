import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Container, Card } from '../../components';
import './Inventory.scss';

export default function Inventory() {

  // Replace with backend logic
  const items = [
    { name: "Bike", quantity: 19, type: "Finished-Good", vendor: '' },
    { name: "Steel", quantity: 10, type: "Raw Material", vendor: 'Mike\'s Steel Factory' },
    { name: "Wheel", quantity: 28, type: "Semi-Finished Good", vendor: '' },
  ]

  return (
    <Container>
      <div className="Inventory">
        <div className="inventory__top">
          <h1 className="title">Summary</h1>
          <div className="inventory__top__buttons">
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
              {items.map(item =>
                <tr key={item.name}>
                  <td className="name">{item.name}</td>
                  <td>{item.quantity} in stock</td>
                  <td>{item.type}</td>
                  <td>{item.vendor}</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </Container>
  );
}

