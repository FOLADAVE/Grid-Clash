import React, { useState, useEffect, useRef } from "react";
import "./TicTacToe.css";

import ModeSelector from "./Components/ModeSelector";
import DifficultySelector from "./Components/DifficultySelector";
import Scoreboard from "./Components/Scoreboard";
import Indicator from "./Components/Indicator";
import GameBoard from "./Components/GameBoard";
import WinnerModal from "./Components/WinnerModal";

import { getMove } from "./utils/cpuLogic";

// sound imports
import moveSnd from "./assets/move.mp3";
import winSnd from "./assets/win.mp3";
import drawSnd from "./assets/draw.mp3";


const initialBoard = ["","","","","","","","",""];

export default function TicTacToe() {
  const [board, setBoard] = useState([...initialBoard]);
  const [mode, setMode] = useState(""); // "" | "pvp" | "cpu"
  const [difficulty, setDifficulty] = useState("hard"); // default hard
  const [currentTurn, setCurrentTurn] = useState("X"); // X always starts
  const [winner, setWinner] = useState(""); // "", "x", "o", "draw"
  const [scores, setScores] = useState({ x:0, o:0 });
  const [cpuThinking, setCpuThinking] = useState(false);

  // audio refs
  const moveAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const drawAudioRef = useRef(null);

  useEffect(() => {
    moveAudioRef.current = new Audio(moveSnd);
    winAudioRef.current = new Audio(winSnd);
    drawAudioRef.current = new Audio(drawSnd);
    moveAudioRef.current.volume = 0.18;
    winAudioRef.current.volume = 0.35;
    drawAudioRef.current.volume = 0.25;
  }, []);

  useEffect(() => {
    // if CPU mode and it's O's turn, let CPU play after small delay
    if (mode === "cpu" && currentTurn === "O" && !winner) {
      setCpuThinking(true);
      const t = setTimeout(() => {
        const idx = getMove(difficulty, board);
        if (idx !== -1) {
          makeMove(idx, "o");
        }
        setCpuThinking(false);
      }, 420);
      return () => clearTimeout(t);
    }
  }, [mode, currentTurn, winner, difficulty, board]);

  // helper to play sounds safely
  const safePlay = (ref) => {
    try {
      if (!ref || !ref.current) return;
      ref.current.currentTime = 0;
      ref.current.play();
    } catch (e) {}
  };

  // checks for winner or draw
  const checkForResult = (nextBoard) => {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let p of winPatterns) {
      const [a,b,c] = p;
      if (nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[b] === nextBoard[c]) {
        return nextBoard[a]; // 'x' or 'o'
      }
    }
    if (!nextBoard.includes("")) return "draw";
    return "";
  };

  const makeMove = (index, symbol) => {
    if (winner || board[index]) return;
    const next = [...board];
    next[index] = symbol === "x" ? "x" : "o";
    setBoard(next);
    safePlay(moveAudioRef);

    const res = checkForResult(next);
    if (res) {
      setWinner(res);
      if (res === "draw") {
        safePlay(drawAudioRef);
      } else {
        safePlay(winAudioRef);
        setScores(prev => ({ ...prev, [res]: prev[res] + 1 }));
      }
      return;
    }

    setCurrentTurn(prev => (prev === "X" ? "O" : "X"));
  };

  const onCellClick = (i) => {
    if (winner) return;
    // If cpu mode and it's CPU's turn, ignore clicks
    if (mode === "cpu" && currentTurn === "O") return;
    // player X or O
    const sym = currentTurn === "X" ? "x" : "o";
    makeMove(i, sym);
  };

  const handleChooseMode = (m) => {
    setMode(m);
    resetBoard();
    setScores({ x:0, o:0});
    if (m === "cpu") setDifficulty("hard");
  };

  const resetBoard = () => {
    setBoard([...initialBoard]);
    setWinner("");
    setCurrentTurn("X");
    setCpuThinking(false);
  };

  const handlePlayAgain = () => {
    resetBoard();
  };

  const handleBackToMenu = () => {
    resetBoard();
    setMode("");
  };

  return (
    <div className="container page-enter">
      <header className="topbar">
        <h1 className="title">Grid Clash</h1>
      </header>

      {!mode && (
        <>
          <ModeSelector onChooseMode={handleChooseMode} />
        </>
      )}

      {mode === "cpu" && (
        <div style={{ marginTop: 10 }}>
          <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
        </div>
      )}

      {mode && (
        <>
          <div style={{ width: "100%", maxWidth: 980 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 12px" }}>
              <div className={`score card ${winner === "x" ? "active" : ""}`}>
                <img src="./Assets/X.png" alt="X" />
                <div className="score-label">
                  <div className="label">X</div>
                  <div className="value glow-text">{scores.x}</div>
                </div>
              </div>

              {/* Indicator (turn icon pulses while cpuThinking) */}
              <div className={`turn card turn-card`}>
                <div className="turn-text">Turn</div>
                <div className={`turn-icon ${cpuThinking ? "thinking" : ""}`}>
                  <img src={ currentTurn === "X" ? "../Assets/X.png" : "../Assets/O.png" } alt="turn" />
                </div>
              </div>

              <div className={`score card ${winner === "o" ? "active" : ""}`}>
                <img src="./Assets/O.png" alt="O" />
                <div className="score-label">
                  <div className="label">O</div>
                  <div className="value glow-text">{scores.o}</div>
                </div>
              </div>
            </div>
          </div>

          <GameBoard board={board} onCellClick={onCellClick} />

          <div className="controls" style={{ marginTop: 6 }}>
            <button className="reset glow-btn" onClick={resetBoard}>Reset</button>
            <button className="back glow-btn" onClick={handleBackToMenu}>Menu</button>
          </div>
        </>
      )}

      <WinnerModal winner={winner} onPlayAgain={handlePlayAgain} onMenu={handleBackToMenu} />
    </div>
  );
}
