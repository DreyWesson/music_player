import React, { useState } from "react";
import { activeSongFN } from "../utils";
import {
  AllInclusiveOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  PauseCircleOutlineOutlined,
  PlayCircleOutlineOutlined,
  ShuffleOutlined,
  VolumeDownSharp,
  VolumeMuteSharp,
  VolumeUpSharp,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

const Player = ({
  currentSong,
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  setCurrentSong,
  songs,
  setSongs,
  setRepeat,
  repeat,
  setSongVolume,
}) => {
  const [{ volume }, dispatch] = useStateValue();

  //Handlers
  const shuffleHandler = async () => {
    let songsref = [...songs];
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    songsref.splice(currentIndex, 1);
    let random = Math.floor(Math.random() * songsref.length);
    let randomSong = songsref[random];
    setIsPlaying(true);
    await setCurrentSong(randomSong);
    activeSongFN(songs, currentSong, setSongs);
    audioRef.current.play();
    const activeSong = songs.map((song) => {
      if (song === randomSong) {
        return { ...randomSong, active: true };
      } else {
        return { ...song, active: false };
      }
    });
    setSongs(activeSong);
  };
  const playSongHandler = () => {
    if (isPlaying === false) {
      setIsPlaying(!isPlaying);
      audioRef.current.play();
    } else {
      setIsPlaying(!isPlaying);
      audioRef.current.pause();
    }
  };
  const dragHandler = (e) => {
    setSongInfo({ ...songInfo, currentTime: e.target.value });
    audioRef.current.currentTime = e.target.value;
  };
  const repeatHandler = () => {
    setRepeat(!repeat);
  };
  const changeVolumeHandler = (e) => {
    const value = e.target.value / 100;
    dispatch({
      type: actionTypes.SET_VOLUME,
      volume: value,
    });
    audioRef.current.volume = volume;
    if (value === 0) audioRef.current.volume = 0;
  };
  const getTime = (time) => {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  };
  const skipSong = async (direction) => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "back") {
      await setCurrentSong(
        songs[currentIndex === 0 ? songs.length - 1 : currentIndex - 1]
      );
      activeSongFN(
        songs,
        songs[currentIndex === 0 ? songs.length - 1 : currentIndex - 1],
        setSongs
      );
    } else {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeSongFN(songs, songs[(currentIndex + 1) % songs.length], setSongs);
    }
    if (isPlaying) audioRef.current.play();
  };
  const volumeIcon = () => {
    if (volume >= 0.5) {
      return (
        <IconButton className="audioSVG">
          <VolumeUpSharp onClick={muteVolume} fontSize="large" />
        </IconButton>
      );
    } else if (volume === 0) {
      return (
        <IconButton className="audioSVG" onClick={muteVolume}>
          <VolumeMuteSharp fontSize="large" />
        </IconButton>
      );
    } else if (volume < 0.5) {
      return (
        <IconButton className="audioSVG" onClick={muteVolume}>
          <VolumeDownSharp fontSize="large" />
        </IconButton>
      );
    }
  };
  const [activeVolume, setActiveVolume] = useState(false);
  const muteVolume = () => {
    if (volume === 0) {
      dispatch({
        type: actionTypes.SET_VOLUME,
        volume: volume,
      });
      audioRef.current.volume = volume;
      return;
    }
    dispatch({
      type: actionTypes.SET_VOLUME,
      volume: 0,
    });
    audioRef.current.volume = 0;
  };

  return (
    <div className="player">
      <div className="time-control">
        <div
          className="cont"
          onMouseOver={() => {
            setActiveVolume(true);
          }}
          onMouseLeave={() => {
            setActiveVolume(false);
          }}
        >
          {volumeIcon()}
          <div
            className="track2"
            style={{
              opacity: `${activeVolume ? "1" : "0"}`,
              pointerEvents: `${activeVolume ? "all" : "none"}`,
            }}
          >
            <input
              onChange={changeVolumeHandler}
              type="range"
              max="100"
              min="0"
            />
            <div
              style={{
                transform: `translateX(${volume * 100}%)`,
              }}
              className="passedVolume"
            ></div>
          </div>
        </div>
        <span className="time">{getTime(songInfo.currentTime)}</span>
        <div
          className="track"
          style={{
            background: `linear-gradient(to right,${currentSong.color[0]},${currentSong.color[1]})`,
          }}
        >
          <input
            className="timeInput"
            onChange={dragHandler}
            min={0}
            max={songInfo.duration || 0}
            value={songInfo.currentTime}
            type="range"
          />
          <div
            style={{
              transform: `translateX(${songInfo.animationPercentage}%)`,
            }}
            className="passedTime"
          ></div>
        </div>
        <span className="time">
          {songInfo.duration ? getTime(songInfo.duration) : "0:00"}
        </span>
      </div>
      <div className="play-control">
        <IconButton onClick={shuffleHandler}>
          <ShuffleOutlined className="shuffle" fontSize="large" />
        </IconButton>
        <IconButton onClick={() => skipSong("back")}>
          <ChevronLeftOutlined className="skip-back" fontSize="large" />
        </IconButton>
        {isPlaying ? (
          <IconButton onClick={playSongHandler}>
            <PauseCircleOutlineOutlined
              className="play"
              style={{ fontSize: 45 }}
            />
          </IconButton>
        ) : (
          <IconButton onClick={playSongHandler}>
            <PlayCircleOutlineOutlined
              className="play"
              style={{ fontSize: 45 }}
            />
          </IconButton>
        )}

        <IconButton onClick={() => skipSong("forward")}>
          <ChevronRightOutlined className="skip-next" fontSize="large" />
        </IconButton>

        <div className="repeatDiv">
          <IconButton onClick={repeatHandler}>
            <AllInclusiveOutlined className="repeat" fontSize="large" />
          </IconButton>
          <div
            className={`${repeat ? "active-repeat" : ""}`}
            style={{
              background: currentSong.color[0],
              filter: `drop-shadow(0px 0px 3px ${currentSong.color[0]})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default Player;
