import React from "react";
import ScoreTable from "./scoreTable/scoreTable";

const TopBar = ({ onClickExit, session }) => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col">
            <ScoreTable session={session} />
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-danger"
              onClick={onClickExit}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default TopBar;
