import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './assets/App.css';

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (user !== null) {
      blogService.getAll().then(blogs =>
        setBlogs(blogs)
      );
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
      }, 5000)
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

  const bloglistForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
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