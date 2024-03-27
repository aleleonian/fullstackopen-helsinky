import React from "react";

export const AnecdoteFilter = ({ handleSubmit }) => {
    return (
        <>
            <h1>Filter:</h1>
            <form>
                <input type="text" name="filter" onChange={handleSubmit} placeholder="type your filter" />
            </form>
        </>
    );
};