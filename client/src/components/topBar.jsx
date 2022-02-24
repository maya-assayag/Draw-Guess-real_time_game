import React, { Component } from "react";
import ScoreTable from "./scoreTable";

const TopBar = ({ socket, onClickExit }) => {
  return (
    <React.Fragment>
      <ScoreTable />
      <button type="button" class="btn btn-danger" onClick={onClickExit}>
        Exit
      </button>
    </React.Fragment>
  );
};
export default TopBar;
