import React, { useState, useEffect } from "react";

function calculateWinner(squares) {
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
      return squares[a];
    }
  }
  return null;
}

function Square({ value, onSquareClick, isWinnerSquare }) {
  const squareStyle = `
        w-20 h-20 sm:w-24 sm:h-24 
        bg-[#1a1a1a] 
        border-2 border-[#4a4a4a] 
        flex items-center justify-center 
        cursor-pointer 
        transition-colors duration-200 
        hover:bg-[#2a2a2a]
        ${isWinnerSquare ? "bg-green-700" : ""}
    `;
  const textStyle = `
        font-press-start 
        text-4xl sm:text-5xl
        ${value === "X" ? "text-blue-400" : "text-yellow-400"}
        ${isWinnerSquare ? "!text-white" : ""}
    `;
  return (
    <button className={squareStyle} onClick={onSquareClick}>
      <span className={textStyle}>{value}</span>
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(Boolean);
  let status;
  if (winner) {
    status = "WINNER: " + winner;
  } else if (isDraw) {
    status = "IT'S A DRAW!";
  } else {
    status = "NEXT PLAYER: " + (xIsNext ? "X" : "O");
  }

  const getWinnerLine = () => {
    if (!winner) return [];
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
    return (
      lines.find(
        ([a, b, c]) =>
          squares[a] === winner &&
          squares[b] === winner &&
          squares[c] === winner
      ) || []
    );
  };

  const winnerLine = getWinnerLine();

  return (
    <div>
      <div className="status text-center font-press-start text-lg sm:text-xl text-white mb-6 tracking-wider">
        {status}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {squares.map((square, i) => (
          <Square
            key={i}
            value={squares[i]}
            onSquareClick={() => handleClick(i)}
            isWinnerSquare={winnerLine.includes(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const initialColors = ["text-blue-400", "text-yellow-400", "text-green-400"];
  const [titleColors, setTitleColors] = useState(initialColors);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleColors((prevColors) => {
        const newColors = [...prevColors];
        const lastColor = newColors.pop();
        newColors.unshift(lastColor);
        return newColors;
      });
    }, 1000);

    // Cleanup function to stop the interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const description = move > 0 ? `GO TO MOVE #${move}` : "GO TO GAME START";
    return (
      <li key={move} className="mb-2">
        <button
          onClick={() => jumpTo(move)}
          className={`w-full font-press-start text-xs py-2 px-3 transition-colors duration-200 border-2 border-[#4a4a4a] ${
            currentMove === move
              ? "bg-green-500 text-black"
              : "bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]"
          }`}
        >
          {description}
        </button>
      </li>
    );
  });

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <style>{`
            .font-press-start { font-family: 'Press Start 2P', cursive; }
        `}</style>
      <div className="bg-[#0d0d0d] p-6 sm:p-8 border-4 border-[#4a4a4a] rounded-lg shadow-[8px_8px_0px_#4a4a4a]">
        <h1 className="font-press-start text-3xl sm:text-4xl text-center text-white mb-8">
          <span className={titleColors[0]}>TIC</span>-
          <span className={titleColors[1]}>TAC</span>-
          <span className={titleColors[2]}>TOE</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
          <div className="game-board">
            <Board
              xIsNext={xIsNext}
              squares={currentSquares}
              onPlay={handlePlay}
            />
          </div>
          <div className="game-info w-full md:w-60">
            <h2 className="font-press-start text-lg text-white mb-4">MOVES:</h2>
            <ol className="mb-6 max-h-52 overflow-y-auto pr-2">{moves}</ol>
            <button
              onClick={resetGame}
              className="w-full font-press-start text-base py-3 px-4 bg-red-600 text-white border-2 border-red-800 hover:bg-red-700 transition-colors duration-200"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
