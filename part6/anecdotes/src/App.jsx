import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAnecdote } from "./reducers/anecdoteReducer";

const AnecdoteForm = ({ handleSubmit }) => {
  return (
    <>
      <h1>Add a new anecdote</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="anecdote" placeholder="type your anecdote" />
        <button type="submit">Add</button>
      </form>
    </>
  );
};

const App = () => {
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

  function AnecdotesRanking() {
    const arrayCopy = [...anecdotes];
    const sortedArray = arrayCopy.sort((a, b) => {
      // Sort based on votes in descending order
      return b.votes - a.votes;
    });

    return (
      <React.Fragment>
        <h1>Anecdotes ranking</h1>
        {sortedArray.map((vote, index) => {
          return (
            <div key={sortedArray[index].string}>
              &apos;{sortedArray[index].string}&apos; -&gt; has{" "}
              {sortedArray[index].votes} votes
            </div>
          );
        })}
      </React.Fragment>
    );
  }

  function anyAnecdoteVotedAlready() {
    for (let i = 0; i < anecdotes.length; i++) {
      if (anecdotes[i].votes > 0) {
        return true;
      }
    }
    return false;
  }

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

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selectedAnecdote].string}
      <br />
      Has {anecdotes[selectedAnecdote].votes} votes.
      <br />
      <button onClick={voteForThisAnecdote}>Vote</button>
      <button onClick={selectRandomAnecdote}> Next Anecdote </button>
      <br />
      <AnecdoteForm handleSubmit={addAnecdote} />
      <br />
      {anyAnecdoteVotedAlready() ? <AnecdotesRanking /> : ""}
    </div>
  );
};

export default App;
