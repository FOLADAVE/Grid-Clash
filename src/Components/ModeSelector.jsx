// src/components/ModeSelector.jsx
import React from "react";

export default function ModeSelector({ onChooseMode, cpuMode, setCpuMode, cpuDifficulty }) {
  // cpuMode: "" | "cpu" (if selected)
  return (
    <section className="mode-select centered-card">
      <div className="mode-intro">
        <h2 className="mode-title">Choose Game Mode</h2>
        <p className="subtitle">Challenge your mind. Beat your friend or the AI!</p>
      </div>

      <div className="mode-cards">
        <button
          className="mode-card"
          onClick={() => onChooseMode("pvp")}
          aria-label="Player vs Player"
        >
          <div className="mode-card-media">
            <img src="../Assets/players.png" alt="players" />
          </div>
          <div className="mode-card-body">
            <h3>Player vs Player</h3>
            <p className="muted">Play locally with a friend</p>
          </div>
        </button>

        <button
          className="mode-card"
          onClick={() => onChooseMode("cpu")}
          aria-label="Play vs Computer"
        >
          <div className="mode-card-media">
            <img src="../Assets/robot.png" alt="computer" />
          </div>
          <div className="mode-card-body">
            <h3>Play vs Computer</h3>
            <p className="muted">Try a quick match against the CPU</p>
          </div>
        </button>
      </div>
    </section>
  );
}
