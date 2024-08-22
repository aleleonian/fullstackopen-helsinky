import { useState, useEffect, useRef, useContext } from 'react';
import blogService from './services/blogs';
import './assets/App.css';
import { useQuery } from '@tanstack/react-query';
import BlogContext from './BlogContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Users } from './components/Users';
import { Home } from './components/Home';

const App = () => {
  const { state, dispatch } = useContext(BlogContext);
  const [hasDispatchedError, setHasDispatchedError] = useState(false);
  const token = blogService.getToken();

  useEffect(() => {
    let loggedUser = window.localStorage.getItem('loggedBlogpostAppUser');
    if (loggedUser) {
      loggedUser = JSON.parse(loggedUser);
      blogService.setToken(loggedUser.token);
      dispatch({ type: 'SET_USER', payload: loggedUser });
    }
  }, []);

  const { data: blogs, error, isError, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {

      const token = blogService.getToken();

      if (!token) {
        throw new Error('User not logged in');
      }

      const blogs = await blogService.getAll();
      blogs.sort((a, b) => b.likes - a.likes);
      dispatch({ type: 'SET_BLOGS', payload: blogs });
      return blogs;
    },
    enabled: !!token,
    onError: (error) => {
      console.error('Error fetching blogs:', error.message);
    }
  });

  useEffect(() => {
    if (isError && !hasDispatchedError) {
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: error.message });
      setHasDispatchedError(true);
    }
  }, [isError, error, hasDispatchedError, dispatch]);

  if (isLoading) {
    return <div>loading data...</div>
  }

  if (isError) {
    return <div>{state.errorMessage}</div>;
  }

  return (
    <div className="container">
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="users" element={<Users />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

};


export default App;
