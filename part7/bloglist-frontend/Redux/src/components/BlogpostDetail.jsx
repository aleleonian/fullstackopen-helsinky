import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs'; // Adjust the path as needed
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setErrorMessage } from '../actions';

const selectUser = (state) => state.user;
const selectErrorMessage = (state) => state.errorMessage;

const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }

    return <div className={type}>{message}</div>;
};

export const BlogpostDetail = () => {
    const { id } = useParams();
    const [desiredBlogpost, setDesiredBlogpost] = useState(null);
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
        if (user && !desiredBlogpost) {
            blogService.getById(id)
                .then((blogpost) => {
                    setDesiredBlogpost(blogpost);
                })
                .catch((error) => {
                    console.log('Error fetching blog details:', error);
                    dispatch(setErrorMessage(error.response.data));
                });
        }
    }, [id, user, desiredBlogpost, dispatch]);

    if (!desiredBlogpost) {
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

            <h1>{desiredBlogpost.title}</h1>
            <p>{desiredBlogpost.url}</p>
            <p>{desiredBlogpost.likes} likes</p>
            <p>added by {desiredBlogpost.author}</p>
        </div>
    );
};