import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TextField, Button, Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import '../Login.scss';
import { API_USER_RESET } from '../../../utils/api';

interface Token {
  token: string;
}

interface ErrorResponse {
  status: false;
  error: string;
}

interface SuccessResponse {
  status: true;
  message: string;
}
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ResetPassword() {
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { token } = useParams() as Token;

  const tryResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const { password, confirm } = getPasswords(form);
    if (password !== confirm) {
      setError(true);
      setErrorMessage('Passwords do not match');
      return;
    }

    const basicAuthToken = getBasicAuth(token, password);

    const request = await fetch(API_USER_RESET, {
      method: 'POST',
      headers: { Authorization: basicAuthToken }
    });

    const response = (await request.json()) as ErrorResponse | SuccessResponse;

    if (!response.status) handleResetPasswordError(response);
    else handleResetPasswordSuccess(response);
  };

  const getPasswords = (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const password = formData.get('password') as string;
    const confirm = formData.get('confirm') as string;
    return { password, confirm };
  };

  const getBasicAuth = (token: string, password: string): string => {
    const hash = btoa(`${token}:${password}`);
    const authorization = `Basic ${hash}`;
    return authorization;
  };

  const handleResetPasswordError = ({ error }: ErrorResponse) => {
    setError(true);
    setErrorMessage(error);
  };

  const handleResetPasswordSuccess = ({ message }: SuccessResponse) => {
    setError(false);
    setSuccessMessage(message);
    setSuccess(true);
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  return (
    <div className="Login">
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={success}
        autoHideDuration={10000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>

      <div className="login-card">
        <p className="login-card__title lead">Supreme ERP</p>
        <p className="login-card__header h4">Modify Password</p>

        <form onSubmit={tryResetPassword} className="login-card__form">
          <div className="login-card__form__email">
            <TextField
              name="password"
              type="password"
              variant="outlined"
              label="New Password"
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
              name="confirm"
              type="password"
              variant="outlined"
              label="Confirm Password"
              fullWidth
              required
              error={error}
              helperText={error ? errorMessage : ''}
              InputLabelProps={{
                shrink: true
              }}
            />
          </div>
          <div>
            <div className="login-card__form__bottom">
              <Button variant="outlined" color="primary" component={Link} to="/">
                Back to Log In
              </Button>
              <div className="login-card__form__submit">
                <Button type="submit" variant="contained" color="primary">
                  Modify Password
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
