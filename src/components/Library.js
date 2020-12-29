import React, { useRef, useEffect } from "react";
import { useStateValue } from "../StateProvider";
import { LibrarySong, SwitchTheme } from "./index";

export const Library = ({ setCurrentSong, audioRef, currentSong }) => {
  const songsLibrary = useRef(null);
  const [{ songs, libraryStatus }] = useStateValue();

  useEffect(() => {
    //Scroll to selected
    const index = songs.findIndex((e) => e.id === currentSong.id),
      children = [...songsLibrary.current.children];
    let scrolledLength = 0;
    children.forEach((e, i) =>
      i < index ? (scrolledLength += e.offsetHeight) : ""
    );
    songsLibrary.current.scrollTop = scrolledLength;
  }, [currentSong, songs]);
  return (
    songs && (
      <div className={`Library ${libraryStatus ? "Library-active" : ""}`}>
        <h1 className="Library-label">Library</h1>
        <div ref={songsLibrary} className="songsLib">
          {songs.map((song) => (
            <LibrarySong
              currentSong={currentSong}
              setCurrentSong={setCurrentSong}
              key={song.id}
              song={song}
              songsLibrary={songsLibrary}
              songs={songs}
              audioRef={audioRef}
              id={song.id}
            />
          ))}
        </div>
        <div className="switchSection">
          <SwitchTheme />
        </div>
      </div>
    )
  );
};
