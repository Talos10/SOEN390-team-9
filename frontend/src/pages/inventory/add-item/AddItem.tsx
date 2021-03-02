import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

import { Container } from '../../../components';
import { API_GOOD_SINGLE } from '../../../utils/api';
import { GeneralInfo, FinishedGood, Properties, SemiFinishedGood, RawMaterial } from '../shared';
import { useSnackbar } from '../../../contexts';
import './AddItem.scss';

interface Property {
  name: string;
  value: string;
}

interface Ingredient {
  id: number;
  quantity: number;
}

interface FinishedGoodData {
  name?: string;
  type?: 'finished';
  cost?: number;
  price?: number;
  components?: Ingredient[];
  processTime?: number;
  properties?: Property[];
}

interface SemiFinishedGoodData {
  name?: string;
  type?: 'semi-finished';
  components?: Ingredient[];
  processTime?: number;
  properties?: Property[];
  cost?: number;
}

interface RawMaterialData {
  name?: string;
  type?: 'raw';
  cost?: number;
  vendor?: string;
  processTime?: number;
  properties?: Property[];
}

export default function AddItem() {
  const [productType, setProductType] = useState<string>('');
  const history = useHistory();
  const snackbar = useSnackbar();

  const tryAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = parseForm(form);

    const request = await fetch(API_GOOD_SINGLE, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const response = await request.json();
    if (response.status) {
      history.push('/inventory');
      snackbar.push(`${data?.name} has been saved.`);
    }
  };

  const parseForm = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const type = formData.get('product-type');

    switch (type) {
      case 'finished':
        return parseFinished(formData);
      case 'semi':
        return parseSemi(formData);
      case 'raw':
        return parseRaw(formData);
      default:
        return;
    }
  };

  const parseFinished = (formData: FormData): FinishedGoodData => {
    return {
      name: formData.get('product-name') as string | undefined,
      type: 'finished',
      cost: Number(formData.get('selling-price') as string | undefined),
      price: 0,
      components: getComponents(formData),
      processTime: Number(formData.get('manufacturing-time') as string | undefined),
      properties: getProperties(formData)
    };
  };

  const parseSemi = (formData: FormData): SemiFinishedGoodData => {
    return {
      name: formData.get('product-name') as string | undefined,
      type: 'semi-finished',
      components: getComponents(formData),
      processTime: Number(formData.get('manufacturing-time') as string | undefined),
      properties: getProperties(formData),
      cost: 0
    };
  };

  const parseRaw = (formData: FormData): RawMaterialData => {
    return {
      name: formData.get('product-name') as string | undefined,
      type: 'raw',
      cost: Number(formData.get('buying-price') as string | undefined),
      vendor: formData.get('vendor') as string | undefined,
      processTime: Number(formData.get('edt') as string | undefined),
      properties: getProperties(formData)
    };
  };

  const getComponents = (formData: FormData) => {
    const ingredientIds = formData.getAll('ingredient') as string[];
    const frequencyMap: { [id: string]: number } = {};
    ingredientIds.forEach(id => {
      if (id in frequencyMap) frequencyMap[id] += 1;
      else frequencyMap[id] = 1;
    });
    return Object.entries(frequencyMap).map(
      ([id, frequency]) => ({ id: Number(id), quantity: frequency } as Ingredient)
    );
  };

  const getProperties = (formData: FormData) => {
    const names = formData.getAll('property-name');
    const values = formData.getAll('property-value');
    const properties: Property[] = [];
    for (let i = 0; i < names.length; i++) {
      properties.push({
        name: names[i] as string,
        value: values[i] as string
      });
    }
    return properties;
  };

  return (
    <Container title="Add Item">
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
        {productType === 'semi' && <SemiFinishedGood />}
        {productType === 'raw' && <RawMaterial />}

        {productType && <Properties />}

        <div className="bottom">
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </Container>
  );
}
