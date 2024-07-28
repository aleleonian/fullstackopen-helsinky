import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import usersService from '../services/users';
import { setErrorMessage, setUser } from '../actions';
import { useNavigate } from 'react-router-dom';
import { LoggedInUser } from './LoggedInUser';
import UsersTable from './UsersTable'; // Adjust the path as needed

const selectUser = (state) => state.user;

export const Users = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            const loggedUserJSON = window.localStorage.getItem('loggedBlogpostAppUser');
            if (loggedUserJSON) {
                const user = JSON.parse(loggedUserJSON);
                dispatch(setUser(user));
            } else {
                navigate('/');
            }
        }
    }, [user, navigate, dispatch]);

    useEffect(() => {
        if (user) {
            usersService
                .getAll()
                .then((users) => {
                    console.log("users->", users)
                    setUsers(users);;
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(setErrorMessage(`Error requesting users: ${error.message}`));
                    setTimeout(() => {
                        dispatch(setErrorMessage(null));
                    }, 5000);
                });
        }
    }, [dispatch, user]);

    if (!user) {
        return null; // Prevent rendering if the user is not logged in
    }
    return (
        <>
            <LoggedInUser user={user} />
            <h2>Users</h2>
            <UsersTable users={users} />
        </>
    );
};
