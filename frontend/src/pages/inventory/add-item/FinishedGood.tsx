import { TextField, InputAdornment } from '@material-ui/core';
import { Card } from '../../../components';

export default function FinishedGood() {

  return (
    <Card>
      <p>Finished Good</p>
      <label htmlFor="selling-price">Selling Price</label>
      <TextField
        type="number"
        id="selling-price"
        name="selling-price"
        variant="outlined"
        required
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }} />

      <label htmlFor="manufacturing-time">Manufacturing Time</label>
      <TextField
        type="number"
        defaultValue=""
        id="manufacturing-time"
        name="manufacturing-time"
        variant="outlined"
        fullWidth
        InputProps={{
          endAdornment: <InputAdornment position="end">minutes</InputAdornment>,
        }} />
    </Card>
  );
}

