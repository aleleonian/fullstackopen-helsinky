import React, { useState, useContext, useEffect } from 'react';
import BlogContext from '../BlogContext';
import { useNavigate } from 'react-router-dom';
import usersService from '../services/users';
import UsersTable from './UsersTable';

export function Users() {
    const { state, dispatch } = useContext(BlogContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (state.user === null) {
            const loggedUserJSON = window.localStorage.getItem('loggedBlogpostAppUser');
            if (loggedUserJSON) {
                const user = JSON.parse(loggedUserJSON);
                dispatch({ type: 'SET_USER', payload: user });

            } else {
                navigate('/');
            }
        }
    }, [state.user, navigate, dispatch]);

    useEffect(() => {
        if (state.user) {
            usersService
                .getAll()
                .then((users) => {
                    console.log("users->", users)
                    setUsers(users);;
                })
                .catch((error) => {
                    console.log(error);
                    dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Error requesting users: ${error.message}` });

                    setTimeout(() => {
                        dispatch({ type: 'SET_ERROR_MESSAGE', payload: null });
                    }, 5000);
                });
        }
    }, [dispatch, state.user]);

    return (
        <>

            <h2>Users</h2>
            <UsersTable users={users} />
        </>
    )
}