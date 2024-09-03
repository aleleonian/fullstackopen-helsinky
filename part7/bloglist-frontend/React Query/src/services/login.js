import axios from 'axios';

let token = null;

const baseUrl = '/api/login';

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const logOut = () => {
  window.localStorage.removeItem('loggedBlogpostAppUser');
  setToken(null);
  location.reload();
};

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => {
  return token;
};

export default { login, logOut, setToken, getToken };
