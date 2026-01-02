// src/components/GameBoard.jsx
import React from "react";

export default function GameBoard({ board, onCellClick }) {
  return (
    <section className="board-wrap">
      <div className="board">
        {[0,1,2].map(r => (
          <div className="row" key={r}>
            {[0,1,2].map(c => {
              const i = r*3 + c;
              return (
                <div
                  key={i}
                  className="boxes"
                  role="button"
                  tabIndex={0}
                  onClick={() => onCellClick(i)}
                  onKeyPress={(e) => { if (e.key === "Enter") onCellClick(i); }}
                  aria-label={`cell ${i}`}
                >
                  {board[i] && <img src={ board[i] === "x" ? "../Assets/X.png" : "../Assets/O.png" } alt={board[i]} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
