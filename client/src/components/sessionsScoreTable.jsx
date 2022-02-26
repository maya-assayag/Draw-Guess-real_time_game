import React, { Component } from "react";
import { getSessions } from "../services/sessionService";
import { getUser } from "../services/userService";

class SessionsScoreTable extends Component {
  state = {
    sessions: []
  };

  async componentDidMount() {
    const sessions = await getSessions();
    for (const index in sessions) {
      let newParticipantsArr = [];
      for (const player of sessions[index].participants) {
        if (player) {
          newParticipantsArr = [
            ...newParticipantsArr,
            await this.handlerPlayerName(player)
          ];
        }
      }
      sessions[index].participants = newParticipantsArr;
    }

    sessions.sort((s1, s2) => s2.score - s1.score);

    this.setState({ sessions });
  }

  handlerPlayerName = async userId => {
    if (userId) {
      const user = await getUser(userId);
      return user.username;
    } else {
      return "";
    }
  };

  render() {
    const { sessions } = this.state;

    return (
      <React.Fragment>
        <div className="container px-4 py-5" id="custom-cards">
          <h2 className="pb-2 border-bottom">Sessions Score Table</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Player 1</th>
                <th scope="col">Player 2</th>
                <th scope="col">Score</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session._id}>
                  <td>{session.participants[0]}</td>
                  <td>{session.participants[1]}</td>
                  <td>{session.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default SessionsScoreTable;
