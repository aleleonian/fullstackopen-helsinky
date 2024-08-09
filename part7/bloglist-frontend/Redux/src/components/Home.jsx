import { useSelector, useDispatch } from 'react-redux';
import React, { useRef } from 'react';

import Blog from './Blog';
import { NewBlogpostForm } from './Form';
import blogService from '../services/blogs';
import loginService from '../services/login';
import { setUser, setUsername, setPassword, setErrorMessage, setSuccessMessage, setBlogs } from '../actions';
import { Table, Form, Button } from 'react-bootstrap'
import { Notification } from "./Notification";

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

    const showTheHome = () => {
        return (
            <>
                <Notification message={successMessage} type="success" />
                <Notification message={errorMessage} type="danger" />
                <br />
                <Table striped>
                    <tbody>
                        {blogs.map((blog) => {
                            return (
                                <tr key={blog.id}>
                                    <td>
                                        <Blog
                                            key={blog.id}
                                            blog={blog}
                                        />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <br />
                <NewBlogpostForm createBlogpost={newBlogpostHandler} reference={blogpostFormRef} />
            </>
        )
    }

    const showTheLoginForm = () => (
        <>
            <h4>Login to application</h4>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>username:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        data-testid="username"
                        onChange={({ target }) => dispatch(setUsername(target.value))}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="Password"
                        value={password}
                        data-testid="password"
                        onChange={({ target }) => dispatch(setPassword(target.value))}
                    />
                </Form.Group>

                <Button className="login-button" type="submit" onClick={handleLogin}>
                    login
                </Button>
            </Form>
            {errorMessage && <Notification message={errorMessage} type="danger" />}
        </>
    );

    return (
        <>
            {user && showTheHome()}
            {!user && showTheLoginForm()}
        </>
    )
} 
