import React, { Component, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { getSession, saveSession } from "../services/sessionService";
import Gussing from "./guessing";
import Drawing from "./drawing";
import TopBar from "./topBar";

const Playground = ({ socket, history }) => {
  const [drawer, setDrawer] = useState({
    id: "",
    username: "",
    player: "Player1"
  });
  const [guesser, setGuesser] = useState({
    id: "",
    username: "",
    player: "Player2"
  });
  const [session, setSession] = useState({});

  useEffect(() => {
    socket.on("send_session_to_playground_view", async session => {
      const s = await getSession(session._id);
      if (s) {
        setSession(s);
      }
    });

    socket.on("session_over", () => {
      history.replace(`/`);
    });
  }, [socket]);

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

    const updateScore = { ...session };
    updateScore.score += newScore;
    setSession(updateScore);

    let sessionFromDB = await getSession(session._id);
    sessionFromDB.score = updateScore.score;
    await saveSession(sessionFromDB);
  };

  return (
    <React.Fragment>
      <Route
        path="/play-ground"
        render={props => (
          <TopBar
            socket={socket}
            onClickExit={hadeleExitButton}
            session={session}
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
