import { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({
  blog,
  removeThisBlogpost,
  errorMessageAlert,
  successMessageAlert,
}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  // let loggedUser = window.localStorage.getItem('loggedBlogpostAppUser');

  return (
    <div className="Blog" style={blogStyle}>
      <div id="blogpost-title"> <a href={`/blogs/${blog.id}`}>{blog.title}</a></div>{' '}
      {/* {displayInfo && (
        <>
          <div>{blog.url}</div>
          <div>
            {blog.likes}{' '}
            <button
              data-testid="like-button"
              onClick={() => increaseLikes(blog)}
            >
              like
            </button>
          </div>
          <div>{blog.author}</div>
          {loggedUser &&
            JSON.parse(loggedUser).username === blog.user.username && (
              <div>
                <button
                  data-testid="remove-button"
                  onClick={() => removeBlogPost(blog)}
                >
                  remove
                </button>
              </div>
            )}
        </>
      )} */}
    </div>
  );
};

export default Blog;
