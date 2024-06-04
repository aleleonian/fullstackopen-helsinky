export const SET_USER = 'SET_USER';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SET_ERROR_MESSAGE = 'SET_ERROR_MESSAGE';
export const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';
export const SET_USERNAME = 'SET_USERNAME';
export const SET_BLOGS = 'SET_BLOGS';

export const setBlogs = (blogs) => ({
  type: SET_BLOGS,
  payload: blogs,
});


export const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

export const setUsername = (username) => ({
  type: SET_USERNAME,
  payload: username,
});

export const setPassword = (password) => ({
  type: SET_PASSWORD,
  payload: password,
});

export const setErrorMessage = (message) => ({
  type: SET_ERROR_MESSAGE,
  payload: message,
});

export const setSuccessMessage = (message) => ({
  type: SET_SUCCESS_MESSAGE,
  payload: message,
});
