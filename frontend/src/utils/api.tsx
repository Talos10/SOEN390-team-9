export const api = process.env.REACT_APP_API ?? 'http://localhost:5000'; // https://supreme-erp.herokuapp.com

/** Base user */
export const API_USER = `${api}/user`;
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
/** Get all orders */
export const API_MAN = `${api}/manufacturing/order`;
/** Get all orders */
export const API_MAN_ID = `${api}/manufacturing/order/id/`;
/** Get all events */
export const API_EVENTS = `${api}/planning/events`;
/** Get all goals */
export const API_GOALS = `${api}/planning/goals`;
/** Add an event */
export const API_ADD_EVENT = `${api}/planning/events`;
/** Add a goal */
export const API_ADD_GOAL = `${api}/planning/goals`;
/** Delete an event */
export const API_DELETE_EVENT = `${api}/planning/events/`;
/** Delete an goal */
export const API_DELETE_GOAL = `${api}/planning/goals/`;
/** Update goal */
export const API_UPDATE_GOAL = `${api}/planning/goals/`;
