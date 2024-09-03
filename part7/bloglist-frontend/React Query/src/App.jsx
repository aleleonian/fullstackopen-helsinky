import { useState, useEffect, useContext } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import './assets/App.css';
import { useQuery } from '@tanstack/react-query';
import BlogContext from './BlogContext';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Users } from './components/Users';
import { Home } from './components/Home';
import { UserDetail } from "./components/UserDetail";
import { BlogpostDetail } from "./components/BlogpostDetail";
import { NotFound } from "./components/NotFound";

const App = () => {
  const { state, dispatch } = useContext(BlogContext);
  const [hasDispatchedError, setHasDispatchedError] = useState(false);
  const token = loginService.getToken();

  useEffect(() => {
    let loggedUser = window.localStorage.getItem('loggedBlogpostAppUser');
    if (loggedUser) {
      loggedUser = JSON.parse(loggedUser);
      loginService.setToken(loggedUser.token);
      dispatch({ type: 'SET_USER', payload: loggedUser });
    }
  }, []);

  const { data: blogs, error, isError, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {

      const token = loginService.getToken();

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
          <Route path="/" element={<Home />} />
          <Route path="users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetail />} />
          <Route path="/blogs/:id" element={<BlogpostDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );

};


export default App;
