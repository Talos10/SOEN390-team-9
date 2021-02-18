import { TextField, InputAdornment } from '@material-ui/core';
import { Card } from '../../../components';
import Recipe from './Recipe';

export default function FinishedGood() {
  return (
    <Card>
      <p>Finished Good</p>
      <label htmlFor="selling-price">Selling Price</label>
      <TextField
        type="number"
        inputProps={{ min: '0', step: '0.01' }}
        id="selling-price"
        name="selling-price"
        variant="outlined"
        required
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>
        }}
      />

      <Recipe />

      <label htmlFor="manufacturing-time">Manufacturing Time</label>
      <TextField
        required
        type="number"
        inputProps={{ min: '0' }}
        id="manufacturing-time"
        name="manufacturing-time"
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">minutes</InputAdornment>
        }}
      />
    </Card>
  );
}
