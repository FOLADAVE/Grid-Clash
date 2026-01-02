// src/components/Indicator.jsx
import React from "react";

export default function Indicator({ currentTurn, cpuThinking }) {
  const icon = currentTurn === "X" ? "../Assets/X.png" : "../Assets/O.png";
  return (
    <div className="turn card turn-card" aria-live="polite">
      <div className="turn-text">Turn</div>
      <div className={`turn-icon ${cpuThinking ? "thinking" : ""}`}>
        <img src={icon} alt="turn" />
      </div>
    </div>
  );
}
