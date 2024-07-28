import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import usersService from '../services/users';
import { setErrorMessage } from '../actions';
import { useNavigate } from 'react-router-dom';
import { LoggedInUser } from './LoggedInUser';

const selectUser = (state) => state.user;

export const Users = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate('/');
        }
    }, [user, navigate]); // Adding dependencies to useEffect

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
    }, [dispatch]);

    if (!user) {
        return null; // Prevent rendering if the user is not logged in
    }
    
    return (
        <>
            "Tha users!"
            <LoggedInUser user={user} />
            {users.map((user) => {
                return <div key={user.id}>{user.username}</div>;
            })}
        </>
    );
};
