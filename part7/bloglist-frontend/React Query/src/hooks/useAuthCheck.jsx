import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogContext from '../BlogContext';
import loginService from '../services/login'; // Adjust the path as needed

export function useAuthCheck() {
    const { state, dispatch } = useContext(BlogContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (state.user === null) {
            const loggedUserJSON = window.localStorage.getItem('loggedBlogpostAppUser');
            if (loggedUserJSON) {
                const user = JSON.parse(loggedUserJSON);
                loginService.setToken(user.token);
                dispatch({ type: 'SET_USER', payload: user });
            } else {
                navigate('/');
            }
        }
    }, [state.user, navigate, dispatch]);
}
