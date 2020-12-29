import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";

export const Nav = () => {
  const [{ libraryStatus }, dispatch] = useStateValue();

  return (
    <nav>
      <h1>Waves</h1>
      <button
        className={`${libraryStatus ? "activeLibraryBtn" : ""}`}
        onClick={() =>
          dispatch({
            type: actionTypes.SET_LIBRARY_STATUS,
            libraryStatus: !libraryStatus,
          })
        }
      >
        Library
        <FontAwesomeIcon icon={faMusic} />
      </button>
    </nav>
  );
};
