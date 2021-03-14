import { Dispatch } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Home, Widgets, SupervisorAccount, CalendarToday } from '@material-ui/icons';

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

  return (
    <aside className={`Sidenav ${styles.Sidenav} ${showSidenav ? styles.sidenavOpen : ''}`}>
      <nav>
        <div className={styles.SidenavLogo}>ERP Software</div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname === '/home' ? 'primary' : 'default'}
            component={Link}
            to="/home">
            <Home style={{ paddingRight: 16 }} />
            Home
          </Button>
        </div>

        {auth.getRole() === 'admin' && (
          <div className="Sidenav__button">
            <Button
              color={location.pathname === '/admin' ? 'primary' : 'default'}
              component={Link}
              to="/admin">
              <SupervisorAccount style={{ paddingRight: 16 }} />
              Admin
            </Button>
          </div>
        )}

        <div className="Sidenav__button">
          <Button
            color={location.pathname === '/inventory' ? 'primary' : 'default'}
            component={Link}
            to="/inventory">
            <Widgets style={{ paddingRight: 16 }} />
            Inventory
          </Button>
        </div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname === '/manufacturing' ? 'primary' : 'default'}
            component={Link}
            to="/manufacturing">
            <Widgets style={{ paddingRight: 16 }} />
            Manufacturing
          </Button>
        </div>

        <div className="Sidenav__button">
          <Button
            color={location.pathname === '/planning' ? 'primary' : 'default'}
            component={Link}
            to="/planning">
            <CalendarToday style={{ paddingRight: 16 }} />
            Planning
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
