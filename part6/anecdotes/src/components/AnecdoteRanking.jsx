import React from "react";
import { useSelector } from "react-redux";

export function AnecdoteRanking() {

  const appState = useSelector((state) => state);
  const anecdotes = appState.anecdotes.anecdotes;
  const arrayCopy = [...anecdotes];
  const filter = appState.filter.string;
  const sortedArray = arrayCopy.sort((a, b) => {
    return b.votes - a.votes;
  });

  return (
    <React.Fragment>
      <h1>Anecdotes ranking</h1>
      {sortedArray
        .filter(item => item.string.includes(filter))
        .map((item) => {
          return (
            <div key={item.string}>
              &apos;{item.string}&apos; -&gt; has{" "}
              {item.votes} votes
            </div>
          );
        })}
    </React.Fragment>
  );
}