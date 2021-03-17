import { Button, Select, MenuItem } from '@material-ui/core';
import { useSnackbar } from '../../contexts';
import { API_USER } from '../../utils/api';
import './AddUserForm.scss';

interface Props {
  roles: string[];
  getAllUsers: () => void;
}

export default function AddUserForm({ roles, getAllUsers }: Props) {
  const snackbar = useSnackbar();

  const tryAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const user = getFormData(form);

    const request = await fetch(API_USER, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${localStorage.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    const response = await request.json();
    if (response.error) snackbar.push(response.error);
    else {
      snackbar.push(`Added ${user.email}.`);
      form.reset();
      getAllUsers();
    }
  };

  const getFormData = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const name = email.split('@')[0];
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;
    return { name, email, password, role };
  };

  return (
    <form className="AddUserForm" onSubmit={tryAddAccount} autoComplete="off">
      <div className="AddUserForm__input">
        <input
          name="email"
          className="AddUserForm__input__email"
          type="email"
          placeholder="Email"
          autoComplete="off"
          required
        />
        <input
          name="password"
          className="AddUserForm__input__password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          required
        />
        <div className="AddUserForm__input__role">
          <Select name="role" defaultValue={roles[1]}>
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <Button color="primary" variant="contained" type="submit">
        Add Account
      </Button>
    </form>
  );
}
