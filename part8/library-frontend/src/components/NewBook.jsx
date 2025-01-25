import { useState } from 'react';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';
import { useMutation } from '@apollo/client';

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([]);

  const [createBook] = useMutation(ADD_BOOK,
    {
      refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
      onError: (error) => {
        const messages = error.graphQLErrors.map(e => e.message).join('\n')
        alert(messages)
      },
      onCompleted: (data) => {
        // Handle what you want to do when the mutation completes
        alert('Book added allright!');
        console.log('Mutation completed successfully!', data);
      },
    }
  );

  if (!props.show) {
    return null
  }

  const cleanUp = () => {
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const isThereAnyMissingData = () => {
    if (
      title.length < 1 ||
      author.length < 1 ||
      published === '' ||
      genres.length < 1
    ) {
      return true;
    }
    else return false;
  }

  const submit = async (event) => {
    event.preventDefault()

    setGenres(genre.split(","));

    if (isThereAnyMissingData()) {
      alert('You must complete all the fields!');
      return;
    }

    createBook({ variables: { title, published, author, genres } });
    cleanUp();
  }

  const addGenre = () => {
    if (genre.length < 1) {
      alert('Genre must not be empty!');
      return
    }
    genres.push(genre);
    setGenres([...genres])
    setGenre('');
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(Number(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook