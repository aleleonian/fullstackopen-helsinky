import { cafeReducer } from "./cafeReducer";
import deepFreeze from "deep-freeze";

describe("cafeReducer", () => {
  test("returns new state", () => {
    const initialState = {
      good: 0,
      neutral: 0,
      bad: 0,
    };

    const goodAction = {
      type: "GOOD",
    };
    const neutralAction = {
      type: "NEUTRAL",
    };

    deepFreeze(initialState);

    let newState = cafeReducer(initialState, goodAction);

    newState = cafeReducer(newState, neutralAction);

    expect(newState).toEqual({
      good: 1,
      neutral: 1,
      bad: 0,
    });
  });
});
