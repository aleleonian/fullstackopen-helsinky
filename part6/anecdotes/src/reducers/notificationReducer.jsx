import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: '' // Initial message state
  };

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationMessage(state, action) {
      const { payload } = action;
      state.message = payload;
    },
    removeNotificationMessage(state) {
        state.message = "";
      },
  },
});

export const { setNotificationMessage, removeNotificationMessage } = notificationSlice.actions;
export default notificationSlice.reducer;
