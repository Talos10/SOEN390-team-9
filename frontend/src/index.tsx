import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';

import App from './App';
import reportWebVitals from './reportWebVitals';

import Theme from './Theme';
import './styles/normalize.css';
import './styles/styles.scss';
import { SnackbarProvider, AuthProvider, BackendProvider } from './contexts';

ReactDOM.render(
  <ThemeProvider theme={Theme}>
    <SnackbarProvider>
      <AuthProvider>
        <BackendProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </BackendProvider>
      </AuthProvider>
    </SnackbarProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
