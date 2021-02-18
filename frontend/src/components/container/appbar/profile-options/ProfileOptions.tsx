import { Dispatch } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Portal } from '@material-ui/core';

import ProfileIcon from '../../../../assets/profile-icon.jpg';
import './ProfileOptions.scss';

interface Props {
  setProfileOption: Dispatch<boolean>;
}

export default function ProfileOptions({ setProfileOption }: Props) {
  const name = localStorage.getItem("name");
  const history = useHistory();

  const logout = () => {
    localStorage.clear();
    history.push("/");
  }

  const closeModal = () => {
    setProfileOption(false);
  }

  return (
    <div className="ProfileOptions">
      <img className="profile-icon" src={ProfileIcon} alt="Profile" />
      <p className="name">{name}</p>
      <Button onClick={logout} variant="outlined">Log Out</Button>

      <Portal>
        <button onClick={closeModal} className="ProfileOptions-shadow" />
      </Portal>
    </div>
  )
}