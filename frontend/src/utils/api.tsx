const api = process.env.REACT_APP_API ?? 'http://localhost:5000';

export const API_USER_LOGIN = `${api}/user/login`;
export const API_USER_FORGOT = `${api}/user/forgot`;
export const API_USER_RESET = `${api}/user/reset`;
export const API_GOOD = `${api}/good`;