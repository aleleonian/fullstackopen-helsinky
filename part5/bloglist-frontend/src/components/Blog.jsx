import { useState } from "react";
import blogService from '../services/blogs';

const Blog = ({ blog, updateThisBlogpost, removeThisBlogpost, errorMessageAlert, successMessageAlert }) => {
  const [displayInfo, setDisplayInfo] = useState(false);

  const toggleShowInfo = () => {
    setDisplayInfo(!displayInfo);
  }
  const increaseLikes = (blogObj) => {
    blogService.update(blogObj)
      .then((response) => {
        const updatedBlogpost = response.data;
        updateThisBlogpost(updatedBlogpost);
      })
      .catch((error) => {
        errorMessageAlert(error.response.data.error ? error.response.data.error : error.message);
        setTimeout(() => {
          errorMessageAlert(null)
        }, 5000);
      })
  }
  const removeBlogPost = (blogpost) => {
    if (confirm(`Do you really want to delete blogpost "${blogpost.title}"`)) {
      blogService.remove(blogpost)
        .then((response) => {
          removeThisBlogpost(blogpost.id);
          successMessageAlert('Blogpost removed allright!');
        })
        .catch((error) => {
          debugger;
          errorMessageAlert(error.response.data ? error.response.data : error.message);
          setTimeout(() => {
            errorMessageAlert(null)
          }, 5000);
        })
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  let loggedUser = window.localStorage.getItem("loggedBlogpostAppUser");
  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={toggleShowInfo}>{!displayInfo ? "view" : "hide"}</button>
      {displayInfo &&
        <>
          <div>{blog.url}</div>
          <div>{blog.likes} <button onClick={() => increaseLikes(blog)}>like</button></div>
          <div>{blog.author}</div>
          {JSON.parse(loggedUser).username === blog.user.username &&
            <div><button onClick={() => removeBlogPost(blog)}>remove</button></div>
          }
        </>
      }
    </div>
  )
}


export default Blog