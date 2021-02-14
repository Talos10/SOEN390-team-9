import { Dispatch } from 'react';
import { TextField, MenuItem } from '@material-ui/core';
import { Card } from '../../../components';


interface Props {
  setProductType: Dispatch<string>;
}

export default function GeneralInfo({ setProductType }: Props) {
  const onProductTypeChange = (e: React.ChangeEvent) => {
    const select = e.target as HTMLSelectElement;
    const type = select.value;
    setProductType(type);
  }

  const productTypes = [
    {
      value: 'finished',
      label: 'Finished Good',
    },
    {
      value: 'semi',
      label: 'Semi-Finished Good',
    },
    {
      value: 'raw',
      label: 'Raw Material',
    }
  ];

  return (
    <Card>
      <label htmlFor="product-name">Name</label>
      <TextField
        id="product-name"
        name="product-name"
        variant="outlined"
        required
        fullWidth />

      <label htmlFor="product-type">Product Type</label>
      <TextField
        required
        defaultValue=""
        select
        onChange={onProductTypeChange}
        id="product-type"
        name="product-type"
        variant="outlined"
        fullWidth>
        {productTypes.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Card>
  );
}

