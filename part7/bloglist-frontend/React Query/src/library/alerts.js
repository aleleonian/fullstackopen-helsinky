import { useContext } from 'react';
import BlogContext from '../BlogContext';

export const successMessageAlert = (message) => {
    const { state, dispatch } = useContext(BlogContext);
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message });
    setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null });
    }, 5000);
};

export const errorMessageAlert = (message) => {
    const { state, dispatch } = useContext(BlogContext);

    dispatch({
        type: 'SET_ERROR_MESSAGE', payload: message
    });
    setTimeout(() => {
        dispatch({
            type: 'SET_ERROR_MESSAGE', payload: null
        });
    }, 5000);
};
