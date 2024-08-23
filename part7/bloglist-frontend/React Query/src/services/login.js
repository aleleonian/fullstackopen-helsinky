import axios from 'axios';
import blogService from '../services/blogs';

const baseUrl = '/api/login';

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

const logOut = () => {
  window.localStorage.removeItem('loggedBlogpostAppUser');
  blogService.setToken(null);
  location.reload();
};

export default { login, logOut };
