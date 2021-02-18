import { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Login, Home, NotFound, Inventory, AddItem } from '../pages';
import AddEvent from '../pages/planning/add-event/AddEvent';
import AddGoal from '../pages/planning/add-goal/AddGoal';
import Planning from '../pages/planning/Planning';
import Guard from './Guard';

export default function Router() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState<boolean>();

  const checkIfLoggedIn = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(token !== null);
  }

  useEffect(checkIfLoggedIn, []);
  useEffect(checkIfLoggedIn, [location])

  return (
    <Switch>
      <Guard path="/" allowIf={!loggedIn} redirect="/home" exact>
        <Login {...{ setLoggedIn }} />
      </Guard>
      <Guard path="/home" component={Home} allowIf={loggedIn} exact />
      <Guard path="/inventory" component={Inventory} allowIf={loggedIn} exact />
      <Guard path="/inventory/add-item" component={AddItem} allowIf={loggedIn} exact />
      <Guard path="/planning" component={Planning} allowIf={loggedIn} exact />
      <Guard path="/planning/add-event" component={AddEvent} allowIf={loggedIn} exact />
      <Guard path="/planning/add-goal" component={AddGoal} allowIf={loggedIn} exact />
      <Route component={NotFound} />
    </Switch >
  )
}
