import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery } from '@apollo/client';

import { ALL_AUTHORS, ALL_BOOKS } from './queries.js';

const App = () => {
  const [page, setPage] = useState("authors");

  const allAuthorsResult = useQuery(ALL_AUTHORS);
  const allBooksResult = useQuery(ALL_BOOKS);
  


  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors queryData={allAuthorsResult} show={page === "authors"} />

      <Books queryData={allBooksResult} show={page === "books"} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
