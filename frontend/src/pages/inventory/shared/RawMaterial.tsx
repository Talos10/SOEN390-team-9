import { TextField, InputAdornment } from '@material-ui/core';
import { Card } from '../../../components';

export default function RawMaterial() {
  return (
    <Card>
      <p>Raw Material</p>
      <label htmlFor="buying-price">Buying Price</label>
      <TextField
        type="number"
        inputProps={{ min: '0', step: '0.01' }}
        id="buying-price"
        name="buying-price"
        variant="outlined"
        required
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>
        }}
      />

      <label htmlFor="vendor">Vendor</label>
      <TextField id="vendor" name="vendor" variant="outlined" required fullWidth />

      <label htmlFor="edt">Estimated Delivery Time</label>
      <TextField
        required
        type="number"
        inputProps={{ min: '0' }}
        id="edt"
        name="edt"
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">days</InputAdornment>
        }}
      />
    </Card>
  );
}
