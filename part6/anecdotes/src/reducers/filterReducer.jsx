import { createSlice } from "@reduxjs/toolkit";

// export const filterReducer = (state = "", action) => {
//   switch (action.type) {
//     case "SET_FILTER":
//       return action.payload;
//     default:
//       return state;
//   }
// };

// export const createFilter = (string) => {
//   return {
//     type: "SET_FILTER",
//     payload: string,
//   };
// };

const initialState = "";

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    createFilter(state, action) {
      return action.payload;
    },
  },
});

export const { createFilter } = filterSlice.actions;
export default filterSlice.reducer;
