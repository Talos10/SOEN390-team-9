import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

import { Container } from '../../../components';
import GeneralInfo from './GeneralInfo';
import FinishedGood from './FinishedGood';
import './AddItem.scss';

export default function AddItem() {
  const [productType, setProductType] = useState<string>('');

  const tryAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tried to submit!");
  }

  return (
    <Container>
      <form className="AddItem" onSubmit={tryAddItem}>
        <div className="top">
          <h1 className="title">Add Item</h1>
          <div className="top__buttons">
            <Button variant="outlined" component={Link} to="/inventory">
              Discard
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Save
            </Button>
          </div>
        </div>

        <GeneralInfo {...{ setProductType }} />

        {productType === 'finished' && <FinishedGood />}

      </form>
    </Container>
  );
}

