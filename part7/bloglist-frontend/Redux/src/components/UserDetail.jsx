import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/users'; // Adjust the path as needed

export const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        userService.getById(id)
            .then((user) => {
                setUser(user);
            })
            .catch((error) => {
                console.error('Error fetching user details:', error);
            });
    }, [id]);

    if (!user) {
        return <div>Loading...</div>;
    }
    debugger;
    return (
        <div>
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <p>added blogs:</p>
            <ul>
                {user.blogposts.map(blog => <li key={blog.id}>{blog.title}</li>)}
            </ul>
        </div>
    );
};