import { createSlice } from "@reduxjs/toolkit";
import { anecdotes } from "../data/anecdotes";

const initialState = {
  anecdotes,
  selectedAnecdoteIndex: 0,
};

// export const createAnecdote = (anecdote) => {
//   return {
//     type: "NEW_ANECDOTE",
//     payload: anecdote,
//   };
// };

// export const anecdoteReducer = (state = initialState, action) => {
//   let newState = { ...state };

//   switch (action.type) {
//     case "VOTE":
//       newState.anecdotes[newState.selectedAnecdoteIndex].votes++;
//       return newState;
//     case "NEW_ANECDOTE":
//       newState.anecdotes.push({ string: action.payload, votes: 0 });
//       return newState;
//     case "SELECT":
//       newState.selectedAnecdoteIndex = action.payload;
//       return newState;
//     default:
//       return newState;
//   }
// };

const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    createAnecdote(state, action) {
      state.anecdotes.push({ string: action.payload, votes: 0 });
    },
    selectAnecdote(state, action){
      const selectedAnecdoteIndex = action.payload;
      state.selectedAnecdoteIndex = selectedAnecdoteIndex;
    },
    voteAnecdote(state){
      state.anecdotes[state.selectedAnecdoteIndex].votes++;
    }
  },
});

export const { createAnecdote, selectAnecdote, voteAnecdote } = anecdotesSlice.actions;
export default anecdotesSlice.reducer;
