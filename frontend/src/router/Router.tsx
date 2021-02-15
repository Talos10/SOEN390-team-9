import { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Login, Home, NotFound, Inventory, AddItem } from '../pages';
import Guard from './Guard';

export default function Router() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const checkIfLoggedIn = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(token !== null);
  }

  useEffect(checkIfLoggedIn, []);
  useEffect(checkIfLoggedIn, [location])

  return (
    <Switch>
      <Guard path="/" component={() => Login({ setLoggedIn })} guard={!loggedIn} redirect="/home" exact />
      <Guard path="/home" component={() => <Home />} guard={loggedIn} exact />
      <Guard path="/inventory" component={Inventory} guard={loggedIn} exact />
      <Guard path="/inventory/add-item" component={AddItem} guard={loggedIn} exact />
      <Route component={NotFound} />
    </Switch >
  )
}
