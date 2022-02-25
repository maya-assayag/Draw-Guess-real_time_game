import React, { useState, useEffect } from "react";
import { saveUser } from "../../services/userService";
import { saveSession } from "../../services/sessionService";
import { createUserObject, addSessionToUsers } from "../../utilis/user";
import mongoose from "mongoose";
import { createSessionObject } from "../../utilis/session";
import "./home.css";

const Home = ({ socket, history }) => {
  const [player, setPlayer] = useState("Player1");
  const [username, setUsername] = useState("");
  const [session, setSession] = useState({});

  useEffect(() => {
    socket.on("waiting_to_player2", sessionData => {
      setSession(sessionData);
      setPlayer("Player2");
    });
  }, [socket]);

  const handleStartPlayButton = async () => {
    setPlayer("Player1");

    let user = createUserObject(username);

    user = await saveUser(user);

    let tempSession = createSessionObject(user._id);

    tempSession = await saveSession(tempSession);

    setSession(tempSession);

    await socket.emit("player1_start_game", tempSession);
    history.replace(`/waiting-page?role=${player}`);
  };

  const handleJoinGame = async () => {
    let user = createUserObject(username);

    user = await saveUser(user);

    let tempSession = { ...session };

    tempSession.participants = [
      ...session.participants,
      mongoose.Types.ObjectId(user._id)
    ];

    tempSession = await saveSession(tempSession);
    tempSession = tempSession.data;

    setSession(tempSession);

    await addSessionToUsers(0, tempSession);

    await socket.emit("player2_join_game", tempSession);
    history.replace(`/waiting-page?role=${player}`);
  };

  const handleSessionScoreTableButton = () => {
    history.replace(`/score-table`);
  };

  return (
    <div className="text-center">
      <h1 className="welcome-title">welcome</h1>
      <input
        type="text"
        placeholder="Username..."
        className="username"
        onChange={event => {
          setUsername(event.target.value);
        }}
      ></input>
      <div>
        {player === "Player1" ? (
          <button
            type="submit"
            className="btn btn-primary row"
            onClick={handleStartPlayButton}
            disabled={!username}
          >
            Start Game
          </button>
        ) : (
          <button
            type="submit"
            className="btn btn-primary row"
            onClick={handleJoinGame}
            disabled={!username}
          >
            Join Game
          </button>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary row"
        onClick={handleSessionScoreTableButton}
      >
        Score Table
      </button>
    </div>
  );
};

export default Home;
