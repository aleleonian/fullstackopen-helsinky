const Blog = ({
  blog,
}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  //style={blogStyle}
  // let loggedUser = window.localStorage.getItem('loggedBlogpostAppUser');

  return (
    <div className="Blog">
      <div id="blogpost-title"> <a href={`/blogs/${blog.id}`}>{blog.title}</a></div>{' '}
    </div>
  );
};

export default Blog;
