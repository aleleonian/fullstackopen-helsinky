const initialState = {
  good: 0,
  neutral: 0,
  bad: 0,
};

export const cafeReducer = (state = initialState, action) => {
  let newState = { ...state };

  switch (action.type) {
    case "GOOD":
      newState.good++;
      return newState;
    case "NEUTRAL":
      newState.neutral++;
      return newState;
    case "BAD":
      newState.bad++;
      return newState;
    case "ZERO":
      newState.good = 0;
      newState.neutral = 0;
      newState.bad = 0;
      return newState;
    default:
      return newState;
  }
};
