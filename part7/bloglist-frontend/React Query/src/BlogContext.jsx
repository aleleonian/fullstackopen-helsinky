import { createContext, useReducer, useContext } from 'react';
import blogs from './services/blogs';

const initialState = {
  user: null,
  username: '',
  password: '',
  errorMessage: null,
  successMessage: null,
  blogs:[]
};

const BlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.payload };
    case 'SET_SUCCESS_MESSAGE':
      return { ...state, successMessage: action.payload };
    case 'SET_BLOGS':
      return { ...state, blogs: action.payload };
    default:
      return state;
  }
};

const BlogContext = createContext();

export const BlogContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(BlogReducer, initialState);
  return (
    <BlogContext.Provider value={{ state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
}

export const useBlogContext = () => useContext(BlogContext);

export default BlogContext;
