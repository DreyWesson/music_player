export const initialState = {
  themeState: "Light",
  volume: 1,
};
export const actionTypes = {
  SET_THEME_STATE: "SET_THEME_STATE",
  SET_VOLUME: "SET_VOLUME",
};

function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_THEME_STATE:
      return { ...state, themeState: action.themeState };
    case actionTypes.SET_VOLUME:
      return { ...state, volume: action.volume };
    default:
      return state;
  }
}

export default reducer;
