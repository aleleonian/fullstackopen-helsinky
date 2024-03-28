import React from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { removeNotificationMessage } from "../reducers/notificationReducer";

export const Notification = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state);
  const notificationMessage = appState.notification.message;
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };
  if (notificationMessage !== "" && notificationMessage) {
    setTimeout(() => {
      dispatch(removeNotificationMessage(""));
    }, 5000);
    return <div style={style}>{notificationMessage}</div>;
  } else return null;
};
