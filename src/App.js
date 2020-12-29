import React, { useState, useRef, useEffect } from "react";
import "./styles/app.scss";
import { Nav, Song, Player, Library } from "./components";
import { useStateValue } from "./StateProvider";
import db from "./firebase";
import { actionTypes } from "./reducer";
// import data from "./data";

function App() {
  const [
    { themeState, volume, songs, libraryStatus, isPlaying },
    dispatch,
  ] = useStateValue();
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime,
      duration = e.target.duration,
      percentage = Math.round(
        (Math.round(current) / Math.round(duration)) * 100
      );

    setSongInfo({
      ...songInfo,
      currentTime: current,
      duration,
      animationPercentage: percentage,
    });
  };

  // SEED data into FIREBASE from data.js
  //
  // useEffect(() => {
  //   data().forEach(({ name, cover, artist, audio, color, active }) => {
  //     db.collection("songs").add({
  //       name,
  //       cover,
  //       artist,
  //       audio,
  //       color,
  //       active,
  //     });
  //   });
  // }, []);

  useEffect(() => {
    db.collection("songs").onSnapshot((snapshot) =>
      dispatch({
        type: actionTypes.SET_SONGS,
        songs: snapshot.docs.map((doc) => {
          const data = doc?.data(),
            id = doc?.id;
          return { id, ...data };
        }),
      })
    );
  }, [dispatch]);

  //Ref
  const audioRef = useRef(null),
    [currentSong, setCurrentSong] = useState(songs?.[0]),
    [songInfo, setSongInfo] = useState({
      currentTime: 0,
      duration: 0,
      animationPercentage: 0,
    }),
    [repeat, setRepeat] = useState(false);

  const songEndHandler = async () => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }
    const currentIndex = songs?.findIndex((song) => song.id === currentSong.id);
    await setCurrentSong(songs[[(currentIndex + 1) % songs.length]]);
    if (isPlaying) audioRef.current.play();
  };
  const setSongVolume = () => (audioRef.current.volume = volume);
  return (
    songs && (
      <div
        className={`App ${themeState === "Dark" ? "DarkTheme" : ""} ${
          libraryStatus ? "active-library" : ""
        }`}
      >
        <Nav />

        <Song currentSong={currentSong} />
        <Player
          setSongVolume={setSongVolume}
          audioRef={audioRef}
          currentSong={currentSong}
          songInfo={songInfo}
          setSongInfo={setSongInfo}
          setCurrentSong={setCurrentSong}
          setRepeat={setRepeat}
          repeat={repeat}
        />
        <Library
          currentSong={currentSong}
          setCurrentSong={setCurrentSong}
          audioRef={audioRef}
        />
        <audio
          onLoadedMetadataCapture={setSongVolume}
          onLoadedMetadata={timeUpdateHandler}
          onTimeUpdate={timeUpdateHandler}
          ref={audioRef}
          src={currentSong?.audio}
          onEnded={songEndHandler}
        ></audio>
      </div>
    )
  );
}

export default App;
