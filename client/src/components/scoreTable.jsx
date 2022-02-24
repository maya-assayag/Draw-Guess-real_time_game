import React, { useState, useEffect } from "react";

const ScoreTable = ({ drawer, guesser }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Player 1</th>
          <th scope="col">Player 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{drawer.score} </td>
          <td>{guesser.score} </td>
        </tr>
      </tbody>
    </table>
  );
};
export default ScoreTable;
