import axios from 'axios';

export async function getAnecdotes() {
    try {
      const response = await axios.get('http://localhost:3001/anecdotes');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch anecdotes');
    }
  }