import React, { useState } from 'react';
import './App.css';

const categories = {
  animals: ['🐶', '🐱', '🐵', '🐰'],
  food: ['🍕', '🍟', '🍔', '🍩'],
  sports: ['⚽️', '🏀', '🏈', '🎾'],
};

const initialBoard = Array(9).fill(null);

function App() {
  const [player1Cat, setPlayer1Cat] = useState('animals');
  const [player2Cat, setPlayer2Cat] = useState('food');
  const [started, setStarted] = useState(false);

  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState(0);
  const [moves, setMoves] = useState({ 1: [], 2: [] });
  const [winner, setWinner] = useState(null);

  const getCurrentPlayer = () => (turn % 2 === 0 ? 1 : 2);
  const getEmoji = () => {
    const cat = getCurrentPlayer() === 1 ? player1Cat : player2Cat;
    const list = categories[cat];
    return list[Math.floor(Math.random() * list.length)];
  };

  const checkWinner = (newBoard, player) => {
    const b = newBoard.map((cell) => (cell && cell.player === player ? 1 : 0));
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of wins) {
      if (line.every((i) => b[i])) {
        return true;
      }
    }
    return false;
  };

  const handleMove = (i) => {
    if (winner || board[i]) return;

    const current = getCurrentPlayer();
    const playerMoves = moves[current];
    const emoji = getEmoji();
    let newBoard = [...board];
    let newMoves = [...playerMoves];

    if (playerMoves.length === 3) {
      const [oldestIndex] = playerMoves;
      if (oldestIndex === i) return; // can't overwrite oldest
      newBoard[oldestIndex] = null;
      newBoard[i] = { emoji, player: current };
      newMoves = [...playerMoves.slice(1), i];
    } else {
      newBoard[i] = { emoji, player: current };
      newMoves = [...playerMoves, i];
    }

    if (checkWinner(newBoard, current)) {
      setBoard(newBoard);
      setMoves({ ...moves, [current]: newMoves });
      setWinner(current);
      return; // stop game after win
    }

    setBoard(newBoard);
    setMoves({ ...moves, [current]: newMoves });
    setTurn((t) => t + 1);
  };

  const resetGame = () => {
    setBoard(initialBoard);
    setTurn(0);
    setMoves({ 1: [], 2: [] });
    setWinner(null);
    setStarted(false);
  };

  return (
    <div className="app">
      <h1>Blink Tac Toe 🎲</h1>

      {!started ? (
        <>
          <div className="selectors">
            <div>
              <h3>Player 1 Emoji</h3>
              <select
                value={player1Cat}
                onChange={(e) => setPlayer1Cat(e.target.value)}
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3>Player 2 Emoji</h3>
              <select
                value={player2Cat}
                onChange={(e) => setPlayer2Cat(e.target.value)}
              >
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={() => setStarted(true)}>Start Game</button>
          </div>

          <div className="help">
            <h3>How to Play:</h3>
            <ul>
              <li>Choose emoji categories</li>
              <li>Take turns to place emojis</li>
              <li>Max 3 emojis per player on board</li>
              <li>Oldest emoji disappears on 4th placement</li>
              <li>Form 3-in-a-row to win!</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          <h2>{winner ? `Player ${winner} Wins! 🎉` : `Player ${getCurrentPlayer()}'s Turn`}</h2>

          <div className="grid">
            {board.map((cell, i) => (
              <div key={i} className="cell" onClick={() => handleMove(i)}>
                {cell ? cell.emoji : ''}
              </div>
            ))}
          </div>

          {winner && <button onClick={resetGame}>Play Again</button>}
        </>
      )}
    </div>
  );
}

export default App;
