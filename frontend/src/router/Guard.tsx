import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface GuardProps extends RouteProps {
  component?: any;
  allowIf?: boolean;
  redirect?: string;
}

export default class Guard extends React.Component<GuardProps> {
  render() {
    const { component, redirect, allowIf, children, ...routeProps } = this.props;
    const Component: any = component;

    return (
      <Route {...routeProps}>
        {allowIf ? (
          Component ? (
            <Component />
          ) : (
            children
          )
        ) : allowIf !== undefined ? ( // If undefined, give the state some time to load before redirecting.
          <Redirect to={redirect ?? '/'} />
        ) : (
          <></>
        )}
      </Route>
    );
  }
}
