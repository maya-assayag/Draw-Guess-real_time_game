import React, { useState, useEffect } from "react";
import { saveUser } from "../services/userService";
import { saveSession } from "../services/sessionService";
import mongoose from "mongoose";

const Home = ({ socket, history }) => {
  const [player, setPlayer] = useState("Player1");
  const [username, setUsername] = useState("");
  const [session, setSession] = useState({});

  useEffect(() => {
    socket.on("waiting_to_player2", sessionData => {
      console.log("DATA", sessionData);
      setSession(sessionData);
      setPlayer("Player2");
    });
  }, [socket]);

  const handleStartPlayButton = async () => {
    setPlayer("Player1");

    let user = {
      firstName: "",
      lastName: "",
      username,
      sessions: []
    };

    user = await saveUser(user);

    let tempSession = {
      name: "",
      roundes: 0,
      participants: [mongoose.Types.ObjectId(user._id)]
    };

    tempSession = await saveSession(tempSession);
    console.log(1, tempSession);

    setSession(tempSession);
    console.log(2, session);

    await socket.emit("player1_start_game", tempSession);
    history.replace(`/waiting-page?role=${player}`);
  };

  const handleJoinGame = async () => {
    let user = {
      firstName: "",
      lastName: "",
      username,
      sessions: []
    };

    user = await saveUser(user);

    let tempSession = { ...session };
    console.log(session, tempSession);
    tempSession.participants = [
      mongoose.Types.ObjectId(user._id),
      ...session.participants
    ];

    tempSession = saveSession(tempSession);

    setSession(tempSession);

    await socket.emit("player2_join_game");
    history.replace(`/waiting-page?role=${player}`);
  };

  const handleSessionScoreTableButton = () => {
    history.replace(`/score-table`);
  };

  return (
    <div>
      <h1>welcome</h1>
      <input
        type="text"
        placeholder="Username..."
        className="username"
        onChange={event => {
          setUsername(event.target.value);
        }}
      ></input>
      {player === "Player1" ? (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleStartPlayButton}
          disabled={!username}
        >
          Start Game
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleJoinGame}
          disabled={!username}
        >
          Join Game
        </button>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        onClick={handleSessionScoreTableButton}
      >
        Score Table
      </button>
    </div>
  );
};

export default Home;
