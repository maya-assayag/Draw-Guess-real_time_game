import React, { useLayoutEffect, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import queryString from "query-string";
import "./canvas.css";

const generator = rough.generator();

function createElement(x1, y1, x2, y2, elementType) {
  const roughElement =
    elementType === "line"
      ? generator.line(x1, y1, x2, y2)
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { x1, y1, x2, y2, roughElement };
}

const Drawing = ({ location, socket, history }) => {
  const [elements, setElements] = useState([]);
  const [isDrawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState("line");
  const [player, setPlayer] = useState("Player1");
  const [guess, setGuess] = useState("");
  const [word, setWord] = useState("");

  useEffect(() => {
    const { role } = queryString.parse(location.search);
    const { word } = queryString.parse(location.search);

    setPlayer(role);
    setWord(word);

    socket.on("round_over", () => {
      history.replace(`/waiting-page?role=${player}`);
    });
  }, []);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const handlestartDrawing = async ({ clientX, clientY }) => {
    setDrawing(true);

    const element = createElement(
      clientX,
      clientY,
      clientX,
      clientY,
      elementType
    );
    setElements(prevState => [...prevState, element]);
    await socket.emit("send_canvas_elements", elements);
  };

  const handlefinishDrawing = ({ e }) => {
    setDrawing(false);
  };

  const handleDrawing = ({ clientX, clientY }) => {
    if (!isDrawing) return;

    const index = elements.length - 1;
    const { x1, y1 } = elements[index];

    const updateElement = createElement(x1, y1, clientX, clientY, elementType);

    const elementsCopy = [...elements];
    elementsCopy[index] = updateElement;
    setElements(elementsCopy);
  };

  // const handleSendButton = () => {
  //   // const canvas = document.getElementById("canvas");
  //   // const dataURI = canvas.toDataURL();
  //   // console.log(dataURI);
  // };

  const handleGuessButton = () => {
    guess === word ? console.log("score!") : console.log("Try again");
  };

  return (
    <div className="container">
      <div className="row toolbar" style={{ position: "fixed" }}>
        <input
          type="radio"
          id="line"
          checked={elementType === "line"}
          onChange={() => setElementType("line")}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={elementType === "rectangle"}
          onChange={() => setElementType("rectangle")}
        />
        <label htmlFor="rectangle">Rectangle</label>
      </div>
      <div className="row">
        <canvas
          id="canvas"
          width={window.innerWidth}
          height={window.innerHeight}
          onMouseDown={handlestartDrawing}
          onMouseUp={handlefinishDrawing}
          onMouseMove={handleDrawing}
        ></canvas>
      </div>
      <div className="row">
        {player === "Player1" ? null : (
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
        )}
      </div>
    </div>
  );
};

export default Drawing;
