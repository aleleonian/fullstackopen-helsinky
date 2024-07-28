import React from 'react';
import loginService from '../services/login'; // Ensure the path is correct

export const LoggedInUser = ({ user }) => {

    const logOut = () => {
        loginService.logOut();
    };

    return (
        <div>
            {user.name} is logged in <button onClick={logOut}>log out</button>
        </div>
    );
};