import axios from 'axios';
const baseUrl = '/api/blogposts';

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config);

  return request.then(response => response.data)
}

const create = (data) => {
  const config = {
    headers: { Authorization: token },
  }
  return axios.post(baseUrl, data, config);
}

const update = (data) => {
  const config = {
    headers: { Authorization: token },
  }
  return axios.put(`${baseUrl}/${data.id}`, data, config);
}
export default { getAll, setToken, create, update}