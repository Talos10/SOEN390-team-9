import { Container, Card } from '../../components';
import './Planning.scss';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import { useState } from 'react';

export default function Planning() {
  //Dummy data (TODO Sprint 3: replace with backend logic)
  const events = [
    { id: 1, date: '03/18/2021', time: '10:00 AM', title: "Bruno's birthday celebration" },
    { id: 2, date: '03/24/2021', time: '12:30 PM', title: 'Lunch and Learn' },
    { id: 3, date: '04/14/2021', time: '11:00 AM', title: 'CEO company wide meeting' },
    {
      id: 4,
      date: '05/20/2021',
      time: '2:00 PM',
      title: 'Meeting with vendor for new raw materials'
    }
  ];

  //Dummy data (TODO Sprint 3: replace with backend logic)
  const [goals, setGoals] = useState([
    { id: 1, completed: true, date: '04/10/2021', title: 'Build 2000 bikes' },
    { id: 2, completed: false, date: '05/25/2021', title: 'Make $200 000 of profit' },
    { id: 3, completed: false, date: '12/01/2021', title: 'Sell 1500 bikes' }
  ]);

  const handleCheckboxTick = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoals(
      goals.map(goal =>
        goal.id === Number(event.target.value) ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  return (
    <Container title="Planning" className="Planning">
      <div className="planning_top">
        <h1 className="title table_title">Events</h1>
        <div className="planning_top_buttons">
          <Button
            className="add_event_button"
            color="primary"
            variant="contained"
            component={Link}
            to="/planning/add-event">
            Add Event
          </Button>
          <Button color="primary" variant="contained" component={Link} to="/planning/add-goal">
            Add Goal
          </Button>
        </div>
      </div>
      <Card className="table_title">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td className="name">{event.date}</td>
                <td>{event.time}</td>
                <td>{event.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="planning_top">
        <h1 className="title">Goals</h1>
      </div>
      <Card className="table_title">
        <table>
          <thead>
            <tr>
              <th>Completed</th>
              <th>Target Date</th>
              <th>Goal</th>
            </tr>
          </thead>
          <tbody>
            {/*Display incomplete goals first*/}
            {goals
              .filter(goal => goal.completed === false)
              .map(goal => (
                <tr key={goal.id}>
                  <td className="name">
                    <Checkbox
                      value={goal.id}
                      checked={goal.completed}
                      onChange={handleCheckboxTick}
                      name="checkedB"
                      color="primary"
                    />
                  </td>
                  <td>{goal.date}</td>
                  <td>{goal.title}</td>
                </tr>
              ))}
            {/* Display completed goals at end */}
            {goals
              .filter(goal => goal.completed === true)
              .map(goal => (
                <tr key={goal.id} className="goal_completed">
                  <td className="name">
                    <Checkbox
                      value={goal.id}
                      checked={goal.completed}
                      onChange={handleCheckboxTick}
                      name="checkedB"
                      color="primary"
                    />
                  </td>
                  <td>{goal.date}</td>
                  <td>{goal.title}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </Container>
  );
}
