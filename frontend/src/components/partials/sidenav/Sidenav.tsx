import React from 'react';
import { Home } from '@material-ui/icons';

import styles from './Sidenav.module.css';

interface Props {
  showSidenav: boolean,
  toggleSidenav: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidenav({ showSidenav, toggleSidenav }: Props) {
  return (
    <aside className={`${styles.Sidenav} ${showSidenav ? styles.sidenavOpen : ''}`}>
      <nav>
        <div className={styles.SidenavLogo}>
          ERP Software
        </div>
        <a href="/home" className={styles.SidenavItem}>
          <Home style={{ paddingRight: 16 }} />
          Home
        </a>
      </nav>
      {showSidenav && <button onClick={() => toggleSidenav(!showSidenav)} className={styles.SidenavShadow} />}
    </aside>
  );
}