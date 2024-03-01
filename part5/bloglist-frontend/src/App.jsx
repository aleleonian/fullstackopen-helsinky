import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './assets/App.css';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user !== null) {
      blogService.getAll().then(blogs => {
        setBlogs(blogs)
      })
        .catch(error => {
          console.log(error);
          setErrorMessage(error);
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }, [user]);

  useEffect(() => {
    let loggedUser = window.localStorage.getItem("loggedBlogpostAppUser");
    if (loggedUser) {
      loggedUser = JSON.parse(loggedUser);
      blogService.setToken(loggedUser.token);
      setUser(loggedUser);
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault();

    debugger;

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem('loggedBlogpostAppUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
  }

  const loginForm = () => (
    <>
      <h1>Login to application</h1>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" onClick={handleLogin}>login</button>
      </form>
    </>
  )

  const logOut = () => {
    window.localStorage.removeItem("loggedBlogpostAppUser");
    blogService.setToken(null);
    location.reload();
  }

  const newBlogpostHandler = (event) => {
    event.preventDefault();
    const formData = new FormData(document.getElementById('newBlogpost'));

    const formDataObject = {};

    for (const [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }

    blogService.create(formDataObject)
      .then(response => {
        const newBlogs = [...blogs];
        newBlogs.push(formDataObject);
        setSuccessMessage("Blogpost created succesfully!");
        setBlogs(newBlogs);
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000);

        // now gotta add the new blogpost locally
        // by making a new object from what was returned

      })
      .catch(exception => {
        setErrorMessage(exception.response.data.error);
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
      })
  }

  const bloglistForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        {user.name} is logged in <button onClick={logOut}>log out</button>

        <h2>Create a new blogpost</h2>
        <form id="newBlogpost">
          <div>
            title: <input id="title" name="title" />
          </div>
          <div>
            author: <input id="author" name="author" />
          </div>
          <div>
            url: <input id="url" name="url" />
          </div>
          <div>
            <button onClick={newBlogpostHandler}>create</button>
          </div>

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </form>
      </div>
    )
  }

  return (
    <>
      <Notification message={successMessage} type="success" />

      <Notification message={errorMessage} type="error" />

      {user && bloglistForm()}
      {!user && loginForm()}
    </>
  )
}

export default App

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}