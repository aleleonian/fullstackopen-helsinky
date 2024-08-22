import { useContext } from 'react';
import loginService from '../services/login';
import BlogContext from '../BlogContext';

export const LoginData = () => {
    const { state, dispatch } = useContext(BlogContext);
    return (
        <>
            {state.user && state.user.name} is logged in <button onClick={loginService.logOut}>log out</button>
        </>
    );
};