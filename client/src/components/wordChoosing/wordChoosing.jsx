import React, { Component } from "react";
import { generateWords } from "../../services/generateWords";
import "./wordChoosing.css";
import _ from "lodash";

class WordChoosing extends Component {
  state = {
    words: []
  };

  async componentDidMount() {
    const words = await generateWords();

    this.setState({ words });
  }

  handleDrawButton = async word => {
    await this.props.socket.emit("player1_choosed_word", word);

    this.props.history.replace(`/play-ground/drawing?role=Player1`);
  };

  renderLevelClassName = level => {
    return `card level-${level}`;
  };

  render() {
    const { words } = this.state;
    return (
      <React.Fragment>
        <section className="container">
          {words.map(word => (
            <div key={word.level} className="card">
              <h2 className="card-title">{word.value}</h2>
              <h6>Level: {word.level}</h6>
              <a
                href="#"
                className="btn btn-primary"
                onClick={() => this.handleDrawButton(word)}
              >
                Draw
              </a>
            </div>
          ))}
        </section>
      </React.Fragment>
    );
  }
}

export default WordChoosing;
