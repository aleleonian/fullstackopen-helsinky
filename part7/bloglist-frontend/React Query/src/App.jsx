import { useState, useEffect, useRef, useContext } from 'react';
import blogService from './services/blogs';
import loginService from './services/login';
import Blog from './components/Blog';
import { Form } from './components/Form';
import './assets/App.css';
import { useQuery } from '@tanstack/react-query';
import BlogContext from './BlogContext';

const App = () => {
  const { state, dispatch } = useContext(BlogContext); 
  const [hasDispatchedError, setHasDispatchedError] = useState(false);
  const token = blogService.getToken();
  const blogpostFormRef = useRef();

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



  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const username = state.username;
      const password = state.password;

      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem(
        'loggedBlogpostAppUser',
        JSON.stringify(user)
      );
      blogService.setToken(user.token);
      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_USERNAME', payload: '' });
      dispatch({ type: 'SET_PASSWORD', payload: '' });
    } catch (exception) {
      const message = exception.response.status === 401 ? "Wrong credentials!" : exception.message
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: message });
      setTimeout(() => {
        dispatch({ type: 'SET_ERROR_MESSAGE', payload: null });
      }, 5000);
    }
  };

  const loginForm = () => (
    <>
      <h1>Login to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={state.username}
            name="Username"
            data-testid="username"
            onChange={({ target }) => dispatch({ type: 'SET_USERNAME', payload: target.value })}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={state.password}
            name="Password"
            data-testid="password"
            onChange={({ target }) => ispatch({ type: 'SET_PASSWORD', payload: target.value })}
          />
        </div>
        <button type="submit" onClick={handleLogin}>
          login
        </button>
      </form>
      {state.errorMessage && <Notification message={state.errorMessage} type="error" />}
    </>
  );

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogpostAppUser');
    blogService.setToken(null);
    location.reload();
  };

  const cleanup = () => {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('url').value = '';
  };

  const newBlogpostHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const newBlogpostObject = {};

    for (const [key, value] of formData.entries()) {
      newBlogpostObject[key] = value;
    }

    blogService
      .create(newBlogpostObject)
      .then((response) => {
        const newBlogpostsArray = [...blogs];
        newBlogpostObject.id = response.data.id;
        const loggedUser = JSON.parse(
          window.localStorage.getItem('loggedBlogpostAppUser')
        );
        if (loggedUser) {
          newBlogpostObject.user = {};
          newBlogpostObject.user.username = loggedUser.username;
          newBlogpostObject.user.name = loggedUser.name;
          newBlogpostObject.user.id = loggedUser.id;
        }
        newBlogpostsArray.push(newBlogpostObject);
        dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: 'Blogpost created succesfully!' });
        cleanup();
        dispatch({ type: 'SET_BLOGS', payload: newBlogpostsArray });
        blogpostFormRef.current.toggleVisibility();
        setTimeout(() => {
          dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null });
        }, 5000);

        // now gotta add the new blogpost locally
        // by making a new object from what was returned
      })
      .catch((exception) => {
        // setErrorMessage(
        //   `Error creating blogpost: ${exception.response.data.error
        //     ? exception.response.data.error
        //     : exception.message
        //   }`
        // );
        dispatch({
          type: 'SET_ERROR_MESSAGE', payload: `Error creating blogpost: ${exception.response.data.error
            ? exception.response.data.error
            : exception.message
            }`
        });
        setTimeout(() => {
          dispatch({
            type: 'SET_ERROR_MESSAGE', payload: null
          });
        }, 5000);
      });
  };

  const updateThisBlogpost = (updatedBlogpost) => {
    const desiredBlogIndex = state.blogs.findIndex(
      (blog) => blog.id === updatedBlogpost.id
    );
    const newBlogpostsArray = [...blogs];
    newBlogpostsArray[desiredBlogIndex] = updatedBlogpost;
    dispatch({ type: 'SET_BLOGS', payload: newBlogpostsArray });
  };

  const removeThisBlogpost = (removedBlogpostId) => {
    const updatedBlogposts = [...blogs];
    const removedBpIndex = state.blogs.findIndex(
      (blog) => blog.id === removedBlogpostId
    );
    updatedBlogposts.splice(removedBpIndex, 1);
    dispatch({ type: 'SET_BLOGS', payload: updatedBlogposts });
  };

  const successMessageAlert = (message) => {
    dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: message });
    setTimeout(() => {
      dispatch({ type: 'SET_SUCCESS_MESSAGE', payload: null });
    }, 5000);
  };

  const errorMessageAlert = (message) => {
    dispatch({
      type: 'SET_ERROR_MESSAGE', payload: message
    });
    setTimeout(() => {
      dispatch({
        type: 'SET_ERROR_MESSAGE', payload: null
      });
    }, 5000);
  };

  const increaseLikes = (blogObj) => {
    blogService
      .update(blogObj)
      .then((response) => {
        blogObj.likes = response.data.likes;
        updateThisBlogpost(blogObj);
      })
      .catch((error) => {
        errorMessageAlert(
          error.response.data.error ? error.response.data.error : error.message
        );
        setTimeout(() => {
          errorMessageAlert(null);
        }, 5000);
      });
  };

  const loggedInuser = () => {
    console.log("User is logged in!");
    return (
      <>
        <Notification message={state.successMessage} type="success" />
        <Notification message={state.errorMessage} type="error" />
        <h2>blogs</h2>
        {state.user.name} is logged in <button onClick={logOut}>log out</button>
        <Form createBlogpost={newBlogpostHandler} reference={blogpostFormRef} />
        {state.blogs.map((blog) => {
          return (
            <Blog
              key={blog.id}
              blog={blog}
              increaseLikes={increaseLikes}
              updateThisBlogpost={updateThisBlogpost}
              removeThisBlogpost={removeThisBlogpost}
              errorMessageAlert={errorMessageAlert}
              successMessageAlert={successMessageAlert}
            />
          );
        })}
      </>
    );
  };
  return (
    <>
      {state.user && loggedInuser()}
      {!state.user && loginForm()}
    </>
  );
};

export default App;

const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return <div className={type}>{message}</div>;
};
