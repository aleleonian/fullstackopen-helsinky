import { useState } from "react";


const Blog = ({ blog }) => {
  const [displayInfo, setDisplayInfo] = useState(false);

  const toggleShowInfo = () => {
    setDisplayInfo(!displayInfo);
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
          <div>{blog.likes} <button>like</button></div>
          <div>{blog.author}</div>
        </>
      }
    </div>
  )
}


export default Blog