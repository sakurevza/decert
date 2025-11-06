// pages/index.js
import React, { useState } from 'react';
import Board from '../components/Board';
// import "@/styles/globals.css";

function Game() {
  // Game State
  const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  // Helper function to calculate winner
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]; // Return winner ('X' or 'O')
      }
    }
    return null; // No winner
  };

  const currentSquares = history[stepNumber].squares;
  const winner = calculateWinner(currentSquares);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  // Handler for square clicks
  const handleClick = (i) => {
    const historyCopy = history.slice(0, stepNumber + 1); // Get only the past moves up to the current step
    const current = historyCopy[historyCopy.length - 1];
    const squares = [...current.squares]; // Create a mutable copy of the squares

    // Ignore click if someone has won or if the square is already filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O'; // Update the clicked square

    setHistory(historyCopy.concat([{ squares: squares }])); // Add new state to history
    setStepNumber(historyCopy.length); // Update step number to the new state
    setXIsNext(!xIsNext); // Switch player
  };

  // Handler to jump to a specific move
  const jumpTo = (step) => {
    setStepNumber(step);
    setXIsNext(step % 2 === 0); // Reset player based on step number
  };

  const moves = history.map((step, move) => {
    const desc = move ? `Go to move #${move}` : 'Go to game start';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentSquares}
          onClick={handleClick} // Pass down the handler to Board
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

export default Game;