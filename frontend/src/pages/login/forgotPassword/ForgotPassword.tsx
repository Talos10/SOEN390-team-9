import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

import '../Login.scss';

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

export default function ForgotPassword() {
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const tryForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    const email = formData.get('email') as string;

    const request = await fetch('http://localhost:5000/user/forgot/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    const response = (await request.json()) as ErrorResponse | SuccessResponse;

    if (!response.status) handleForgotPasswordError(response);
    else handleForgotPasswordSuccess(response);
  };

  const handleForgotPasswordError = ({ error }: ErrorResponse) => {
    setError(true);
    setErrorMessage(error);
  };

  const handleForgotPasswordSuccess = ({ message }: SuccessResponse) => {
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
        <p className="login-card__title lead">ERP Software</p>
        <p className="login-card__header_forgot h4">Forgot Password</p>

        <p className="login-card__info">
          Lost your password? Please enter your email address. You will receive a link to create a
          new password via email.
        </p>

        <form onSubmit={tryForgotPassword} className="login-card__form">
          <div className="login-card__form__password">
            <TextField
              name="email"
              type="email"
              variant="outlined"
              label="Email"
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
                  Reset Password
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
