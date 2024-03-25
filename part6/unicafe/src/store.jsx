import { cafeReducer } from "./reducers/cafeReducer";
import { createStore } from "redux";
export const store = createStore(cafeReducer);