import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAnecdote } from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state);
  const votes = appState.votes;
  const anecdotes = appState.anecdotes;

  function selectRandomAnecdote() {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    dispatch({ type: "SELECT", payload: randomIndex });
  }

  function voteForThisAnecdote() {
    dispatch({ type: "VOTE" });
  }

  function MostVotedAnecdote() {
    return (
      <React.Fragment>
        <h1>Anecdote with most votes</h1>
        {anecdotes[mostVotedAnecdoteIndex()]}
        <br />
        Has {votes[mostVotedAnecdoteIndex()]} votes.
      </React.Fragment>
    );
  }

  function mostVotedAnecdoteIndex() {
    let mostVotedIndex = -1;
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > 0) {
        if (mostVotedIndex === -1) mostVotedIndex = i;
        else if (votes[i] > votes[mostVotedIndex]) mostVotedIndex = i;
      }
    }
    return mostVotedIndex;
  }

  const addAnecdote = (event) => {
    event.preventDefault();
    const newAnecdote = event.target.anecdote.value;
    if (!newAnecdote || newAnecdote.length === 0) {
      alert("Anecdote must not be empty!");
      return;
    }

    dispatch(createAnecdote(newAnecdote));
  };

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[appState.selectedAnecdote]}
      <br />
      Has {votes[appState.selectedAnecdote]} votes.
      <br />
      <button onClick={voteForThisAnecdote}>Vote</button>
      <button onClick={selectRandomAnecdote}> Next Anecdote </button>
      <br />
      <h1>Add a new anecdote</h1>
      <form onSubmit={addAnecdote}>
        <input type="text" name="anecdote" placeholder="type your anecdote" />
        <button type="submit">Add</button>
      </form>
      <br />
      {mostVotedAnecdoteIndex() != -1 ? <MostVotedAnecdote /> : ""}
    </div>
  );
};

export default App;
