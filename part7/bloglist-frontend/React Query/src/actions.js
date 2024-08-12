export const SET_USER = 'SET_USER';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';

export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setErrorMessage = (message) => ({
  type: SET_ERROR_MESSAGE,
  payload: message,
});

export const setSuccessMessage = (message) => ({
  type: SET_SUCCESS_MESSAGE,
  payload: message,
});
