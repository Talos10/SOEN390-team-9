import { useState, useEffect, useCallback } from 'react';
import { MenuItem, Select } from '@material-ui/core';

import { Card, Progress } from '../../components';
import { useSnackbar, useBackend } from '../../contexts';
import AddUserForm from './AddUserForm';
import './Admin.scss';

interface User {
  userID: number;
  name: string;
  role: string;
  email: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>();
  const snackbar = useSnackbar();
  const { admin } = useBackend();
  const roles = ['admin', 'employee'];

  const tryChangeRole = async (user: User, e: React.ChangeEvent<{ value: unknown }>) => {
    const select = e.target;
    const role = select.value as string;

    if (role === 'delete-user') deleteUser(user);
    else changeRole(user, role);
  };

  const deleteUser = async ({ userID, email }: User) => {
    const response = await admin.deleteUser({ userID });
    if (!response.error) {
      snackbar.push(`${email} has been removed.`);
      getAllUsers();
    }
  };

  const changeRole = async (user: User, role: string) => {
    const response = await admin.changeRole(user, role);
    if (!response.error) snackbar.push(`Set ${user.email} to ${role}.`);
  };

  const getAllUsers = useCallback(async () => {
    const users = await admin.getAllUsers();
    setUsers(users);
  }, [admin]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return users === undefined ? (
    <Progress />
  ) : (
    <main className="Admin">
      <h1 className="title">Accounts</h1>
      <Card className="Admin__accounts">
        <AddUserForm roles={roles} getAllUsers={getAllUsers} />

        {users.map(user => (
          <div key={user.userID} className="Admin__account">
            <div>{user.email}</div>
            <Select defaultValue={user.role} onChange={e => tryChangeRole(user, e)}>
              {roles.map(role => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
              <MenuItem value="delete-user">Remove</MenuItem>
            </Select>
          </div>
        ))}
      </Card>
    </main>
  );
}
