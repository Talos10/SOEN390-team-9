import { useState, useEffect } from 'react';
import { MenuItem, Select } from '@material-ui/core';

import { Container, Card } from '../../components';
import { useSnackbar } from '../../contexts';
import AddUserForm from './AddUserForm';
import './Admin.scss';

interface User {
  userID: number;
  name: string;
  role: string;
  email: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const snackbar = useSnackbar();
  const roles = ['admin', 'employee'];

  const tryChangeRole = async (user: User, e: React.ChangeEvent<{ value: unknown }>) => {
    const select = e.target;
    const role = select.value as string;

    if (role === 'delete-user') deleteUser(user);
    else changeRole(user, role);
  };

  const deleteUser = async ({ userID, email }: User) => {
    const request = await fetch(`http://localhost:5000/user/${userID}`, {
      method: 'DELETE',
      headers: { Authorization: `bearer ${localStorage.token}` }
    });

    const response = await request.json();
    if (!response.error) {
      snackbar.push(`${email} has been removed.`);
      getAllUsers();
    }
  };

  const changeRole = async (user: User, role: string) => {
    const { userID, name, email } = user;
    const request = await fetch(`http://localhost:5000/user/${userID}`, {
      method: 'PUT',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID, name, email, role })
    });

    const response = await request.json();
    if (!response.error) snackbar.push(`Set ${email} to ${role}.`);
  };

  const getAllUsers = async () => {
    const request = await fetch('http://localhost:5000/user/', {
      method: 'GET',
      headers: { Authorization: `bearer ${localStorage.getItem('token')}` }
    });
    const response = await request.json();
    const usersData = response as User[];
    setUsers(usersData);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Container title="Admin" className="Admin">
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
    </Container>
  );
}
