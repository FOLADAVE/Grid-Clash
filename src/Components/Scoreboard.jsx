// src/components/Scoreboard.jsx
import React from "react";

export default function Scoreboard({ scores, winner }) {
  return (
    <div className="scoreboard">
      <div className={`score card ${winner === "x" ? "active" : ""}`}>
        <img src="../Assets/X.png" alt="X" />
        <div className="score-label">
          <div className="label">X</div>
          <div className="value glow-text">{scores.x}</div>
        </div>
      </div>

      <div className="turn card turn-card">
        <div className="turn-text">Turn</div>
        {/* Icon is shown in Indicator component; Scoreboard only displays scores */}
      </div>

      <div className={`score card ${winner === "o" ? "active" : ""}`}>
        <img src="../Assets/O.png" alt="O" />
        <div className="score-label">
          <div className="label">O</div>
          <div className="value glow-text">{scores.o}</div>
        </div>
      </div>
    </div>
  );
}
