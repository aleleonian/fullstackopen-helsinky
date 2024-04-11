import axios from 'axios';
const baseUrl = 'http://localhost:3001/anecdotes';

export async function getAnecdotes() {
    try {
        const response = await axios.get(baseUrl);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch anecdotes');
    }
}

export const createAnecdote = async newAnecdote =>
    await axios.post(baseUrl, newAnecdote).then(res => res.data)