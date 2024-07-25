import { useEffect } from 'react';
import blogService from './services/blogs';
import './assets/App.css';
import { setUser, setErrorMessage, setBlogs } from './actions';
import { useSelector, useDispatch } from 'react-redux';
import { Users } from './components/Users';
import { Routes, Route } from 'react-router-dom'
import { Home } from './components/Home';

const selectUser = (state) => state.user;

const App = () => {

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user !== null) {
      blogService
        .getAll()
        .then((blogs) => {
          blogs.sort((a, b) => b.likes - a.likes);
          dispatch(setBlogs(blogs));
        })
        .catch((error) => {
          console.log(error);
          dispatch(setErrorMessage(`Error requesting blogposts: ${error.message}`));
          setTimeout(() => {
            dispatch(setErrorMessage(null));
          }, 5000);
        });
    }
  }, [user]);

  useEffect(() => {
    let loggedUser = window.localStorage.getItem('loggedBlogpostAppUser');
    if (loggedUser) {
      loggedUser = JSON.parse(loggedUser);
      blogService.setToken(loggedUser.token);
      dispatch(setUser(loggedUser));
    }
  }, []);

  return (
    <>
    Hi from App.jsx
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </>
  );
};

export default App;
