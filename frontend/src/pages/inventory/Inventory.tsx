import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Container } from '../../components';
import './Inventory.scss';

export default function Inventory() {
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
      </div>
    </Container>
  );
}

