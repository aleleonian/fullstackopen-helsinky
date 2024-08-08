import axios from 'axios';
const baseUrl = '/api/login';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getToken = () => {
  return token;
};

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const logOut = () => {
  window.localStorage.removeItem('loggedBlogpostAppUser');
  setToken(null);
  location.reload();
};

export default { login, setToken, getToken, logOut };
