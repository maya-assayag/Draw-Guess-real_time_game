import React, { useState, useEffect } from "react";

const Home = ({ socket, history }) => {
  const [player, setPlayer] = useState("Player1");
  const [session, setSession] = useState("");

  useEffect(() => {
    socket.on("waiting_to_player2", () => {
      setPlayer("Player2");
    });
  }, [socket]);

  const handleStartPlayButton = async () => {
    setPlayer("Player1");

    await socket.emit("player1_start_game", session);
    history.replace(`/waiting-page?role=${player}`);
  };
  const handleJoinGame = async () => {
    await socket.emit("player2_join_game");
    history.replace(`/waiting-page?role=${player}`);
  };
  const handleScoreTableButton = () => {
    history.replace(`/score-table`);
  };

  return (
    <div>
      <h1>welcome</h1>
      
      {player === "Player1" ? (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleStartPlayButton}
        >
          Start Game
        </button>
      ) : (
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleJoinGame}
        >
          Join Game
        </button>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        onClick={handleScoreTableButton}
      >
        Score Table
      </button>
    </div>
  );
};

export default Home;
