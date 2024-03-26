import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnecdoteRanking } from "./AnecdoteRanking";

export const AnecdoteList = () => {
  const dispatch = useDispatch();

  const appState = useSelector((state) => state);
  const anecdotes = appState.anecdotes;
  const selectedAnecdote = appState.selectedAnecdote;

  function selectRandomAnecdote() {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    dispatch({ type: "SELECT", payload: randomIndex });
  }

  function voteForThisAnecdote() {
    dispatch({ type: "VOTE" });
  }

  function anyAnecdoteVotedAlready() {
    for (let i = 0; i < anecdotes.length; i++) {
      if (anecdotes[i].votes > 0) {
        return true;
      }
    }
    return false;
  }
  return (
    <>
      {anecdotes[selectedAnecdote].string}
      <br />
      Has {anecdotes[selectedAnecdote].votes} votes.
      <br />
      <button onClick={voteForThisAnecdote}>Vote</button>
      <button onClick={selectRandomAnecdote}> Next Anecdote </button>
      <br />
      {anyAnecdoteVotedAlready() ? <AnecdoteRanking /> : ""}
      <br />
    </>
  );
};
