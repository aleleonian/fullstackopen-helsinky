import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AnecdoteRanking } from "./AnecdoteRanking";
import { selectAnecdote, voteForThisAnecdote, voteAnecdote} from '../reducers/anecdoteReducer';
import { setNotification} from '../reducers/notificationReducer';

export const AnecdoteList = () => {
  const dispatch = useDispatch();

  const appState = useSelector((state) => state);
  const anecdotes = appState.anecdotes.list;
  const selectedAnecdoteIndex = appState.anecdotes.selectedAnecdoteIndex;

  function selectRandomAnecdote() {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    dispatch(selectAnecdote(randomIndex));
  }

  function upVoteAnecdote() {
    dispatch(voteForThisAnecdote(anecdotes[selectedAnecdoteIndex]));
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
      {anecdotes[selectedAnecdoteIndex].content}
      <br />
      Has {anecdotes[selectedAnecdoteIndex].votes} votes.
      <br />
      <button onClick={upVoteAnecdote}>Vote</button>
      <button onClick={selectRandomAnecdote}> Next Anecdote </button>
      <br />
      {anyAnecdoteVotedAlready() ? <AnecdoteRanking /> : ""}
      <br />
    </>
  );
};
