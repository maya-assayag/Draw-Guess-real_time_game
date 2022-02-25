import React, { useEffect, useState } from "react";
import queryString from "query-string";
import "./waitingPage.css";

const WaitingPage = ({ location, socket, history }) => {
  const [player, setPlayer] = useState("");

  useEffect(() => {
    const { role } = queryString.parse(location.search);
    setPlayer(role);

    socket.on("player2_join_game", async () => {
      history.replace(`/word-choosing`);
    });

    socket.on("player1_choosed_word", () => {
      history.replace(`/play-ground/guessing?role=Player2`);
    });
  }, [location.search, socket]);

  return (
    <React.Fragment>
      {player === "Player1" ? (
        <div className="waiting-message">
          Please wait, for player 2 to enter...
        </div>
      ) : (
        <div className="waiting-message">
          Please wait, player 1 will choose a word to draw...
        </div>
      )}
      <div class="lds-hourglass"></div>
    </React.Fragment>
  );
};

export default WaitingPage;
