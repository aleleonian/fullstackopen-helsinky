import { createSlice } from "@reduxjs/toolkit";

const list = [];

const initialState = {
  list,
  selectedAnecdoteIndex: 0,
};

const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    createAnecdote(state, action) {
      // state.list.push({ content: action.payload, votes: 0 });
      state.list.push(action.payload);
    },
    selectAnecdote(state, action){
      const selectedAnecdoteIndex = action.payload;
      state.selectedAnecdoteIndex = selectedAnecdoteIndex;
    },
    voteAnecdote(state){
      state.list[state.selectedAnecdoteIndex].votes++;
    },
    appendAnecdote(state, action) {
      state.list.push(action.payload)
    },
    setAnecdotes(state, action){
      state.list = action.payload;
    }
  },
});

export const { createAnecdote, selectAnecdote, voteAnecdote, appendAnecdote, setAnecdotes } = anecdotesSlice.actions;
export default anecdotesSlice.reducer;
