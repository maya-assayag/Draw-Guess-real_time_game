import React, { Component } from "react";

class SessionScoreTable extends Component {
  state = {
    users: [
      {
        _id: "123",
        firstName: "Maya",
        lastName: "Assayag",
        score: 12,
        time: 12
      }
    ]
  };

  async componentDidMount() {
    // const screens = await getScreens();
    // this.setState({ screens });
  }

  handleOrderByScore = async () => {
    // await createScreen();
    // const screens = await getScreens();
    // this.setState({ screens });
  };

  render() {
    const { users } = this.state;

    return (
      <React.Fragment>
        {users.map(user => (
          <div className="container px-4 py-5" id="custom-cards">
            <h2 className="pb-2 border-bottom">Score Table</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">User Id</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Score</th>
                  <th scope="col">Time</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <th scope="row">{user._id}</th>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.score}</td>
                    <td>{user.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default SessionScoreTable;
