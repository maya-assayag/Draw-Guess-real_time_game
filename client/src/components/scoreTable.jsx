import React, { useEffect } from "react";

const ScoreTable = ({ session }) => {
  useEffect(() => {}, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">SCORE</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{session.score} </td>
        </tr>
      </tbody>
    </table>
  );
};
export default ScoreTable;
