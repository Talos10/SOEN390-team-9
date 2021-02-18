import { Dispatch, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import './Login.scss';

interface Props {
  setLoggedIn: Dispatch<boolean | undefined>;
}

interface ErrorResponse {
  status: false;
  error: string;
}

interface SuccessResponse {
  status: true;
  name: string;
  token: string;
}

export default function LoginV2({ setLoggedIn }: Props) {
  const history = useHistory();
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const tryLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const { email, password } = getCredentials(form);
    const basicAuthToken = getBasicAuth(email, password);

    const request = await fetch('http://localhost:5000/user/login/', {
      method: 'POST',
      headers: { Authorization: basicAuthToken }
    });

    const response = (await request.json()) as ErrorResponse | SuccessResponse;

    if (!response.status) handleLoginError(response);
    else handleLoginSuccess(response);
  };

  const getCredentials = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    return { email, password };
  };

  const getBasicAuth = (email: string, password: string): string => {
    const hash = btoa(`${email}:${password}`);
    const token = `Basic ${hash}`;
    return token;
  };

  const handleLoginError = ({ error }: ErrorResponse) => {
    setError(true);
    setErrorMessage(error);
  };

  const handleLoginSuccess = ({ name, token }: SuccessResponse) => {
    localStorage.setItem('name', name);
    localStorage.setItem('token', token);
    setLoggedIn(true);
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
