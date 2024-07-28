import { useSelector, useDispatch } from 'react-redux';
import React, { useRef } from 'react';

import Blog from './Blog';
import { Form } from './Form';
import { LoggedInUser } from './LoggedInUser';

import blogService from '../services/blogs';
import loginService from '../services/login';
import { setUser, setUsername, setPassword, setErrorMessage, setSuccessMessage, setBlogs } from '../actions';

const selectUser = (state) => state.user;

const selectErrorMessage = (state) => state.errorMessage;
const selectSuccessMessage = (state) => state.successMessage;
const selectBlogs = (state) => state.blogs;
const selectUsername = (state) => state.username;
const selectPassword = (state) => state.password;

export const Home = () => {

    const user = useSelector(selectUser);
    const errorMessage = useSelector(selectErrorMessage);
    const successMessage = useSelector(selectSuccessMessage);
    const blogs = useSelector(selectBlogs);
    const username = useSelector(selectUsername);
    const password = useSelector(selectPassword);
    const blogpostFormRef = useRef();
    const dispatch = useDispatch();

    /// functions 

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const user = await loginService.login({
                username,
                password,
            });
            window.localStorage.setItem(
                'loggedBlogpostAppUser',
                JSON.stringify(user)
            );
            loginService.setToken(user.token);
            dispatch(setUser(user));
            dispatch(setUsername(''));
            dispatch(setPassword(''));
        } catch (exception) {
            debugger;
            let errorMsg = exception.message ? exception.message : "Wrong credentials";
            dispatch(setErrorMessage(errorMsg));
            setTimeout(() => {
                dispatch(setErrorMessage(null));
            }, 5000);
        }
    };

    const cleanup = () => {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('url').value = '';
    };


    const newBlogpostHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const newBlogpostObject = {};

        for (const [key, value] of formData.entries()) {
            newBlogpostObject[key] = value;
        }

        blogService
            .create(newBlogpostObject)
            .then((response) => {
                const newBlogpostsArray = [...blogs];
                newBlogpostObject.id = response.data.id;
                const loggedUser = JSON.parse(
                    window.localStorage.getItem('loggedBlogpostAppUser')
                );
                if (loggedUser) {
                    newBlogpostObject.user = {};
                    newBlogpostObject.user.username = loggedUser.username;
                    newBlogpostObject.user.name = loggedUser.name;
                    newBlogpostObject.user.id = loggedUser.id;
                }
                newBlogpostsArray.push(newBlogpostObject);
                dispatch(setSuccessMessage('Blogpost created succesfully!'));
                cleanup();
                dispatch(setBlogs(newBlogpostsArray));
                blogpostFormRef.current.toggleVisibility();
                setTimeout(() => {
                    dispatch(setSuccessMessage(null));
                }, 5000);

                // now gotta add the new blogpost locally
                // by making a new object from what was returned
            })
            .catch((exception) => {
                dispatch(setErrorMessage(
                    `Error creating blogpost: ${exception.response.data.error
                        ? exception.response.data.error
                        : exception.message
                    }`
                ));
                setTimeout(() => {
                    dispatch(setErrorMessage(null));
                }, 5000);
            });
    };

    const updateThisBlogpost = (updatedBlogpost) => {
        const desiredBlogIndex = blogs.findIndex(
            (blog) => blog.id === updatedBlogpost.id
        );
        const newBlogpostsArray = [...blogs];
        newBlogpostsArray[desiredBlogIndex] = updatedBlogpost;
        dispatch(setBlogs(newBlogpostsArray));
    };

    const removeThisBlogpost = (removedBlogpostId) => {
        const updatedBlogposts = [...blogs];
        const removedBpIndex = blogs.findIndex(
            (blog) => blog.id === removedBlogpostId
        );
        updatedBlogposts.splice(removedBpIndex, 1);
        dispatch(setBlogs(updatedBlogposts));
    };

    const successMessageAlert = (message) => {
        dispatch(setSuccessMessage(message));
        setTimeout(() => {
            dispatch(setSuccessMessage(null));
        }, 5000);
    };

    const errorMessageAlert = (message) => {
        dispatch(setErrorMessage(message));
        setTimeout(() => {
            dispatch(setErrorMessage(null));
        }, 5000);
    };

    const increaseLikes = (blogObj) => {
        blogService
            .update(blogObj)
            .then((response) => {
                blogObj.likes = response.data.likes;
                updateThisBlogpost(blogObj);
            })
            .catch((error) => {
                errorMessageAlert(
                    error.response.data.error ? error.response.data.error : error.message
                );
                setTimeout(() => {
                    errorMessageAlert(null);
                }, 5000);
            });
    };

    const showTheHome = () => {
        return (
            <>
                <Notification message={successMessage} type="success" />
                <Notification message={errorMessage} type="error" />
                <h2>blogs</h2>
                <LoggedInUser user={user} />
                <Form createBlogpost={newBlogpostHandler} reference={blogpostFormRef} />
                {blogs.map((blog) => {
                    return (
                        <Blog
                            key={blog.id}
                            blog={blog}
                            increaseLikes={increaseLikes}
                            updateThisBlogpost={updateThisBlogpost}
                            removeThisBlogpost={removeThisBlogpost}
                            errorMessageAlert={errorMessageAlert}
                            successMessageAlert={successMessageAlert}
                        />
                    );
                })}
            </>
        )
    }

    const showTheLoginForm = () => (
        <>
            <h1>Login to application</h1>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        data-testid="username"
                        onChange={({ target }) => dispatch(setUsername(target.value))}
                    />
                </div>
                <div>
                    password
                    <input
                        type="password"
                        value={password}
                        name="Password"
                        data-testid="password"
                        onChange={({ target }) => dispatch(setPassword(target.value))}
                    />
                </div>
                <button type="submit" onClick={handleLogin}>
                    login
                </button>
            </form>
            {errorMessage && <Notification message={errorMessage} type="error" />}
        </>
    );

    const Notification = ({ message, type }) => {
        if (message === null) {
            return null;
        }

        return <div className={type}>{message}</div>;
    };

    /// functions 


    return (
        <>
            {user && showTheHome()}
            {!user && showTheLoginForm()}
        </>
    )
} 
