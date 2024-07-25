import React, { useState } from 'react';
import { useEffect } from 'react';
import usersService from '../services/users';
import { useDispatch } from 'react-redux';
import { setErrorMessage } from '../actions';

export const Users = () => {
    const dispatch = useDispatch();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        usersService
            .getAll()
            .then((users) => {
                setUsers(users);
            })
            .catch((error) => {
                console.log(error);
                dispatch(setErrorMessage(`Error requesting users: ${error.message}`));
                setTimeout(() => {
                    dispatch(setErrorMessage(null));
                }, 5000);
            });
    }, []);

    return (
        <>
            "Tha users!"
            {users.map((user) => {
                return (
                    user.username
                );
            })}
        </>

    )
} 
