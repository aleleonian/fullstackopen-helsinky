import React from 'react';
import loginService from '../services/login'; // Ensure the path is correct
import { Button } from 'react-bootstrap';

export const LoggedInUser = ({ user }) => {

    const logOut = () => {
        loginService.logOut();
    };

    return (
        <>
            {user.name} is logged in <Button variant="success" onClick={logOut}>log out</Button>
        </>
    );
};