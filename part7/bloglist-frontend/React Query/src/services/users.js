import axios from 'axios';
import loginService from './login';

const baseUrl = '/api/users';

const getAll = async () => {
    const config = {
        headers: { Authorization: loginService.getToken() },
      };

    const response = await axios.get(baseUrl, config);
    return response.data;
};

const getById = async (userId) => {
    const config = {
        headers: { Authorization: loginService.getToken() },
      };
    const response = await axios.get(baseUrl + `/${userId}`, config);
    return response.data;
};

export default { getAll, getById };
