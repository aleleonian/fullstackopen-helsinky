import axios from 'axios';
import loginService from './login';
const baseUrl = '/api/blogposts';

const getAll = () => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  const request = axios.get(baseUrl, config);

  return request.then((response) => response.data);
};

const create = (data) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  return axios.post(baseUrl, data, config);
};

const update = (data) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  return axios.put(`${baseUrl}/${data.id}`, data, config);
};

const remove = (data) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  return axios.delete(`${baseUrl}/${data.id}`, config);
};

export default { getAll, create, update, remove };
