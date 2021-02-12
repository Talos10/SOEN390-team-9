import { useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Login, Home, NotFound } from './pages';

export default function Router() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);


  const checkIfLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (token === null) return;
    setLoggedIn(true);
  }

  useEffect(checkIfLoggedIn, []);

  return (
    <Switch>
      <Route path="/" exact>
        {loggedIn
          ? <Redirect to="/home" />
          : <Login {...{ setLoggedIn }} />}
      </Route>
      {loggedIn &&
        <Route path="/home" component={Home} exact />}
      <Route component={NotFound} />
    </Switch>
  )
}
