import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
// import store from './store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { BlogProvider } from './BlogContext';


const queryClient = new QueryClient();

// ReactDOM.render(
//   <QueryClientProvider client={queryClient}>
//     {/* <Provider store={store}> */}
//       <App />
//     {/* </Provider> */}
//   </QueryClientProvider>
//   ,
//   document.getElementById('root')
// );

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <QueryClientProvider client={queryClient}>
      <App />
  </QueryClientProvider>
);

// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
