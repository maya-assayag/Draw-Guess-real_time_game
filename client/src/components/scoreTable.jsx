import React, { useState, useEffect } from "react";

const ScoreTable = () => {
  return (
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Player 1</th>
          <th scope="col">Player 2</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Player 1 Score </td>
          <td>Player 2 Score </td>
        </tr>
      </tbody>
    </table>
  );
};
export default ScoreTable;
