import { Container } from '../../../components';
import { Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import Goal from '../shared/Goal';
import '../shared/AddForm.scss';
import { API_ADD_GOAL } from '../../../utils/api';
import { useSnackbar } from '../../../contexts';

interface newGoal {
  title?: string;
  date?: string;
}

export default function AddGoal() {
  const history = useHistory();
  const snackbar = useSnackbar();

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = parseGoal(form);

    const request = await fetch(API_ADD_GOAL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const response = await request.json();
    if(response.status) {
      history.push('/planning');
      snackbar.push(`${data?.title} has been saved`);
    }
  };

  const parseGoal = (form: HTMLFormElement): newGoal => {
    const data = new FormData(form);
    return {
      title: data.get('goal-title') as string | undefined,
      date: data.get('goal-date') as string | undefined
    };
  };

  return (
    <Container title="Add Goal">
      <form className="AddForm" onSubmit={addGoal}>
        <div className="top">
          <h1 className="title">Add Goal</h1>
          <div className="top__buttons">
            <Button variant="outlined" component={Link} to="/planning">
              Discard
            </Button>
            <Button type="submit" color="primary" variant="contained">
              Save
            </Button>
          </div>
        </div>
        <Goal />
        <div className="bottom">
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </Container>
  );
}
