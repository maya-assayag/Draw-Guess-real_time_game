import React, { useEffect, useState } from "react";
import queryString from "query-string";

const WaitingPage = ({ location, socket, history }) => {
  const [player, setPlayer] = useState("");

  useEffect(() => {
    const { role } = queryString.parse(location.search);
    setPlayer(role);

    socket.on("player2_join_game", () => {
      history.replace(`/word-choosing`);
    });

    socket.on("player1_choosed_word", () => {
      history.replace(`/play-ground/guessing?role=Player2`);
    });
  }, [location.search, socket]);
  return player === "Player1" ? (
    <div>Please wait player 2 enter to play...</div>
  ) : (
    <div>Please wait player 1 will choose word to draw...</div>
  );
};

export default WaitingPage;
