import { Dispatch } from 'react';
import { Button, Portal } from '@material-ui/core';

import ProfileIcon from '../../../../assets/profile-icon.jpg';
import './ProfileOptions.scss';
import { useAuth } from '../../../../contexts/Auth';

interface Props {
  setProfileOption: Dispatch<boolean>;
}

export default function ProfileOptions({ setProfileOption }: Props) {
  const name = localStorage.getItem('name');
  const auth = useAuth();

  const closeModal = () => {
    setProfileOption(false);
  };

  return (
    <div className="ProfileOptions">
      <img className="profile-icon" src={ProfileIcon} alt="Profile" />
      <p className="name">{name}</p>
      <Button onClick={auth.logOut} variant="outlined">
        Log Out
      </Button>

      <Portal>
        <button onClick={closeModal} className="ProfileOptions-shadow" />
      </Portal>
    </div>
  );
}
