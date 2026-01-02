// src/components/WinnerModal.jsx
import React from "react";

export default function WinnerModal({ winner, onPlayAgain, onMenu }) {
  if (!winner) return null;

  const isDraw = winner === "draw";
  const icon = isDraw ? "../Assets/draw.png" : "../Assets/winner_trophy.jpg";
  return (
    <div className="winner-modal" role="dialog" aria-modal="true">
      <div className="modal-overlay" onClick={onPlayAgain} />
      <div className="modal-card">
        <div className="modal-art">
          <img src={icon} alt={isDraw ? "Draw" : "Winner"} className="modal-main-img" />
        </div>
        {!isDraw && (
          <div className="modal-winner-icon">
            <img src={ winner === "x" ? "../Assets/X.png" : "../Assets/O.png" } alt="winner" />
          </div>
        )}

        <h3 className="modal-title">
          {isDraw ? "It's a Draw" : (winner === "x" ? "Player X Wins" : "Player O Wins")}
        </h3>

        <div className="modal-actions">
          <button className="play-again" onClick={onPlayAgain}>Play Again</button>
          <button className="to-menu" onClick={onMenu}>Main Menu</button>
        </div>

        <img src="../Assets/confetti.png" alt="" className="modal-confetti" aria-hidden />
      </div>
    </div>
  );
}
