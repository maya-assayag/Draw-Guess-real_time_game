import React, { useLayoutEffect, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm";
import queryString from "query-string";
import getStroke from "perfect-freehand";
import "./canvas.css";

const generator = rough.generator();

function createElement(x1, y1, x2, y2, elementType) {
  if (elementType === "pencil") {
    return { points: [{ x: x1, y: y1 }] };
  } else {
    const roughElement =
      elementType === "line"
        ? generator.line(x1, y1, x2, y2)
        : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
    return { x1, y1, x2, y2, roughElement };
  }
}

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
const drawElement = (roughCanvas, context, element) => {
  if (element.hasOwnProperty("points")) {
    const myStroke = getStroke(element.points, { size: 7 });
    const pathData = getSvgPathFromStroke(myStroke);
    const myPath = new Path2D(pathData);
    context.fill(myPath);
  } else {
    console.log("ELEMENT", element);
    roughCanvas.draw(element.roughElement);
  }
};

const Drawing = ({ location, socket, history }) => {
  const [elements, setElements] = useState([]);
  const [isDrawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState("pencil");
  const [player, setPlayer] = useState("Player1");
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
    elements.forEach(element => drawElement(roughCanvas, context, element));
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
    const elementsCopy = [...elements];

    if (elements[index].hasOwnProperty("points")) {
      elementsCopy[index].points = [
        ...elementsCopy[index].points,
        { x: clientX, y: clientY }
      ];
    } else {
      const { x1, y1 } = elements[index];

      const updateElement = createElement(
        x1,
        y1,
        clientX,
        clientY,
        elementType
      );

      elementsCopy[index] = updateElement;
    }
    setElements(elementsCopy);
  };

  // const handleSendButton = () => {
  //   // const canvas = document.getElementById("canvas");
  //   // const dataURI = canvas.toDataURL();
  //   // console.log(dataURI);
  // };

  // const handleGuessButton = () => {
  //   guess === word ? console.log("score!") : console.log("Try again");
  // };

  return (
    <div className="container">
      <div id="tool_bar" className="radio">
        <input
          type="radio"
          name="myRadio"
          id="pencil"
          value="pencil"
          className="radio__input"
          checked={elementType === "pencil"}
          onChange={() => setElementType("pencil")}
        />
        <label className="radio__input" htmlFor="pencil">
          Pencil
        </label>

        <input
          type="radio"
          name="myRadio"
          id="line"
          value="line"
          className="radio__input"
          checked={elementType === "line"}
          onChange={() => setElementType("line")}
        />
        <label className="radio__input" htmlFor="line">
          Line
        </label>

        <input
          type="radio"
          name="myRadio"
          id="rectangle"
          value="rectangle"
          className="radio__input"
          checked={elementType === "rectangle"}
          onChange={() => setElementType("rectangle")}
        />
        <label className="radio__input" htmlFor="rectangle">
          Rectangle
        </label>
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

      {/* <div className="row">
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
      </div> */}
    </div>
  );
};

export default Drawing;
