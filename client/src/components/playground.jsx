import React, { Component, useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { getUser, saveUser } from "../services/userService";
import Gussing from "./guessing";
import Drawing from "./drawing";
import TopBar from "./topBar";

const Playground = ({ socket, history }) => {
  const [drawer, setDrawer] = useState({
    id: "",
    username: "",
    player: "Player1",
    score: 0
  });
  const [guesser, setGuesser] = useState({
    id: "",
    username: "",
    player: "Player2",
    score: 0
  });
  const [session, setSession] = useState({});

  const buildPlayers = async session => {
    const tempDrawer = { ...drawer };
    const tempGuesser = { ...guesser };

    tempDrawer.id = session.participants[0];
    tempGuesser.id = session.participants[1];

    const drawerUser = await getUser(tempDrawer.id);
    const guesserUser = await getUser(tempGuesser.id);

    tempDrawer.score = drawerUser.sessions.find(
      s => s.session === session._id
    ).score;
    tempGuesser.score = guesserUser.sessions.find(
      s => s.session === session._id
    ).score;

    setDrawer(tempDrawer);
    setGuesser(tempGuesser);
    console.log("UPDATE SCORE STATES WITH DATA FROM DB");
  };

  useEffect(() => {
    console.log("PG Acure!");
    socket.on("send_session_to_playground_view", session => {
      console.log("PG Acure!", session);
      setSession(session);
      buildPlayers(session);
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

    const updateGuesserScore = { ...guesser };
    updateGuesserScore.score += newScore;

    const updateUser = await getUser(guesser.id);

    updateUser.sessions = updateUser.sessions.filter(
      session => session.session === session._id
    );

    updateUser.sessions = [
      { score: updateGuesserScore.score, session: session._id },
      ...updateUser.sessions
    ];

    await saveUser(updateUser);
    console.log("UPDATE SCORE USER ON DB");
  };

  return (
    <React.Fragment>
      {console.log(drawer, guesser)}
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
