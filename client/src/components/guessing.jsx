import React, { useLayoutEffect, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";

const Gussing = ({ socket, history }) => {
  const [elements, setElements] = useState([]);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState("");
  const [word, setWord] = useState("");

  useEffect(() => {
    socket.on("send_word_to_gussing_view", word => {
      setWord(word);
    });

    socket.on("recive_canvas_elements", elements => {
      console.log("RESIVE ELEMENT", elements);
      setElements(elements);
    });
  }, [socket]);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const handleGuessButton = async () => {
    if (guess === word.value) {
      let newScore;
      word.level === 1
        ? (newScore = 1)
        : word.level === 2
        ? (newScore = 3)
        : (newScore = 5);

      const updateScore = score + newScore;
      setScore(updateScore);

      await socket.emit("session_over");

      history.replace(`/word-choosing`);
    }
    console.log("Try again");
  };

  return (
    <div>
      <canvas
        id="canvas"
        style={{ backgroundColor: "blue" }}
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      <div>
        <input
          type="text"
          placeholder="Guess..."
          className="guess"
          onChange={event => {
            setGuess(event.target.value);
          }}
        ></input>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!guess}
          onClick={handleGuessButton}
        >
          Guess
        </button>
      </div>
    </div>
  );
};

export default Gussing;
