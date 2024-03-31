import { createSlice } from "@reduxjs/toolkit";
import { anecdotes } from "../data/anecdotes";

const initialState = {
  anecdotes,
  selectedAnecdoteIndex: 0,
};

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
