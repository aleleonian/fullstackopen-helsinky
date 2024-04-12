import { createContext, useReducer, useContext } from 'react';

const anecdoteReducer = (state, action) => {
  return action.message;
};

const AnecdoteContext = createContext();

export const AnecdoteContextProvider = (props) => {
  const [notificationMessage, notificationMessageDispatch] = useReducer(anecdoteReducer, "i'll take you shopping");

  return (
    <AnecdoteContext.Provider value={[notificationMessage, notificationMessageDispatch]}>
      {props.children}
    </AnecdoteContext.Provider>
  )
}

export const useNotificationMessage = () => {
  const messageAndDispatch = useContext(AnecdoteContext)
  return messageAndDispatch[0]
}

export const useNotificationMessageDispatch = () => {
  const messageAndDispatch = useContext(AnecdoteContext)
  return messageAndDispatch[1]
}

export default AnecdoteContext