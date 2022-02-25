import React, { useState, useEffect } from "react";

const ScoreTable = ({ drawer, guesser }) => {
  useEffect(() => {
    console.log("ST acure!!");
    console.log("ST", drawer);
    console.log("ST", guesser);
  }, []);

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Player 1: {drawer.username}</th>
          <th scope="col">Player 2: {guesser.username}</th>
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
