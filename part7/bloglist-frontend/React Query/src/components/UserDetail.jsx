import React, { useState, useContext, useEffect } from 'react';
import BlogContext from '../BlogContext';
import { useAuthCheck } from '../hooks/useAuthCheck';
import { useParams } from 'react-router-dom';
import userService from '../services/users'; // Adjust the path as needed
import { Notification } from "./Notification";
import ListGroup from 'react-bootstrap/ListGroup';

export const UserDetail = () => {
    const { state, dispatch } = useContext(BlogContext);
    const { id } = useParams();
    const [desiredUser, setDesiredUser] = useState(null);

    useAuthCheck();

    useEffect(() => {
        if (!desiredUser) {
            userService.getById(id)
                .then((user) => {
                    setDesiredUser(user);
                })
                .catch((error) => {
                    debugger;
                    console.log('Error fetching user details:', error);
                    dispatch({ type: 'SET_ERROR_MESSAGE', payload: `Error requesting user: ${error.response.data}` });

                });
        }
    }, [id, desiredUser, dispatch]);

    if (!desiredUser) {
        return (
            <div>
                {state.errorMessage && <Notification message={state.errorMessag} type="danger" />}
                {state.successMessage && <Notification message={state.successMessage} type="success" />}
                {!state.errorMessage && "Loading..."}
            </div>
        );
    }
    return (
        <div>
            <Notification message={state.successMessage} type="success" />
            <Notification message={state.errorMessage} type="danger" />

            <h1>{desiredUser.username}</h1>
            <p>{desiredUser.email}</p>
            <p>Added blogs:</p>
            <ListGroup>
                {desiredUser.blogposts.length > 0 && desiredUser.blogposts.map(blog => <ListGroup.Item key={blog.id}>
                    <a href={`/blogs/${blog.id}`}>
                        {blog.title}
                    </a>
                </ListGroup.Item>)}
                {desiredUser.blogposts.length === 0 && "No blogs added by this user."}
            </ListGroup>
        </div>
    );
}