export const activeSongFN = (songs, currentSong, setSongs) => {
  const activeSong = songs.map((song) => {
    return currentSong.id === song.id
      ? { ...song, active: true }
      : { ...song, active: false };
  });
  setSongs(activeSong);
};
