import React from "react";
import { useStateValue } from "../StateProvider";

export const Song = ({ currentSong }) => {
  const [{ isPlaying }] = useStateValue();

  return (
    <div className="song-container">
      <img
        className={`${isPlaying ? "playing" : ""}`}
        alt={currentSong?.name + " album image"}
        src={currentSong?.cover}
      />
      <h2>{currentSong?.name}</h2>
      <h3>{currentSong?.artist}</h3>
    </div>
  );
};
