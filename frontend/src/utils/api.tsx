const api = process.env.REACT_APP_API ?? 'http://localhost:5000';

/** Attempt to log in */
export const API_USER_LOGIN = `${api}/user/login`;
/** Send email about password reset */
export const API_USER_FORGOT = `${api}/user/forgot`;
/** Reset password */
export const API_USER_RESET = `${api}/user/reset`;
/** Get all goods */
export const API_GOOD = `${api}/good`;
/** Add a single good */
export const API_GOOD_SINGLE = `${api}/good/single`;
/** Archive a good */
export const API_ARCHIVE_GOOD = `${api}/good/archive`;
/** Get all events */
export const API_EVENTS = `${api}/planning/events`;
/** Get all goals */
export const API_GOALS = `${api}/planning/goals`;