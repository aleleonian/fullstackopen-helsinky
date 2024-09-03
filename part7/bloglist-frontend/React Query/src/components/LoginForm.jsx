import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import BlogContext from '../BlogContext';
import { Notification } from './Notification';
import loginService from '../services/login';

const handleLogin = async (event, username, password, dispatch) => {
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
        dispatch({ type: 'SET_USER', payload: user });
    } catch (exception) {
        const message = exception.response.status === 401 ? "Wrong credentials!" : exception.message
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: message });
        setTimeout(() => {
            dispatch({ type: 'SET_ERROR_MESSAGE', payload: null });
        }, 5000);
    }
};

export const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { state, dispatch } = useContext(BlogContext);

    return (
        <>
            <br />
            <h4>Login to application</h4>
            <Form onSubmit={handleLogin}>
                <Form.Group>
                    <Form.Label>username:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="Password"
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </Form.Group>

                <Button className="top-bottom-margin-10px" type="submit" onClick={() => { handleLogin(event, username, password, dispatch) }}>
                    login
                </Button>
            </Form>
            {state.errorMessage && <Notification message={state.errorMessage} type="danger" />}
        </>
    )
}