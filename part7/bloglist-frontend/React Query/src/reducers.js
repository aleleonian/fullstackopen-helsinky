// src/reducers.js
import {
  SET_USER,
  SET_USERNAME,
  SET_PASSWORD,
  SET_ERROR_MESSAGE,
  SET_SUCCESS_MESSAGE,
} from './actions';

const initialState = {
  user: null,
  username: '',
  password: '',
  errorMessage: null,
  successMessage: null,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return { ...state, username: action.payload };
    case SET_USER:
      return { ...state, user: action.payload };
    case SET_PASSWORD:
      return { ...state, password: action.payload };
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    case SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
