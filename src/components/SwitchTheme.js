import React from "react";
import { useStateValue } from "../StateProvider";
import { actionTypes } from "../reducer";
import { Brightness2Outlined, WbSunnyOutlined } from "@material-ui/icons";

export const SwitchTheme = ({ setLibraryStatus, libraryStatus }) => {
  const [{ themeState }, dispatch] = useStateValue();

  const setThemeState = (mode) =>
      dispatch({
        type: actionTypes.SET_THEME_STATE,
        themeState: mode,
      }),
    switchTheme = () => {
      function onThemeChange(theme) {
        setThemeState(theme);
        setLibraryStatus(!libraryStatus);
      }
      themeState === "Dark" ? onThemeChange("Light") : onThemeChange("Dark");
    };

  return (
    <div className="changeTheme">
      <span style={{ color: themeState === "Light" ? "black" : "white" }}>
        {themeState}
      </span>
      <div
        onClick={switchTheme}
        className="switchDiv"
        style={{ background: themeState === "Light" ? "#edc22b" : "#2f2f2f" }}
      >
        <Brightness2Outlined
          fontSize="large"
          style={{
            width: "28px",
            height: "28px",
            color: "white",
            display: themeState === "Light" ? "none" : "block",
          }}
        />
        <div className="Switchcircle"></div>
        <WbSunnyOutlined
          fontSize="large"
          style={{
            width: "28px",
            height: "28px",
            color: "white",
            display: themeState === "Light" ? "block" : "none",
          }}
        />
      </div>
    </div>
  );
};
