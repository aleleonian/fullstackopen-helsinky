import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "", // Initial message state
  seconds: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationMessage(state, action) {
      const { payload } = action;
      state.message = payload;
    },
    setNotificationSeconds(state, action) {
      const { payload } = action;
      state.seconds = payload;
    },
    removeNotificationMessage(state) {
      state.message = "";
    },
  },
});

export const setNotification = (message, seconds) => {
  return async (dispatch) => {
    dispatch(setNotificationSeconds(seconds));
    dispatch(setNotificationMessage(message));
  };
};

export const { removeNotificationMessage, setNotificationMessage, setNotificationSeconds } =
  notificationSlice.actions;
export default notificationSlice.reducer;
