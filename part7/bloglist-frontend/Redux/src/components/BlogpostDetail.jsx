import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import blogService from '../services/blogs'; // Adjust the path as needed
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, setErrorMessage, setBlogs } from '../actions';

const selectUser = (state) => state.user;
const selectErrorMessage = (state) => state.errorMessage;
const selectBlogs = (state) => state.blogs;

const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }

    return <div className={type}>{message}</div>;
};

const updateThisBlogpost = (blogs, updatedBlogpost, dispatch) => {

    const desiredBlogIndex = blogs.findIndex(
        (blog) => blog.id === updatedBlogpost.id
    );
    const newBlogpostsArray = [...blogs];
    newBlogpostsArray[desiredBlogIndex] = updatedBlogpost;
    dispatch(setBlogs(newBlogpostsArray));
};


const increaseLikes = (blogs, blogObj, dispatch) => {

    blogService
        .update(blogObj)
        .then((response) => {
            blogObj.likes = response.data.likes;
            updateThisBlogpost(blogs, blogObj, dispatch);
        })
        .catch((error) => {

            dispatch(setErrorMessage(
                error.response.data.error ? error.response.data.error : error.message
            ));
        });
};


export const BlogpostDetail = () => {
    const { id } = useParams();
    const [desiredBlogpost, setDesiredBlogpost] = useState(null);
    const user = useSelector(selectUser);
    const errorMessage = useSelector(selectErrorMessage);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const blogs = useSelector(selectBlogs);


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
            <div>
                {desiredBlogpost.likes} likes
                <button
                    data-testid="like-button"
                    onClick={() => increaseLikes(blogs, desiredBlogpost, dispatch)}
                >
                    like
                </button>
            </div>
            <p>added by {desiredBlogpost.author}</p>
        </div>
    );
};