import React, { Component } from "react";
import ScoreTable from "./scoreTable";

const TopBar = ({ onClickExit, drawer, guesser }) => {
  return (
    <React.Fragment>
      <ScoreTable drawer={drawer} guesser={guesser} />
      
      <button type="button" className="btn btn-danger" onClick={onClickExit}>
        Exit
      </button>
    </React.Fragment>
  );
};
export default TopBar;
