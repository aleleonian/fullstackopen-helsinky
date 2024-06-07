import { createContext, useReducer, useContext } from 'react';

const initialState = {
  user: null,
  username: '',
  password: '',
  errorMessage: null,
  successMessage: null,
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
    default:
      return state;
  }
};

const BlogContext = createContext();

export const BlogContextProvider = (props) => {
  const [state, dispatch] = useReducer(BlogReducer, initialState);
  console.log('Initial State in BlogContextProvider:', state); // Log initial state
  return (
    <BlogContext.Provider value={[state, dispatch]}>
      {props.children}
    </BlogContext.Provider>
  )
}

export const useNotificationMessage = () => {
  const messageAndDispatch = useContext(BlogContext)
  return messageAndDispatch[0]
}

export const useNotificationMessageDispatch = () => {
  const messageAndDispatch = useContext(BlogContext)
  return messageAndDispatch[1]
}

export default BlogContext