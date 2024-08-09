import React from 'react';
import { Table } from 'react-bootstrap'

const UsersTable = ({ users }) => {
    return (
        <Table striped>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Blogs created</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td><h5><a href={`/users/${user.id}`}>{user.username}</a></h5></td>
                        <td>{user.blogposts.length}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default UsersTable;
