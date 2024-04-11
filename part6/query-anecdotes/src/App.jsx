import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useQuery } from '@tanstack/react-query';
import { getAnecdotes } from './requests';
import axios from 'axios';

const App = () => {

  const handleVote = (anecdote) => {
    console.log('vote')
  }

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['anecdotes'],
    // queryFn: () => axios.get('http://localhost:3001/anecdotes').then(res => res.data)
    queryFn: getAnecdotes
  });

  const pelotas = getAnecdotes();

  // console.log(JSON.parse(JSON.stringify(result)))

  // const anecdotes = [
  //   {
  //     "content": "If it hurts, do it more often",
  //     "id": "47145",
  //     "votes": 0
  //   },
  // ]


  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    debugger;
    return <div>Error fetching data</div>;
  }

  const anecdotes = data;
  // debugger;

  console.log("pelotas->", pelotas);
  console.log("anecdotes->", anecdotes);

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
