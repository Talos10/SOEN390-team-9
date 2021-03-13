import { Container } from '../../../components';
import { Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import Event from '../shared/Event';
import '../shared/AddForm.scss';
import { API_ADD_EVENT } from '../../../utils/api';
import { useSnackbar } from '../../../contexts';

interface newEvent {
  title?: string;
  time?: string;
  date?: string;
}

export default function AddEvent() {
  const history = useHistory();
  const snackbar = useSnackbar();

  const addEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = parseEvent(form);

    const request = await fetch(API_ADD_EVENT, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const response = await request.json();
    if (response.status) {
      history.push('/planning');
      snackbar.push(`${data?.title} has been saved`);
    }
  };

  const parseEvent = (form: HTMLFormElement): newEvent => {
    const data = new FormData(form);
    return {
      title: data.get('event-title') as string | undefined,
      date: data.get('event-date') as string | undefined,
      time: data.get('event-time') as string | undefined
    };
  };

  return (
    <Container title="AddForm">
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
        <div className="bottom">
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </Container>
  );
}
