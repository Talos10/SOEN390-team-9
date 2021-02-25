import { Route, Switch } from 'react-router-dom';
import {
  Login,
  Home,
  NotFound,
  Inventory,
  AddItem,
  ForgotPassword,
  ResetPassword,
  Planning,
  AddEvent,
  AddGoal,
  Admin
} from '../pages';
import Guard from './Guard';
import { useAuth } from '../contexts/Auth';

export default function Router() {
  const auth = useAuth();

  return (
    <Switch>
      <Guard path="/" allowIf={!auth.isLoggedIn} redirect="/home" exact>
        <Login />
      </Guard>
      <Route path="/forgot" component={ForgotPassword} exact />
      <Route path="/reset/:token" component={ResetPassword} exact />
      <Guard path="/home" component={Home} allowIf={auth.isLoggedIn} exact />
      <Guard path="/inventory" component={Inventory} allowIf={auth.isLoggedIn} exact />
      <Guard path="/admin" component={Admin} allowIf={auth.isLoggedIn} exact/>
      <Guard path="/inventory/add-item" component={AddItem} allowIf={auth.isLoggedIn} exact />
      <Guard path="/planning" component={Planning} allowIf={auth.isLoggedIn} exact />
      <Guard path="/planning/add-event" component={AddEvent} allowIf={auth.isLoggedIn} exact />
      <Guard path="/planning/add-goal" component={AddGoal} allowIf={auth.isLoggedIn} exact />
      <Route component={NotFound} />
    </Switch>
  );
}
