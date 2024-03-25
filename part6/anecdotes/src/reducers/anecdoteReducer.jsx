import { anecdotes } from "../data/anecdotes";

const initialState = {
  anecdotes,
  selectedAnecdote: 0,
  votes: Array(anecdotes.length).fill(0),
};

export const createAnecdote = (anecdote) => {
  return {
    type: "NEW_ANECDOTE",
    payload: anecdote,
  };
};

export const anecdoteReducer = (state = initialState, action) => {
  let newState = { ...state };

  switch (action.type) {
    case "VOTE":
      newState.votes[newState.selectedAnecdote]++;
      return newState;
    case "NEW_ANECDOTE":
      newState.anecdotes.push(action.payload);
      newState.votes.push(0);
      return newState;
    case "SELECT":
      newState.selectedAnecdote = action.payload;
      return newState;
    default:
      return newState;
  }
};
