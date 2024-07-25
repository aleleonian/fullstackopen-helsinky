import axios from 'axios';
import loginService from './login';

const baseUrl = '/api/users';

const getAll = async () => {
    const config = {
        headers: { Authorization: loginService.getToken() },
      };

    console.log("config->", config);

    const response = await axios.get(baseUrl, config);
    return response.data;
};

export default { getAll };
