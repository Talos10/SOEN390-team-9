import { TextField } from '@material-ui/core';
import { Card } from '../../../components';

export default function Goal() {
  return (
    <Card>
      <label htmlFor="goal-title">Title</label>
      <TextField
        type="string"
        id="goal-title"
        name="goal-title"
        variant="outlined"
        required
        fullWidth
      />

      <label htmlFor="goal-date">Target Date</label>
      <TextField
        type="date"
        id="goal-date"
        name="goal-date"
        variant="outlined"
        required
        fullWidth
      />
    </Card>
  );
}
