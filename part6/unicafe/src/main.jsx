import React from "react";
import ReactDOM from "react-dom/client";
import { createStore } from "redux";
import { Provider } from "react-redux";

import App from "./App";
import { cafeReducer } from "./reducers/cafeReducer";
const store = createStore(cafeReducer);

const root = ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
