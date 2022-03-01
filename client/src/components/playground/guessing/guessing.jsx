import React, { useLayoutEffect, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import getStroke from "perfect-freehand";
import "../canvas.css";
import "./guessing.css";

const drawElement = (roughCanvas, context, element) => {
  if (element.hasOwnProperty("points")) {
    const myStroke = getStroke(element.points, { size: 7 });
    const pathData = getSvgPathFromStroke(myStroke);
    const myPath = new Path2D(pathData);
    context.fill(myPath);
  } else {
    roughCanvas.draw(element.roughElement);
  }
};

function getSvgPathFromStroke(stroke) {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}
const Gussing = ({ socket, history, onRightGuessing }) => {
  const [elements, setElements] = useState([]);
  const [guess, setGuess] = useState("");
  const [word, setWord] = useState("");
  const [IsCorrectGuess, setIsCorrectGuess] = useState("");

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
    elements.forEach(element => drawElement(roughCanvas, context, element));
  }, [elements]);

  const handleGuessButton = async () => {
    if (guess === word.value) {
      onRightGuessing(word);

      await socket.emit("round_over");

      history.replace(`/word-choosing`);
    } else {
      setIsCorrectGuess("Try Again!");
    }
  };

  return (
    <div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>

      <div>
        <div className="container">
          <div className="row">
            <div className="col">
              <input
                id="guess-input"
                type="text"
                placeholder="Guess..."
                className="guess"
                onChange={event => {
                  setGuess(event.target.value);
                  setIsCorrectGuess("");
                }}
              ></input>
              <button
                id="guess-btn"
                type="submit"
                className="btn btn-primary"
                disabled={!guess}
                onClick={handleGuessButton}
              >
                Guess
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <p className="text-danger">{IsCorrectGuess}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gussing;
