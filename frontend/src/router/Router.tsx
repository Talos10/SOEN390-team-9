import { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Login, Home, NotFound, Inventory, AddItem, ForgotPassword, ResetPassword } from '../pages';
import Guard from './Guard';

export default function Router() {
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState<boolean>();

  const checkIfLoggedIn = () => {
    const token = localStorage.getItem('token');
    setLoggedIn(token !== null);
  };

  useEffect(checkIfLoggedIn, []);
  useEffect(checkIfLoggedIn, [location]);

  return (
    <Switch>
      <Guard path="/" allowIf={!loggedIn} redirect="/home" exact>
        <Login {...{ setLoggedIn }} />
      </Guard>
      <Guard path="/forgot" component={ForgotPassword} allowIf={true} exact />
      <Guard path="/reset/:token" component={ResetPassword} allowIf={true} exact />
      <Guard path="/home" component={Home} allowIf={loggedIn} exact />
      <Guard path="/inventory" component={Inventory} allowIf={loggedIn} exact />
      <Guard path="/inventory/add-item" component={AddItem} allowIf={loggedIn} exact />
      <Route component={NotFound} />
    </Switch>
  );
}
