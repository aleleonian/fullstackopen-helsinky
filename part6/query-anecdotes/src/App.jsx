import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAnecdotes, updateAnecdote } from './requests';
import { customLog } from './util';
import { useNotificationMessage, useNotificationMessageDispatch } from './components/AnecdoteContext';

const App = () => {
  const queryClient = useQueryClient();
  const dispatchMessage = useNotificationMessageDispatch();
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  });

  const notificationMessageStr = useNotificationMessage();

  const anecdotes = data;

  const handleVote = (anecdote) => {
    anecdote.votes++;
    updateAnecdoteMutation.mutate(anecdote);
    dispatchMessage({ message: `You voted: ${anecdote.content}` });
    setTimeout(() => { dispatchMessage({ message: null }) }, 3000);
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    customLog(error.message);
    return <div>Error fetching data</div>;
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification message={notificationMessageStr} />
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
