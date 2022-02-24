import React, { Component, useEffect } from "react";
import { Route } from "react-router-dom";
import Gussing from "./guessing";
import Drawing from "./drawing";
import TopBar from "./topBar";

const Playground = ({ socket, history }) => {
  useEffect(() => {
    socket.on("session_over", () => {
      history.replace(`/`);
    });
  }, [socket]);
  const hadeleExitButton = async () => {
    await socket.emit("session_over");
    history.replace(`/`);
  };

  return (
    <React.Fragment>
      <Route
        path="/play-ground"
        render={props => (
          <TopBar socket={socket} onClickExit={hadeleExitButton} {...props} />
        )}
      />
      <Route
        path="/play-ground/drawing"
        render={props => <Drawing socket={socket} {...props} />}
      />
      <Route
        path="/play-ground/guessing"
        render={props => <Gussing socket={socket} {...props} />}
      />
    </React.Fragment>
  );
};
export default Playground;
