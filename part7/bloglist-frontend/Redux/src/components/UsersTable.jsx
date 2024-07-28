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
                        <td>{user.username}</td>
                        <td>{user.blogposts.length}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
