import { useState } from "react";
import blogService from '../services/blogs';

const Blog = ({ blog, updateBlogposts, errorMessageAlert }) => {
  const [displayInfo, setDisplayInfo] = useState(false);

  const toggleShowInfo = () => {
    setDisplayInfo(!displayInfo);
  }
  const increaseLikes = (blogObj) => {
    blogService.update(blogObj)
      .then((response) => {
        const updatedBlogpost = response.data;
        updateBlogposts(updatedBlogpost);
      })
      .catch((error) => {
        errorMessageAlert(error.response.data.error ? error.response.data.error : error.message);
      })
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={toggleShowInfo}>{!displayInfo ? "view" : "hide"}</button>
      {displayInfo &&
        <>
          <div>{blog.url}</div>
          <div>{blog.likes} <button onClick={() => increaseLikes(blog)}>like</button></div>
          <div>{blog.author}</div>
        </>
      }
    </div>
  )
}


export default Blog