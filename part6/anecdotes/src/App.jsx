import React from "react";
import { useDispatch } from "react-redux";
import { createAnecdote } from "./reducers/anecdoteReducer";
import { createFilter } from "./reducers/filterReducer";
import { AnecdoteList } from "./components/AnecdoteList";
import { AnecdoteForm } from "./components/AnecdoteForm";
import { AnecdoteFilter } from "./components/AnecdoteFilter";

const App = () => {
  const dispatch = useDispatch();

  const addAnecdote = (event) => {
    event.preventDefault();
    const newAnecdote = event.target.anecdote.value;
    if (!newAnecdote || newAnecdote.length === 0) {
      alert("Anecdote must not be empty!");
      return;
    }
    dispatch(createAnecdote(newAnecdote));
    alert("Anecdote added!");
    event.target.anecdote.value = "";
  };

  const filterAnecdotes = (event) => {
    const filterString = event.target.value;
    dispatch(createFilter(filterString))
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <AnecdoteFilter handleSubmit={filterAnecdotes} />
      <AnecdoteList />
      <AnecdoteForm handleSubmit={addAnecdote} />
    </div>
  );
};

export default App;
