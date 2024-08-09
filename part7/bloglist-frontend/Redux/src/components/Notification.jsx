import { Alert } from "react-bootstrap";

export const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }
    debugger;
    return <Alert key={type} variant={type}>{message}</Alert>;
};
