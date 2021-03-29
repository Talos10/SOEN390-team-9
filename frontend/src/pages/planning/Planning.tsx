import { Card } from '../../components';
import './Planning.scss';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import { useEffect, useState } from 'react';

import { useBackend } from '../../contexts';

interface Event {
  id: number;
  date: string;
  time: string;
  title: string;
}

interface Goal {
  id: number;
  completed: boolean;
  targetDate: string;
  title: string;
}

export default function Planning() {
  const [events, setEvents] = useState<Event[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const { planning } = useBackend();

  const getEvents = async () => {
    const events = await planning.getAllEvents();

    if (Array.isArray(events)) {
      events.forEach(function (event) {
        event.date = event.date.substring(0, 10);
      });
      setEvents(events);
    }
  };

  const getGoals = async () => {
    const goals = await planning.getAllGoals();

    if (Array.isArray(goals)) {
      goals.forEach(goal => {
        goal.targetDate = goal.targetDate.substring(0, 10);
        goal.completed = !!Number(goal.completed);
      });
      setGoals(goals);
    }
  };

  const handleCheckboxTick = async (id: number) => {
    const goal = goals.find(goal => goal.id === id);
    if (!goal) return;

    const { completed, targetDate, title } = {
      ...goal,
      completed: goal ? !goal.completed : false
    };

    const response = await planning.updateGoal(id, completed, targetDate, title);
    if (response.status) {
      getGoals();
    }
  };

  const deleteEvent = async (id: number) => {
    const response = await planning.deleteEvent(id);
    if (response.status) {
      getEvents();
    }
  };

  const deleteGoal = async (id: number) => {
    const response = await planning.deleteGoal(id);
    if (response.status) {
      getGoals();
    }
  };

  useEffect(() => {
    getGoals();
    getEvents();
    // eslint-disable-next-line
  }, []);

  return (
    <main className="Planning">
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td className="name">{event.date}</td>
                <td>{event.time.substring(0, event.time.length - 3)}</td>
                <td>{event.title}</td>
                <td className="delete">
                  <IconButton
                    name="event"
                    onClick={() =>
                      window.confirm('Are you sure you wish to delete this event?') &&
                      deleteEvent(event.id)
                    }>
                    <DeleteIcon />
                  </IconButton>
                </td>
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
              <th></th>
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
                      onChange={() => handleCheckboxTick(goal.id)}
                      name="checkedB"
                      color="primary"
                    />
                  </td>
                  <td>{goal.targetDate}</td>
                  <td>{goal.title}</td>
                  <td className="delete">
                    <IconButton
                      name="goal"
                      onClick={() =>
                        window.confirm('Are you sure you wish to delete this goal?') &&
                        deleteGoal(goal.id)
                      }>
                      <DeleteIcon />
                    </IconButton>
                  </td>
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
                      onChange={() => handleCheckboxTick(goal.id)}
                      name="checkedB"
                      color="primary"
                    />
                  </td>
                  <td>{goal.targetDate}</td>
                  <td>{goal.title}</td>
                  <td className="delete">
                    <IconButton
                      name="goal"
                      onClick={() =>
                        window.confirm('Are you sure you wish to delete this goal?') &&
                        deleteGoal(goal.id)
                      }>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </main>
  );
}
