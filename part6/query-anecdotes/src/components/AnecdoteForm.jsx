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
