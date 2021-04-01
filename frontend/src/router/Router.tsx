import { Route, Switch } from 'react-router-dom';
import {
  Login,
  Home,
  NotFound,
  Inventory,
  AddItem,
  ItemInfo,
  ForgotPassword,
  ResetPassword,
  Planning,
  AddEvent,
  AddGoal,
  Admin,
  CreateOrder,
  OrderInfo,
  Manufacturing,
  Sales,
  SalesOrderInfo,
  SalesCreateOrder,
  SalesCustomers,
  NewCustomer,
  Scheduling,
  ScheduleMachine
} from '../pages';
import Guard from './Guard';
import { Container } from '../components';
import { useAuth } from '../contexts/Auth';

export default function Router() {
  const auth = useAuth();

  return (
    <Switch>
      <Guard path="/" allowIf={!auth.isLoggedIn} component={Login} redirect="/home" exact />
      <Route path="/forgot" component={ForgotPassword} exact />
      <Route path="/reset/:token" component={ResetPassword} exact />
      <>
        <Container>
          {/* Home */}
          <Guard path="/home" component={Home} allowIf={auth.isLoggedIn} exact />

          {/* Admin */}
          <Guard path="/admin" component={Admin} allowIf={auth.getRole() === 'admin'} exact />

          {/* Inventory */}
          <Guard path="/inventory" component={Inventory} allowIf={auth.isLoggedIn} exact />
          <Guard path="/inventory/add-item" component={AddItem} allowIf={auth.isLoggedIn} exact />
          <Guard
            path="/inventory/item-info/:id"
            component={ItemInfo}
            allowIf={auth.isLoggedIn}
            exact
          />

          {/* Manufacturing */}
          <Guard path="/manufacturing" component={Manufacturing} allowIf={auth.isLoggedIn} exact />
          <Guard
            path="/manufacturing/create-order"
            component={CreateOrder}
            allowIf={auth.isLoggedIn}
            exact
          />
          <Guard
            path="/manufacturing/create-order/:id"
            component={CreateOrder}
            allowIf={auth.isLoggedIn}
            exact
          />
          <Guard
            path="/manufacturing/order-info/:id"
            component={OrderInfo}
            allowIf={auth.isLoggedIn}
            exact
          />

          {/* Sales */}
          <Guard path="/sales" component={Sales} allowIf={auth.isLoggedIn} exact />
          <Guard
            path="/sales/customers"
            component={SalesCustomers}
            allowIf={auth.isLoggedIn}
            exact
          />
          <Guard
            path="/sales/customers/new-customer"
            component={NewCustomer}
            allowIf={auth.isLoggedIn}
            exact
          />
          <Guard
            path="/sales/create-order/"
            component={SalesCreateOrder}
            allowIf={auth.isLoggedIn}
            exact
          />
          <Guard
            path="/sales/order-info/:id"
            component={SalesOrderInfo}
            allowIf={auth.isLoggedIn}
            exact
          />
          {/* Planning */}
          <Guard path="/planning" component={Planning} allowIf={auth.isLoggedIn} exact />
          <Guard path="/planning/add-event" component={AddEvent} allowIf={auth.isLoggedIn} exact />
          <Guard path="/planning/add-goal" component={AddGoal} allowIf={auth.isLoggedIn} exact />

          {/* Scheduling */}
          <Guard path="/scheduling" component={Scheduling} allowIf={auth.isLoggedIn} exact />
          <Guard path="/scheduling/schedule-machine" component={ScheduleMachine} allowIf={auth.isLoggedIn} exact />
        </Container>
      </>
      <Route component={NotFound} />
    </Switch>
  );
}
