import React from "react";

export const AnecdoteFilter = ({ handleSubmit }) => {
    return (
        <>
            <div>Filter:
                <input type="text" name="filter" onChange={handleSubmit} placeholder="type your filter" />
                <br />
                <br />
            </div>
        </>
    );
};