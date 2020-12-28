export const initialState = {
  theme: "light",
  volume: 1,
};
export const actionTypes = {
  SET_THEME: "SET_THEME",
  SET_VOLUME: "SET_VOLUME",
};

// export const getBasketTotal = (basket) =>
//   basket?.reduce((amount, item) => item.price + amount, 0);

function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_THEME:
      return { ...state, theme: action.theme };
    case actionTypes.SET_VOLUME:
      return { ...state, volume: action.volume };
    default:
      return state;
  }
}

export default reducer;
