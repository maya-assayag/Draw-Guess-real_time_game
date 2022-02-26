import React, { Component } from "react";
import ScoreTable from "./scoreTable";

const TopBar = ({ onClickExit, session }) => {
  return (
    <React.Fragment>
      <ScoreTable session={session} />

      <button type="button" className="btn btn-danger" onClick={onClickExit}>
        Exit
      </button>
    </React.Fragment>
  );
};
export default TopBar;
