// eslint-disable-next-line no-unused-vars
import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createAnecdote,
  setAnecdotes,
  initializeAnecdotes,
} from "./reducers/anecdoteReducer.jsx";
import anecdoteService from "./services/anecdotes.js";
import { setNotification } from "./reducers/notificationReducer";
import { createFilter } from "./reducers/filterReducer";
import { AnecdoteList } from "./components/AnecdoteList";
import { AnecdoteForm } from "./components/AnecdoteForm";
import { AnecdoteFilter } from "./components/AnecdoteFilter";
import { Notification } from "./components/Notification";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdotes());
  }, []);

  const appState = useSelector((state) => state);
  const anecdotes = appState.anecdotes.list;
  const addAnecdote = async (event) => {
    event.preventDefault();
    const newAnecdoteStr = event.target.anecdote.value;
    event.target.anecdote.value = "";
    if (!newAnecdoteStr || newAnecdoteStr.length === 0) {
      alert("Anecdote must not be empty!");
      dispatch(setNotification("Anecdote must not be empty!", 5));
      return;
    }
    dispatch(createAnecdote(newAnecdoteStr));
  };

  const filterAnecdotes = (event) => {
    const filterString = event.target.value;
    dispatch(createFilter(filterString));
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <AnecdoteFilter handleSubmit={filterAnecdotes} />
      <Notification />
      {anecdotes.length > 0 && <AnecdoteList />}
      <AnecdoteForm handleSubmit={addAnecdote} />
    </div>
  );
};

export default App;
