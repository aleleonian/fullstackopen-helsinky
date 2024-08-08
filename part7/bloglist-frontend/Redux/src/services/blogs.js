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
  console.log("blogpost to be removed->", data);

  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  return axios.delete(`${baseUrl}/${data.id}`, config);
};

const getById = async (blogpostId) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };

  const response = await axios.get(baseUrl + `/${blogpostId}`, config);
  return response.data;
};

const addComment = async (blogpostId, comment) => {
  const config = {
    headers: { Authorization: loginService.getToken() },
  };
  const data = {};
  data.blogpostId = blogpostId;
  data.comment = comment;

  return axios.post(`${baseUrl}/${blogpostId}/comments`, data, config);

}

export default { getAll, create, update, remove, getById, addComment };
