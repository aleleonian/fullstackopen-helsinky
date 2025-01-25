import { gql, useQuery } from '@apollo/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Authors from './components/Authors';

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
  `

const App = () => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>loading...</div>
  }

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="authors" element={<Authors />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

  return (
    <div>
      {result.data.allAuthors.map(p => p.name).join(', ')}
    </div>
  )
}

export default App