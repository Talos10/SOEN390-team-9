import { Dispatch } from 'react';
import { Link } from 'react-router-dom';
import { Home, Widgets } from '@material-ui/icons';

import styles from './Sidenav.module.css';

interface Props {
  showSidenav: boolean;
  toggleSidenav: Dispatch<boolean>;
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

        <Link to="/inventory" className={styles.SidenavItem}>
          <Widgets style={{ paddingRight: 16 }} />
          Inventory
        </Link>
      </nav>
      {showSidenav && (
        <button onClick={() => toggleSidenav(!showSidenav)} className={styles.SidenavShadow} />
      )}
    </aside>
  );
}
