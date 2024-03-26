import React from "react";

export const AnecdoteForm = ({ handleSubmit }) => {
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