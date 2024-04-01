import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";
import { setNotification } from "./notificationReducer";

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
        setNotification(
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
      dispatch(setNotification("Anecdote added!", 5));
    } catch (error) {
      dispatch(
        setNotification("Error adding new anecodte: ", error.message)
      );
    }
  };
};
export const voteForThisAnecdote = (anecdote) => {
  return async (dispatch) => {
    try {
      const newAnecdote = {...anecdote}
      newAnecdote.votes += 1;
      const updatedAnecdote = await anecdoteService.update(newAnecdote);
      dispatch(voteAnecdote());
      dispatch(setNotification(`You voted for '${anecdote.content}'`,5));
    } catch (error) {
      dispatch(
        setNotification("Error upvoting anecodte: ", error.message)
      );
    }
  };
};

export const { selectAnecdote, voteAnecdote, appendAnecdote, setAnecdotes } =
  anecdotesSlice.actions;
export default anecdotesSlice.reducer;
