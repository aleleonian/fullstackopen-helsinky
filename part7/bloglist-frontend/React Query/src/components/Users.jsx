import React, { useState, useContext, useEffect } from 'react';
import BlogContext from '../BlogContext';
import usersService from '../services/users';
import UsersTable from './UsersTable';
import { useAuthCheck } from '../hooks/useAuthCheck';

export function Users() {
    const { state, dispatch } = useContext(BlogContext);
    const [users, setUsers] = useState([]);

    useAuthCheck();

    useEffect(() => {
        if (state.user) {
            usersService
                .getAll()
                .then((users) => {
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