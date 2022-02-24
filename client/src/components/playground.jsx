import React, { Component, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import Gussing from "./guessing";
import Drawing from "./drawing";
import TopBar from "./topBar";

const Playground = ({ socket, history }) => {
  const [drawer, setDrawer] = useState({ player: "Player1", score: 0 });
  const [guesser, setGuesser] = useState({ player: "Player2", score: 0 });

  useEffect(() => {
    socket.on("session_over", () => {
      history.replace(`/`);
    });
    console.log("HERE", guesser);
  }, [socket, guesser]);

  const hadeleExitButton = async () => {
    await socket.emit("session_over");
    history.replace(`/`);
  };

  const handleScoreTableSession = async word => {
    let newScore;

    word.level === 1
      ? (newScore = 1)
      : word.level === 2
      ? (newScore = 3)
      : (newScore = 5);

    const updateGuesserScore = { ...guesser };
    updateGuesserScore.score += newScore;
    setGuesser(updateGuesserScore);
  };

  return (
    <React.Fragment>
      <Route
        path="/play-ground"
        render={props => (
          <TopBar
            socket={socket}
            onClickExit={hadeleExitButton}
            drawer={drawer}
            guesser={guesser}
            {...props}
          />
        )}
      />
      <Route
        path="/play-ground/drawing"
        render={props => <Drawing socket={socket} drawer={drawer} {...props} />}
      />
      <Route
        path="/play-ground/guessing"
        render={props => (
          <Gussing
            socket={socket}
            guesser={guesser}
            onRightGuessing={handleScoreTableSession}
            {...props}
          />
        )}
      />
    </React.Fragment>
  );
};
export default Playground;
