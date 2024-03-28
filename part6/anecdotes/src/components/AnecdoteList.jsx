import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnecdoteRanking } from "./AnecdoteRanking";
import { selectAnecdote, voteAnecdote} from '../reducers/anecdoteReducer';

export const AnecdoteList = () => {
  const dispatch = useDispatch();

  const appState = useSelector((state) => state);
  const anecdotes = appState.anecdotes.anecdotes;
  const selectedAnecdoteIndex = appState.anecdotes.selectedAnecdoteIndex;

  function selectRandomAnecdote() {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    // dispatch({ type: "SELECT", payload: randomIndex });
    dispatch(selectAnecdote(randomIndex));
  }

  function voteForThisAnecdote() {
    dispatch(voteAnecdote());
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
      {anecdotes[selectedAnecdoteIndex].string}
      <br />
      Has {anecdotes[selectedAnecdoteIndex].votes} votes.
      <br />
      <button onClick={voteForThisAnecdote}>Vote</button>
      <button onClick={selectRandomAnecdote}> Next Anecdote </button>
      <br />
      {anyAnecdoteVotedAlready() ? <AnecdoteRanking /> : ""}
      <br />
    </>
  );
};
