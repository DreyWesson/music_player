import React, { useState, useRef } from "react";
import "./styles/app.scss";
//Components
import Song from "./components/Song";
import Player from "./components/Player";
import Library from "./components/Library";
import Nav from "./components/Nav";
import data from "./data";
import { useStateValue } from "./StateProvider";

function App() {
  // const [{ theme }] = useStateValue();

  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime,
      duration = e.target.duration,
      precentage = Math.round(
        (Math.round(current) / Math.round(duration)) * 100
      );

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: precentage,
    });
  };

  //Ref
  const audioRef = useRef(null),
    //Stat
    [songs, setSongs] = useState(data()),
    [currentSong, setCurrentSong] = useState(songs[0]),
    [isPlaying, setIsPlaying] = useState(false),
    [songInfo, setSongInfo] = useState({
      currentTime: 0,
      duration: 0,
      animationPercentage: 0,
    }),
    themeLocal = localStorage.getItem("theme");
  // Initial state
  themeLocal === null && localStorage.setItem("theme", "Light");

  const [theme, setTheme] = useState(themeLocal);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const volumeStorage = () =>
    localStorage.getItem("volume") ? localStorage.getItem("volume") : 1; //volume initial state

  const [volume, setVolume] = useState(JSON.parse(volumeStorage()));

  const songEndHandler = async () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[[(currentIndex + 1) % songs.length]]);
    if (isPlaying) audioRef.current.play();
  };
  const setSongVolume = () => {
    audioRef.current.volume = volumeStorage();
  };
  return (
    <div
      className={`App ${theme === "Dark" ? "DarkTheme" : ""} ${
        libraryStatus ? "active-library" : ""
      }`}
    >
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} isPlaying={isPlaying} />
      <Player
        setSongVolume={setSongVolume}
        volume={volume}
        setVolume={setVolume}
        audioRef={audioRef}
        currentSong={currentSong}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        setCurrentSong={setCurrentSong}
        songs={songs}
        setSongs={setSongs}
        setRepeat={setRepeat}
        repeat={repeat}
      />
      <Library
        currentSong={currentSong}
        songs={songs}
        libraryStatus={libraryStatus}
        setSongs={setSongs}
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        isPlaying={isPlaying}
        theme={theme}
        setTheme={setTheme}
      />
      <audio
        onLoadedMetadataCapture={setSongVolume}
        onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        ref={audioRef}
        src={currentSong.audio}
        onEnded={songEndHandler}
      ></audio>
    </div>
  );
}

export default App;
