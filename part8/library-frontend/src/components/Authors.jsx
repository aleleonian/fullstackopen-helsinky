import { ALL_BOOKS, ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

const Authors = (props) => {

  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [newBirthYear, setNewBirthYear] = useState(null);

  const [editAuthor] = useMutation(EDIT_AUTHOR,
    {
      refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
      onError: (error) => {
        console.log(error);
        alert(error.message)
      },
      onCompleted: (data) => {
        // Handle what you want to do when the mutation completes
        alert('Author edited allright!');
        console.log('Mutation completed successfully!', data);
      },
    }
  );

  const setBirthYear = () => {

    const name = selectedAuthor;
    const setBornTo = Number(newBirthYear);

    if (!setBornTo || setBornTo === '') {
      alert('Year cannot be empty!');
      return;
    }

    if (!name || name === '') {
      alert('You must select an author!');
      return;
    }

    editAuthor({ variables: { name, setBornTo } });
  }

  if (!props.show) {
    return null
  }
  if (props.queryData.loading) {
    return <div>loading...</div>
  }
  if (props.queryData.error) {
    alert("Authors.jsx:" + props.queryData.error.message);
    return;
  }

  const authors = [...props.queryData.data.allAuthors];

  const handleChange = (event) => {
    setSelectedAuthor(event.target.value);
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birth year</h3>
      <select value={selectedAuthor} onChange={handleChange}>
        <option value="-1">Please choose an author</option>
        {authors.map((author, index) => (
          <option key={index} value={author.name}>
            {author.name}
          </option>
        ))}
      </select>
      &nbsp; born <input type="text" onChange={({ target }) => setNewBirthYear(target.value)} />
      <button onClick={setBirthYear}>Update author</button>
    </div>
  )
}

export default Authors
