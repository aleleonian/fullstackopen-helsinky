import { useState, useContext} from 'react';
import blogService from '../services/blogs';
import BlogContext from '../BlogContext';

const Blog = ({
  blog,
  increaseLikes,
  removeThisBlogpost,
  errorMessageAlert,
  successMessageAlert,
}) => {
  const [displayInfo, setDisplayInfo] = useState(false);
  const { state, dispatch } = useContext(BlogContext);

  const toggleShowInfo = () => {
    setDisplayInfo(!displayInfo);
  };

  const removeBlogPost = (blogpost, dispatch, successMessageAlert, errorMessageAlert) => {
    if (confirm(`Do you really want to delete blogpost "${blogpost.title}"`)) {
      blogService
        .remove(blogpost)
        .then((response) => {
          removeThisBlogpost(blogpost.id, dispatch, state);
          successMessageAlert('Blogpost removed allright!', dispatch);
        })
        .catch((error) => {
          errorMessageAlert(
            error.response.data ? error.response.data.error : error.message,
            dispatch
          );
          setTimeout(() => {
            errorMessageAlert(null, dispatch);
          }, 5000);
        });
    }
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  let loggedUser = window.localStorage.getItem('loggedBlogpostAppUser');

  return (
    <div className="Blog" style={blogStyle}>
      <div id="blogpost-title"> {blog.title}</div>{' '}
      <button data-testid="view-hide-button" onClick={toggleShowInfo}>
        {!displayInfo ? 'view' : 'hide'}
      </button>
      {displayInfo && (
        <>
          <div>{blog.url}</div>
          <div>
            {blog.likes}{' '}
            <button
              data-testid="like-button"
              onClick={() => increaseLikes(blog, state, dispatch)}
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
                  onClick={() => removeBlogPost(blog, dispatch, successMessageAlert, errorMessageAlert)}
                >
                  remove
                </button>
              </div>
            )}
        </>
      )}
    </div>
  );
};

export default Blog;
