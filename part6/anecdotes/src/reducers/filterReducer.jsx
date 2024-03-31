import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  content: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    createFilter(state, action) {
      state.content = action.payload;
    },
  },
});

export const { createFilter } = filterSlice.actions;
export default filterSlice.reducer;
