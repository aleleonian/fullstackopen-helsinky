import React from "react";
import { useSelector } from "react-redux";

export function AnecdoteRanking() {

    const appState = useSelector((state) => state);
    const anecdotes = appState.anecdotes;
    const arrayCopy = [...anecdotes];
    const sortedArray = arrayCopy.sort((a, b) => {
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