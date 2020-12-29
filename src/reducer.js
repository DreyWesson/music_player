export const initialState = {
  themeState: "Light",
  volume: 1,
  songs: [
    {
      name: "Beaver Creek",
      cover:
        "https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg",
      artist: "Aso, Middle School, Aviino",
      audio: "https://mp3.chillhop.com/serve.php/?mp3=10075",
      color: ["#205950", "#2ab3bf"],
      id: "vsGb2i2CmbigpNV30BIX",
      active: true,
    },
  ],
  libraryStatus: false,
  isPlaying: false,
};

// audioRef, isPlaying, setCurrentSong, currentSong

export const actionTypes = {
  SET_THEME_STATE: "SET_THEME_STATE",
  SET_VOLUME: "SET_VOLUME",
  SET_SONGS: "SET_SONGS",
  SET_LIBRARY_STATUS: "SET_LIBRARY_STATUS",
  SET_PLAY: "SET_PLAY",
};

function reducer(state, action) {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_THEME_STATE:
      return { ...state, themeState: action.themeState };
    case actionTypes.SET_VOLUME:
      return { ...state, volume: action.volume };
    case actionTypes.SET_SONGS:
      return { ...state, songs: action.songs };
    case actionTypes.SET_LIBRARY_STATUS:
      return { ...state, libraryStatus: action.libraryStatus };
    case actionTypes.SET_PLAY:
      return { ...state, isPlaying: action.isPlaying };
    default:
      return state;
  }
}

export default reducer;
