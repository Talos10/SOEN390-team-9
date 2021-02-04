import React from 'react';
import { Welcome, Home, Login } from './pages';
import { Route, Switch } from 'react-router-dom';

export default function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} exact />
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home}></Route>
    </Switch>
  )
}
