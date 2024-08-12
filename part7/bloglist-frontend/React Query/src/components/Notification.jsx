import { Alert } from "react-bootstrap";

export const Notification = ({ message, type }) => {
    if (message === null) {
        return null;
    }
    return <Alert key={type} variant={type}>{message}</Alert>;
};
