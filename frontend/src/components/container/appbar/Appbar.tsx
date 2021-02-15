import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
import ProfileIcon from '../../../assets/profile-icon.jpg';

import styles from './Appbar.module.css';

interface Props {
  showSidenav: boolean,
  toggleSidenav: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Appbar({ showSidenav, toggleSidenav }: Props) {
  const onMenuClick = (): void => toggleSidenav(!showSidenav);

  return (
    <div className={styles.Appbar}>
      <div>
        <IconButton onClick={onMenuClick} color="inherit" className={styles.Appbar__menu}>
          <Menu />
        </IconButton>

        <span className="subtitle2">
          Inventory
        </span>
      </div>

      <div>
        <img className={styles.Appbar__profileIcon} src={ProfileIcon} alt="Profile" />
      </div>
    </div>
  );
}