import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAnecdote } from '../requests';
import { useNotificationMessageDispatch } from './AnecdoteContext';

const AnecdoteForm = () => {

  const queryClient = useQueryClient();
  const dispatchMessage = useNotificationMessageDispatch();
  const newNoteMutation = useMutation(
    {
      mutationFn: createAnecdote,
      onSuccess: () => {
        queryClient.invalidateQueries('anecdotes')
      },
      onMutate: async (anecdoteObject) => {
        // Perform validation or any other tasks before the mutation
        if (!anecdoteObject || anecdoteObject.content.length < 5) {
          dispatchMessage({ message: `Anecdote length too short. Should be at least 5 chars.` });
          setTimeout(() => { dispatchMessage({ message: null }) }, 3000);
          // throw new Error('Invalid data');
        }
        // Return context object to be passed to onSuccess, onError, and onSettled callbacks
        return undefined;
      },
    }
  );

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = '';
    console.log('new anecdote:', content);
    dispatchMessage({ message: `You added: ${content}` });
    setTimeout(() => { dispatchMessage({ message: null }) }, 3000);
    newNoteMutation.mutate({ content, votes: 0 });
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
