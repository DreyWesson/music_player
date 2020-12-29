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

export const Player = ({
  currentSong,
  audioRef,
  songInfo,
  setSongInfo,
  setCurrentSong,
  setRepeat,
  repeat,
}) => {
  const [{ songs, volume, isPlaying }, dispatch] = useStateValue();
  const setVolume = (volume) => {
    dispatch({
      type: actionTypes.SET_VOLUME,
      volume,
    });
  };

  //Handlers
  const shuffleHandler = async () => {
    let songsref = [...songs];
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    songsref.splice(currentIndex, 1);
    let random = Math.floor(Math.random() * songsref.length);
    let randomSong = songsref[random];
    dispatch({ type: actionTypes.SET_PLAY, isPlaying: true });
    await setCurrentSong(randomSong);
    dispatch({
      type: actionTypes.SET_SONGS,
      songs: activeSongFN(songs, currentSong),
    });

    audioRef.current.play();
    const activeSong = songs.map((song) => {
      if (song === randomSong) {
        return { ...randomSong, active: true };
      } else {
        return { ...song, active: false };
      }
    });
    dispatch({
      type: actionTypes.SET_SONGS,
      songs: activeSong,
    });
  };
  const playSongHandler = () => {
    if (isPlaying === false) {
      dispatch({ type: actionTypes.SET_PLAY, isPlaying: !isPlaying });
      audioRef.current.play();
    } else {
      dispatch({ type: actionTypes.SET_PLAY, isPlaying: !isPlaying });
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
    setVolume(value);
    audioRef.current.volume = volume;
    if (value === 0) audioRef.current.volume = 0;
  };
  const getTime = (time) =>
    ((time / 60) | 0) + ":" + ("0" + (time % 60 | 0)).slice(-2);

  const skipSong = async (direction) => {
    const currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    if (direction === "back") {
      await setCurrentSong(
        songs[currentIndex === 0 ? songs.length - 1 : currentIndex - 1]
      );
      dispatch({
        type: actionTypes.SET_SONGS,
        songs: activeSongFN(
          songs,
          songs[currentIndex === 0 ? songs.length - 1 : currentIndex - 1]
        ),
      });
    } else {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);

      dispatch({
        type: actionTypes.SET_SONGS,
        songs: activeSongFN(songs, songs[(currentIndex + 1) % songs.length]),
      });
    }
    if (isPlaying) audioRef.current.play();
  };
  const volumeIcon = () => {
    const setVolumeIcon = () => {
      if (volume >= 0.5) {
        return <VolumeUpSharp onClick={muteVolume} fontSize="large" />;
      } else if (volume === 0) {
        return <VolumeMuteSharp fontSize="large" />;
      } else if (volume < 0.5) {
        return <VolumeDownSharp fontSize="large" />;
      }
    };
    return <IconButton className="audioSVG">{setVolumeIcon()}</IconButton>;
  };
  const [activeVolume, setActiveVolume] = useState(false);
  const muteVolume = () => {
    if (volume === 0) {
      setVolume(volume);
      audioRef.current.volume = volume;
      return;
    }
    setVolume(0);
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
            background: `linear-gradient(to right,${currentSong?.color[0]},${currentSong?.color[1]})`,
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
              background: currentSong?.color[0],
              filter: `drop-shadow(0px 0px 3px ${currentSong?.color[0]})`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
