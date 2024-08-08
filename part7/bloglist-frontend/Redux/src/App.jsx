import { useEffect } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import './assets/App.css';
import { setUser, setErrorMessage, setBlogs } from './actions';
import { useSelector, useDispatch } from 'react-redux';
import { Users } from './components/Users';
import { Routes, Route } from 'react-router-dom'
import { Home } from './components/Home';
import { UserDetail } from './components/UserDetail';
import { BlogpostDetail } from './components/BlogpostDetail';
import { NotFound } from './components/NotFound';
import { NavBar } from './components/NavBar';
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
      loginService.setToken(loggedUser.token);
      dispatch(setUser(loggedUser));
    }
  }, [dispatch]);

  return (
    <div className="container">
      <NavBar />
      <br />
      <h2>Blogs App</h2>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/blogs/:id" element={<BlogpostDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
