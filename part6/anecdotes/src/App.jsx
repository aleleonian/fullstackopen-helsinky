import React from "react";
import { anecdotes } from "./data/anecdotes";
import { useSelector, useDispatch } from "react-redux";

const App = () => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state);
  const votes = appState.votes;

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
    let mostVotedIndex;
    for (let i = 0; i < votes.length; i++) {
      if (votes[i] > 0) {
        if (!mostVotedIndex) mostVotedIndex = i;
        else if (votes[i] > votes[mostVotedIndex]) mostVotedIndex = i;
      }
    }
    return mostVotedIndex;
  }
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
      {mostVotedAnecdoteIndex() ? <MostVotedAnecdote /> : ""}
    </div>
  );
};

export default App;
