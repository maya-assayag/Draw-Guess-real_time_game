import React, { useLayoutEffect, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import "./canvas.css";

const Gussing = ({ socket, history, onRightGuessing }) => {
  const [elements, setElements] = useState([]);
  const [guess, setGuess] = useState("");
  const [word, setWord] = useState("");

  useEffect(() => {
    socket.on("send_word_to_gussing_view", word => {
      setWord(word);
    });

    socket.on("recive_canvas_elements", elements => {
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
      onRightGuessing(word);

      await socket.emit("round_over");

      history.replace(`/word-choosing`);
    } else {
      console.log("Try again");
    }
  };

  return (
    <div>
      <canvas
        id="canvas"
        min-width={window.innerWidth}
        min-height={window.innerHeight}
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
