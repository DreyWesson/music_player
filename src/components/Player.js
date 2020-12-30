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
  const { SET_VOLUME, SET_SONGS, SET_PLAY } = actionTypes;
  const setVolume = (volume) => {
    dispatch({
      type: SET_VOLUME,
      volume,
    });
  };
  const isPlayingDispatch = (data) =>
    dispatch({ type: SET_PLAY, isPlaying: data });

  //Handlers
  const shuffleHandler = async () => {
    let songsRef = [...songs],
      currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    songsRef.splice(currentIndex, 1);
    let random = Math.floor(Math.random() * songsRef.length),
      randomSong = songsRef[random];
    isPlayingDispatch(true);
    await setCurrentSong(randomSong);
    dispatch({
      type: SET_SONGS,
      songs: activeSongFN(songs, currentSong),
    });

    audioRef.current.play();
    const activeSong = songs.map((song) =>
      song === randomSong
        ? { ...randomSong, active: true }
        : { ...song, active: false }
    );
    dispatch({
      type: SET_SONGS,
      songs: activeSong,
    });
  };
  const playSongHandler = () => {
    if (isPlaying === false) {
      isPlayingDispatch(!isPlaying);
      audioRef.current.play();
    } else {
      isPlayingDispatch(!isPlaying);
      audioRef.current.pause();
    }
  };
  const dragHandler = (e) => {
    setSongInfo({ ...songInfo, currentTime: e.target.value });
    audioRef.current.currentTime = e.target.value;
  };
  const repeatHandler = () => setRepeat(!repeat);
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
      const currentSongIndex =
        songs[currentIndex === 0 ? songs.length - 1 : currentIndex - 1];
      await setCurrentSong(currentSongIndex);
      dispatch({
        type: SET_SONGS,
        songs: activeSongFN(songs, currentSongIndex),
      });
    } else {
      const currentSongIndex = songs[(currentIndex + 1) % songs.length];
      await setCurrentSong(currentSongIndex);
      dispatch({
        type: SET_SONGS,
        songs: activeSongFN(songs, currentSongIndex),
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
            className={`${repeat && "active-repeat"}`}
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
