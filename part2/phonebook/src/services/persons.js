import axios from 'axios';

const baseUrl = import.meta.env.VITE_BACKEND;

const getAll = () => {
  return axios.get(baseUrl);
}

const create = newObject => {
  return axios.post(baseUrl, newObject);
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject);
}

const deleteIt = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update,
  delete: deleteIt, 
}