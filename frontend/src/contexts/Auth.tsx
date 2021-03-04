import { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

import { API_USER_LOGIN } from '../utils/api';

interface Auth {
  isLoggedIn?: boolean;
  logIn: (email: string, password: string) => Promise<Response>;
  logOut: () => void;
  getAuthorization: () => string;
  getRole: () => 'admin' | 'employee' | undefined;
}

const AuthContext = createContext<Auth | undefined>(undefined);

interface Props {
  children?: React.ReactNode;
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

type Response = ErrorResponse | SuccessResponse;

interface JWT {
  id: number;
  role: 'admin' | 'employee';
}

export const AuthProvider = ({ children }: Props) => {
  const [isLoggedIn, setLoggedIn] = useState<boolean>();
  let jwt: JWT | undefined;

  const logIn = async (email: string, password: string) => {
    const basicAuthToken = getBasicAuth(email, password);

    const request = await fetch(API_USER_LOGIN, {
      method: 'POST',
      headers: { Authorization: basicAuthToken }
    });

    const response = (await request.json()) as Response;
    if (response.status) {
      localStorage.setItem('name', response.name);
      localStorage.setItem('token', response.token);
      setLoggedIn(true);
    }

    return response;
  };

  const getBasicAuth = (email: string, password: string): string => {
    const hash = btoa(`${email}:${password}`);
    const token = `Basic ${hash}`;
    return token;
  };

  const logOut = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  const getAuthorization = () => `bearer ${localStorage.token}`;

  const getRole = () => jwt?.role;

  const checkIfLoggedIn = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = token !== null;
    if (!isLoggedIn) logOut();
    else setLoggedIn(true);
  };

  useEffect(checkIfLoggedIn, []);

  const setJwt = () => {
    if (!isLoggedIn) return;

    const token = localStorage.getItem('token');
    if (token === null) return;

    jwt = jwtDecode(token) as JWT;
  };

  setJwt();

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, getAuthorization, getRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as Auth;
