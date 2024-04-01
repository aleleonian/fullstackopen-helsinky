import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
const list = [];

const initialState = {
  list,
  selectedAnecdoteIndex: 0,
};

const anecdotesSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    // createAnecdote(state, action) {
    //   // state.list.push({ content: action.payload, votes: 0 });
    //   state.list.push(action.payload);
    // },
    selectAnecdote(state, action) {
      const selectedAnecdoteIndex = action.payload;
      state.selectedAnecdoteIndex = selectedAnecdoteIndex;
    },
    voteAnecdote(state) {
      state.list[state.selectedAnecdoteIndex].votes++;
    },
    appendAnecdote(state, action) {
      state.list.push(action.payload);
    },
    setAnecdotes(state, action) {
      state.list = action.payload;
    },
  },
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    try {
      const anecdotes = await anecdoteService.getAll();
      dispatch(setAnecdotes(anecdotes));
    } catch (error) {
      console.error("An error occurred while fetching anecdotes:", error);
      dispatch(
        setNotificationMessage(
          `An error occurred while fetching anecdotes: ${error.message}`
        )
      );
    }
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    try {
      const newAnecdote = await anecdoteService.createNew(content);
      dispatch(appendAnecdote(newAnecdote));
      dispatch(setNotificationMessage("Anecdote added!"));
    } catch (error) {
      dispatch(
        setNotificationMessage("Error adding new anecodte: ", error.message)
      );
    }
  };
};

export const { selectAnecdote, voteAnecdote, appendAnecdote, setAnecdotes } =
  anecdotesSlice.actions;
export default anecdotesSlice.reducer;
