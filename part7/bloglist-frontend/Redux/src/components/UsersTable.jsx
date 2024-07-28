import React from 'react';

const UsersTable = ({ users }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>blogs created</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td><h1><a href={`/users/${user.id}`}>{user.username}</a></h1></td>
                        <td>{user.blogposts.length}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
