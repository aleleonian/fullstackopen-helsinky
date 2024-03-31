import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  string: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    createFilter(state, action) {
      state.string = action.payload;
    },
  },
});

export const { createFilter } = filterSlice.actions;
export default filterSlice.reducer;
