import { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import { Home, Widgets, SupervisorAccount, CalendarToday } from '@material-ui/icons';

import styles from './Sidenav.module.css';
import jwtDecode from 'jwt-decode';

interface Props {
  showSidenav: boolean;
  toggleSidenav: Dispatch<boolean>;
}
let userTokenDecoded: any = null;

if (localStorage.getItem('token') !== null || localStorage.getItem('token') !== undefined) {
  userTokenDecoded = jwtDecode(localStorage.getItem('token') as string);
}

export default function Sidenav({ showSidenav, toggleSidenav }: Props) {
  return (
    <aside className={`${styles.Sidenav} ${showSidenav ? styles.sidenavOpen : ''}`}>
      <nav>
        <div className={styles.SidenavLogo}>ERP Software</div>
        <Link to="/home" className={styles.SidenavItem}>
          <Home style={{ paddingRight: 16 }} />
          Home
        </Link>

        {userTokenDecoded?.role === 'admin' && (
          <Link to="/admin" className={styles.SidenavItem}>
            <SupervisorAccount style={{ paddingRight: 16 }} />
            Admin
          </Link>
        )}

        <Link to="/inventory" className={styles.SidenavItem}>
          <Widgets style={{ paddingRight: 16 }} />
          Inventory
        </Link>

        <Link to="/planning" className={styles.SidenavItem}>
          <CalendarToday style={{ paddingRight: 16 }} />
          Planning
        </Link>
      </nav>
      {showSidenav && (
        <button onClick={() => toggleSidenav(!showSidenav)} className={styles.SidenavShadow} />
      )}
    </aside>
  );
}
