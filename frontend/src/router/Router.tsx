import { Route, Switch } from 'react-router-dom';
import { Login, Home, NotFound, Inventory, AddItem } from '../pages';
import Guard from './Guard';
import { useAuth } from '../contexts/Auth';

export default function Router() {
  const auth = useAuth();

  return (
    <Switch>
      <Guard path="/" allowIf={!auth.isLoggedIn} redirect="/home" exact>
        <Login />
      </Guard>
      <Guard path="/home" component={Home} allowIf={auth.isLoggedIn} exact />
      <Guard path="/inventory" component={Inventory} allowIf={auth.isLoggedIn} exact />
      <Guard path="/inventory/add-item" component={AddItem} allowIf={auth.isLoggedIn} exact />
      <Route component={NotFound} />
    </Switch>
  );
}
