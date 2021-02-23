import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

import { Container } from '../../../components';
import { GeneralInfo, FinishedGood, Properties, SemiFinishedGood, RawMaterial } from '../shared';
import './AddItem.scss';

interface Property {
  name: string;
  value: string;
}

interface FinishedGoodData {
  name?: string;
  type?: 'finished';
  price?: number;
  recipe?: string[];
  mtime?: number;
  properties?: Property[];
}

interface SemiFinishedGoodData {
  name?: string;
  type?: 'semi';
  recipe?: string[];
  mtime?: number;
  properties?: Property[];
}

interface RawMaterialData {
  name?: string;
  type?: 'raw';
  price?: number;
  vendor?: string;
  edt?: number;
  properties?: Property[];
}

export default function AddItem() {
  const [productType, setProductType] = useState<string>('');

  const tryAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = parseForm(form);

    // TODO: Replace with backend logic
    console.log(data);
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
      price: Number(formData.get('selling-price') as string | undefined),
      recipe: getRecipe(formData),
      mtime: Number(formData.get('manufacturing-time') as string | undefined),
      properties: getProperties(formData)
    };
  };

  const parseSemi = (formData: FormData): SemiFinishedGoodData => {
    return {
      name: formData.get('product-name') as string | undefined,
      type: 'semi',
      recipe: getRecipe(formData),
      mtime: Number(formData.get('manufacturing-time') as string | undefined),
      properties: getProperties(formData)
    };
  };

  const parseRaw = (formData: FormData): RawMaterialData => {
    return {
      name: formData.get('product-name') as string | undefined,
      type: 'raw',
      price: Number(formData.get('buying-price') as string | undefined),
      vendor: formData.get('vendor') as string | undefined,
      edt: Number(formData.get('edt') as string | undefined),
      properties: getProperties(formData)
    };
  };

  const getRecipe = (formData: FormData) => {
    const recipes = formData.getAll('ingredient');
    return recipes.map(ingredient => ingredient as string);
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
