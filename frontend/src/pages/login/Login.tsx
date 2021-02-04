import React, { useReducer, useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import axios from "axios";
import { BrowserRouter, Link, Route, useHistory } from 'react-router-dom';
import { Switch } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      width: 400,
      margin: `${theme.spacing(0)} auto`,
    },
    loginBtn: {
      marginTop: theme.spacing(2),
      flexGrow: 1
    },
    header: {
      textAlign: 'center',
      background: '#212121',
      color: '#fff'
    },
    card: {
      marginTop: theme.spacing(10)
    },
    loginHead: {
      fontSize: 30,
    }
  })
);

//state type

type State = {
  email: string
  password: string
  isButtonDisabled: boolean
  helperText: string
  isError: boolean
};

const initialState: State = {
  email: '',
  password: '',
  isButtonDisabled: true,
  helperText: '',
  isError: false
};

type Action = { type: 'setEmail', payload: string }
  | { type: 'setPassword', payload: string }
  | { type: 'setIsButtonDisabled', payload: boolean }
  | { type: 'loginSuccess', payload: string }
  | { type: 'loginFailed', payload: string }
  | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setEmail':
      return {
        ...state,
        email: action.payload
      };
    case 'setPassword':
      return {
        ...state,
        password: action.payload
      };
    case 'setIsButtonDisabled':
      return {
        ...state,
        isButtonDisabled: action.payload
      };
    case 'loginSuccess':
      return {
        ...state,
        helperText: action.payload,
        isError: false
      };
    case 'loginFailed':
      return {
        ...state,
        helperText: action.payload,
        isError: true
      };
    case 'setIsError':
      return {
        ...state,
        isError: action.payload
      };
  }
}

var promiseData = {
  userID: 0,
  name: "",
  role: "",
  email: ""
}

//let [userPromise, setUserPromise] = useState(Object)

let userPromise;

const Login = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  let history = useHistory();

  useEffect(() => {
    if (state.email.trim() && state.password.trim()) {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: false
      });
    } else {
      dispatch({
        type: 'setIsButtonDisabled',
        payload: true
      });
    }
  }, [state.email, state.password]);

  async function handleLogin(this: any) {



    userPromise = await axiosPostCall("http://localhost:5000/user/login/", state.email, state.password);

    console.log(userPromise)


    if ((userPromise.status)) {
      dispatch({
        type: 'loginSuccess',
        payload: 'Login Successfully'
      });
      history.push('/home')
      return true;

    } else {
      dispatch({
        type: 'loginFailed',
        payload: 'Incorrect email or password'
      });

      return false;
    }

  };


  async function axiosPostCall(url: string, email: string, pass: string) {
    const response = await axios.post(url, {}, {
      auth: {
        username: email,
        password: pass
      }
    });
    return response.data
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13 || event.which === 13) {
      state.isButtonDisabled || handleLogin();
    }
  };

  const handleEmailChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setEmail',
        payload: event.target.value
      });
    };

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    (event) => {
      dispatch({
        type: 'setPassword',
        payload: event.target.value
      });
    }
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <Card className={classes.card}>
        <CardHeader className={classes.header} title="Supreme ERP" />
        <CardContent>
          <div className={classes.loginHead}>Log in</div>
          <hr></hr>
          <div>
            <TextField
              error={state.isError}
              fullWidth
              id="email"
              type="email"
              label="E-mail"
              placeholder="E-mail"
              margin="normal"
              onChange={handleEmailChange}
              onKeyPress={handleKeyPress}
            />
            <TextField
              error={state.isError}
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Password"
              margin="normal"
              helperText={state.helperText}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
            />
          </div>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            size="large"
            color="primary"
            className={classes.loginBtn}
            onClick={handleLogin}
            disabled={state.isButtonDisabled}>
            Login
            </Button>
        </CardActions>
      </Card>
    </form>
  );
}

export default Login;