import React from "react";
import ReactDOM from "react-dom/client";
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BlogContextProvider } from './BlogContext';


const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BlogContextProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BlogContextProvider>

);
