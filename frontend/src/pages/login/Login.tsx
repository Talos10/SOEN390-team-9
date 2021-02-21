import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';

import { useAuth } from '../../contexts/Auth';
import './Login.scss';

export default function LoginV2() {
  const history = useHistory();
  const auth = useAuth();
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const tryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const { email, password } = getCredentials(form);
    const response = await auth.logIn(email, password);

    if (!response.status) handleLoginError(response.error);
    else handleLoginSuccess();
  };

  const getCredentials = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    return { email, password };
  };

  const handleLoginError = (error: string) => {
    setError(true);
    setErrorMessage(error);
  };

  const handleLoginSuccess = () => {
    history.push('/home');
  };

  return (
    <div className="Login">
      <div className="login-card">
        <p className="login-card__title lead">ERP Software</p>
        <p className="login-card__header h4">Log In</p>

        <form onSubmit={tryLogin} className="login-card__form">
          <div className="login-card__form__email">
            <TextField
              name="email"
              type="email"
              variant="outlined"
              label="Email"
              fullWidth
              required
              error={error}
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>

          <div className="login-card__form__password">
            <TextField
              name="password"
              type="password"
              variant="outlined"
              label="Password"
              error={error}
              fullWidth
              required
              helperText={error ? errorMessage : ''}
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>

          <div className="login-card__form__submit">
            <Button type="submit" variant="contained" color="primary">
              Log In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
