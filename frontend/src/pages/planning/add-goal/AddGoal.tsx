import { Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

import Goal from '../shared/Goal';
import '../shared/AddForm.scss';
import { useBackend, useSnackbar } from '../../../contexts';

interface newGoal {
  title: string;
  targetDate: string;
}

export default function AddGoal() {
  const history = useHistory();
  const snackbar = useSnackbar();
  const { planning } = useBackend();

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const { title, targetDate } = parseGoal(form);

    const response = await planning.addGoal(title, targetDate);

    if (response.status) {
      history.push('/planning');
      snackbar.push(`${title} has been saved`);
    }
  };

  const parseGoal = (form: HTMLFormElement): newGoal => {
    const data = new FormData(form);
    return {
      title: data.get('goal-title') as string,
      targetDate: data.get('goal-date') as string
    };
  };

  return (
    <main>
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
      </form>
    </main>
  );
}
