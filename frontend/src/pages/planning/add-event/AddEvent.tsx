import { Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import Event from '../shared/Event';
import '../shared/AddForm.scss';
import { useSnackbar, useBackend } from '../../../contexts';

export default function AddEvent() {
  const history = useHistory();
  const snackbar = useSnackbar();
  const { planning } = useBackend();

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const { title, time, date } = parseEvent(form);

    const response = await planning.addEvent(date, time, title);

    if (response.status) {
      history.push('/planning');
      snackbar.push(`${title} has been saved`);
    }
  };

  const parseEvent = (form: HTMLFormElement) => {
    const data = new FormData(form);
    return {
      title: data.get('event-title') as string,
      date: data.get('event-date') as string,
      time: data.get('event-time') as string
    };
  };

  return (
    <main>
      <form className="AddForm" onSubmit={addEvent}>
        <div className="top">
          <h1 className="title">Add Event</h1>
          <div className="top__buttons">
            <Button variant="outlined" component={Link} to="/planning">
              Discard
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Save
            </Button>
          </div>
        </div>
        <Event />
      </form>
    </main>
  );
}
