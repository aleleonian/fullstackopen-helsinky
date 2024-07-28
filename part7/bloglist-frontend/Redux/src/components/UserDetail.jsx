import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/users'; // Adjust the path as needed
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setErrorMessage } from '../actions';

const selectUser = (state) => state.user;
const selectErrorMessage = (state) => state.errorMessage;

const Notification = ({ message, type }) => {
    debugger;
    if (message === null) {
        return null;
    }

    return <div className={type}>{message}</div>;
};

export const UserDetail = () => {
    const { id } = useParams();
    const [desiredUser, setDesiredUser] = useState(null);
    const user = useSelector(selectUser);
    const errorMessage = useSelector(selectErrorMessage);
    const navigate = useNavigate();
    const dispatch = useDispatch();


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
        if (user && !desiredUser) {
            userService.getById(id)
                .then((user) => {
                    setDesiredUser(user);
                })
                .catch((error) => {
                    console.log('Error fetching user details:', error);
                    dispatch(setErrorMessage(error.response.data));
                    setTimeout(() => {
                        dispatch(setErrorMessage(null));
                    }, 5000);
                });
        }
    }, [id, user, desiredUser, dispatch]);

    if (!desiredUser) {
        return (
            <div>
                {errorMessage && <Notification message={errorMessage} type="error" />}
                {!errorMessage && "Loading..."}
            </div>
        );
    }
    return (
        <div>
            {/* <Notification message={successMessage} type="success" /> */}
            <Notification message={errorMessage} type="error" />

            <h1>{desiredUser.username}</h1>
            <p>{desiredUser.email}</p>
            <p>added blogs:</p>
            <ul>
                {desiredUser.blogposts.map(blog => <li key={blog.id}>{blog.title}</li>)}
            </ul>
        </div>
    );
};