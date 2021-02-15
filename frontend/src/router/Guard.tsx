import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface GuardProps extends RouteProps {
  guard?: boolean;
  redirect?: string;
}

export default class Guard extends React.Component<GuardProps> {
  render() {
    const { component, redirect, guard, children, ...other } = this.props;
    return <Route {...other}>
      {guard
        ? component ?? children
        : <Redirect to={redirect ?? '/'} />}
    </Route>
  }
}
