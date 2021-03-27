import { Dispatch, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@material-ui/core';
import {
  Home,
  Widgets,
  SupervisorAccount,
  CalendarToday,
  Build,
  Timeline,
  QueryBuilder
} from '@material-ui/icons';

import { useAuth } from '../../../contexts';
import styles from './Sidenav.module.css';
import './Sidenav.scss';

interface Props {
  showSidenav: boolean;
  toggleSidenav: Dispatch<boolean>;
}

export default function Sidenav({ showSidenav, toggleSidenav }: Props) {
  const location = useLocation();
  const auth = useAuth();

  // When the page changes, we want the sidenav to close.
  useEffect(() => {
    toggleSidenav(false);
  }, [location, toggleSidenav]);

  return (
    <aside className={`Sidenav ${styles.Sidenav} ${showSidenav ? styles.sidenavOpen : ''}`}>
      <nav>
        <div className={styles.SidenavLogo}>Supreme ERP</div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname.indexOf('home') === 0 ? 'primary' : 'default'}
            component={Link}
            to="/home">
            <Home style={{ paddingRight: 16 }} />
            Home
          </Button>
        </div>

        {auth.getRole() === 'admin' && (
          <div className="Sidenav__button">
            <Button
              color={location.pathname.indexOf('/admin') === 0 ? 'primary' : 'default'}
              component={Link}
              to="/admin">
              <SupervisorAccount style={{ paddingRight: 16 }} />
              Admin
            </Button>
          </div>
        )}

        <div className="Sidenav__button">
          <Button
            color={location.pathname.indexOf('/inventory') === 0 ? 'primary' : 'default'}
            component={Link}
            to="/inventory">
            <Widgets style={{ paddingRight: 16 }} />
            Inventory
          </Button>
        </div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname.indexOf('/manufacturing') === 0 ? 'primary' : 'default'}
            component={Link}
            to="/manufacturing">
            <Build style={{ paddingRight: 16 }} />
            Manufacturing
          </Button>
        </div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname.indexOf('/sales') === 0 ? 'primary' : 'default'}
            component={Link}
            to="/sales">
            <Timeline style={{ paddingRight: 16 }} />
            Sales
          </Button>
        </div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname.indexOf('/planning') === 0 ? 'primary' : 'default'}
            component={Link}
            to="/planning">
            <CalendarToday style={{ paddingRight: 16 }} />
            Planning
          </Button>
        </div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname.indexOf('/scheduling') === 0 ? 'primary' : 'default'}
            component={Link}
            to="/scheduling">
            <QueryBuilder style={{ paddingRight: 16 }} />
            Scheduling
          </Button>
        </div>
      </nav>

      {showSidenav && (
        <button
          onClick={() => toggleSidenav(!showSidenav)}
          className={`SidenavShadow ${styles.SidenavShadow}`}
        />
      )}
    </aside>
  );
}
