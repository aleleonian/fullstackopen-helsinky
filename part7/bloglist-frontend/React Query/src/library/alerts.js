export const successMessageAlert = (message, dispatch) => {
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message });
    setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null });
    }, 5000);
};

export const errorMessageAlert = (message, dispatch) => {
    dispatch({
        type: 'SET_ERROR_MESSAGE', payload: message
    });
    setTimeout(() => {
        dispatch({
            type: 'SET_ERROR_MESSAGE', payload: null
        });
    }, 5000);
};
