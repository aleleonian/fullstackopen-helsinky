import { anecdotes } from "../data/anecdotes";

const initialState = {
  selectedAnecdote: 0,
  votes: Array(anecdotes.length).fill(0),
};

export const anecdoteReducer = (state = initialState, action) => {
  let newState = { ...state };

  switch (action.type) {
    case "VOTE":
      newState.votes[newState.selectedAnecdote]++;
      return newState;
    case "SELECT":
      newState.selectedAnecdote = action.payload;
      return newState;
    default:
      return newState;
  }
};
