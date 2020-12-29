export const activeSongFN = (songs, currentSong) => {
  return songs.map((song) => {
    return currentSong.id === song.id
      ? { ...song, active: true }
      : { ...song, active: false };
  });
};
