import { Dispatch, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';

import ProfileOptions from './profile-options/ProfileOptions';
import styles from './Appbar.module.css';
import { Portal } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';

interface Props {
  showSidenav: boolean;
  toggleSidenav: Dispatch<boolean>;
  title?: string;
}

export default function Appbar({ showSidenav, toggleSidenav, title }: Props) {
  const [isProfileOptionOpened, setProfileOption] = useState<boolean>(false);
  const onMenuClick = (): void => toggleSidenav(!showSidenav);
  const onProfileClick = (): void => setProfileOption(!isProfileOptionOpened);

  return (
    <div className={styles.Appbar}>
      <div>
        <IconButton onClick={onMenuClick} color="inherit" className={styles.Appbar__menu}>
          <Menu />
        </IconButton>

        <span className="subtitle2">{title}</span>
      </div>

      <IconButton onClick={onProfileClick} type="button" className={styles.Appbar__profileButton}>
        <AccountCircle />
      </IconButton>

      {isProfileOptionOpened && (
        <Portal>
          <ProfileOptions setProfileOption={setProfileOption} />
        </Portal>
      )}
    </div>
  );
}
