import React, { useState, useRef, useEffect } from "react";
import "./styles/app.scss";
import { Nav, Song, Player, Library } from "./components";
import { useStateValue } from "./StateProvider";
import db from "./firebase";

function App() {
  const [{ themeState, volume }] = useStateValue();
  const [songs, setSongs] = useState([
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
  ]);

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
  // import data from "./data";
  //
  // useEffect(() => {
  //   console.log(data);
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
      setSongs(
        snapshot.docs.map((doc) => {
          const data = doc?.data(),
            id = doc?.id;
          return { id, ...data };
        })
      )
    );
  }, []);

  //Ref
  const audioRef = useRef(null),
    [currentSong, setCurrentSong] = useState(songs?.[0]),
    [isPlaying, setIsPlaying] = useState(false),
    [songInfo, setSongInfo] = useState({
      currentTime: 0,
      duration: 0,
      animationPercentage: 0,
    }),
    [libraryStatus, setLibraryStatus] = useState(false),
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
        <Nav
          libraryStatus={libraryStatus}
          setLibraryStatus={setLibraryStatus}
        />
        <Song currentSong={currentSong} isPlaying={isPlaying} />
        <Player
          setSongVolume={setSongVolume}
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
          setLibraryStatus={setLibraryStatus}
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
