import React from "react";
import { actionTypes } from "../reducer";
import { useStateValue } from "../StateProvider";
import { activeSongFN } from "../utils";

export const LibrarySong = ({
  song,
  setCurrentSong,
  // songs,
  audioRef,
  isPlaying,
  // setSongs,
  id,
  currentSong,
  libraryStatus,
  setLibraryStatus,
}) => {
  const [{ songs }, dispatch] = useStateValue();

  const selectSongHandler = async (e) => {
    await setCurrentSong(song);
    dispatch({
      type: actionTypes.SET_SONGS,
      songs: activeSongFN(songs, currentSong)
    })
    
    if (isPlaying) audioRef.current.play();

    const activeSong = songs.map((song) =>
      id === song.id ? { ...song, active: true } : { ...song, active: false }
    );
    dispatch({
      type: actionTypes.SET_SONGS,
      songs: activeSong
    })
    // setSongs(activeSong);
    setLibraryStatus(!libraryStatus);
  };
  return (
    <div
      className={`LibrarySong ${song.active ? "selected" : ""}`}
      onClick={selectSongHandler}
    >
      <img alt={song.name + " album image"} src={song.cover} />
      <div className="description">
        <h2 className="songName">{song.name}</h2>
        <h3 className="artist">{song.artist}</h3>
      </div>
    </div>
  );
};
