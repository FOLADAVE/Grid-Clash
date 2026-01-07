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
  const [difficulty, setDifficulty] = useState("hard");
  
  // ✨ FIX 1: Added player symbol choice
  const [playerSymbol, setPlayerSymbol] = useState("x"); // player's chosen symbol
  const [showSymbolPicker, setShowSymbolPicker] = useState(false); // show picker before game starts
  
  const [currentTurn, setCurrentTurn] = useState("X");
  
  // ✨ FIX 2: Track who should start next round
  const [startingPlayer, setStartingPlayer] = useState("player"); // "player" or "cpu"
  
  const [winner, setWinner] = useState("");
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

  // ✨ FIX 1 & 2: CPU logic updated to use playerSymbol
  useEffect(() => {
    if (mode === "cpu" && !winner) {
      const cpuSymbol = playerSymbol === "x" ? "o" : "x";
      const cpuTurn = cpuSymbol.toUpperCase();
      
      if (currentTurn === cpuTurn) {
        setCpuThinking(true);
        const t = setTimeout(() => {
          const idx = getMove(difficulty, board);
          if (idx !== -1) {
            makeMove(idx, cpuSymbol);
          }
          setCpuThinking(false);
        }, 420);
        return () => clearTimeout(t);
      }
    }
  }, [mode, currentTurn, winner, difficulty, board, playerSymbol]);

  const safePlay = (ref) => {
    try {
      if (!ref || !ref.current) return;
      ref.current.currentTime = 0;
      ref.current.play();
    } catch (e) {}
  };

  const checkForResult = (nextBoard) => {
    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let p of winPatterns) {
      const [a,b,c] = p;
      if (nextBoard[a] && nextBoard[a] === nextBoard[b] && nextBoard[b] === nextBoard[c]) {
        return nextBoard[a];
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
        
        // ✨ FIX 2: Set who starts next based on winner
        if (mode === "cpu") {
          if (res === playerSymbol) {
            setStartingPlayer("player");
          } else {
            setStartingPlayer("cpu");
          }
        }
      }
      return;
    }

    setCurrentTurn(prev => (prev === "X" ? "O" : "X"));
  };

  const onCellClick = (i) => {
    if (winner) return;
    
    // ✨ FIX 1: Check if it's player's turn based on their symbol
    const playerTurn = playerSymbol.toUpperCase();
    
    if (mode === "cpu") {
      if (currentTurn !== playerTurn) return; // Not player's turn
    }
    
    const sym = currentTurn === "X" ? "x" : "o";
    makeMove(i, sym);
  };

  // ✨ FIX 3: Enhanced mode selection with visual feedback
  const handleChooseMode = (m) => {
    if (m === "cpu") {
      // Show symbol picker before starting CPU mode
      setShowSymbolPicker(true);
    } else {
      // PvP mode - start immediately
      setMode(m);
      resetBoard();
      setScores({ x:0, o:0});
    }
  };

  // ✨ FIX 1: Handle symbol choice
  const handleSymbolChoice = (symbol) => {
    setPlayerSymbol(symbol);
    setShowSymbolPicker(false);
    setMode("cpu");
    
    // ✨ FIX 2: If player chose O, CPU (X) starts first
    if (symbol === "o") {
      setStartingPlayer("cpu");
      setCurrentTurn("X");
    } else {
      setStartingPlayer("player");
      setCurrentTurn("X");
    }
    
    resetBoard();
    setScores({ x:0, o:0});
    setDifficulty("hard");
  };

  const resetBoard = () => {
    setBoard([...initialBoard]);
    setWinner("");
    
    // ✨ FIX 2: Set turn based on who should start
    if (mode === "cpu") {
      if (startingPlayer === "player") {
        setCurrentTurn(playerSymbol.toUpperCase());
      } else {
        const cpuSymbol = playerSymbol === "x" ? "o" : "x";
        setCurrentTurn(cpuSymbol.toUpperCase());
      }
    } else {
      setCurrentTurn("X");
    }
    
    setCpuThinking(false);
  };

  const handlePlayAgain = () => {
    resetBoard();
  };

  const handleBackToMenu = () => {
    resetBoard();
    setMode("");
    setShowSymbolPicker(false);
    setPlayerSymbol("x");
    setStartingPlayer("player");
  };

  return (
    <div className={`container page-enter ${mode ? `mode-${mode}` : ''}`}>
      <header className="topbar">
        <h1 className="title">Grid Clash</h1>
      </header>

      {/* ✨ FIX 3: Mode selector with better visual feedback */}
      {!mode && !showSymbolPicker && (
        <div className="mode-selection-screen fade-in">
          <ModeSelector onChooseMode={handleChooseMode} />
        </div>
      )}

      {/* ✨ FIX 1: Symbol picker for CPU mode */}
      {showSymbolPicker && (
        <div className="symbol-picker-screen fade-in">
          <h2 className="picker-title">Choose Your Symbol</h2>
          <div className="symbol-options">
            <button 
              className="symbol-btn glow-btn"
              onClick={() => handleSymbolChoice("x")}
            >
              <img src="./Assets/X.png" alt="X" />
              <span>Play as X</span>
              <small>(You start first)</small>
            </button>
            <button 
              className="symbol-btn glow-btn"
              onClick={() => handleSymbolChoice("o")}
            >
              <img src="./Assets/O.png" alt="O" />
              <span>Play as O</span>
              <small>(CPU starts first)</small>
            </button>
          </div>
          <button className="back-btn" onClick={handleBackToMenu}>
            ← Back
          </button>
        </div>
      )}

      {/* ✨ FIX 3: Show current mode badge */}
      {mode && (
        <div className="mode-badge fade-in">
          {mode === "cpu" ? (
            <span>🤖 Player vs CPU ({playerSymbol.toUpperCase()})</span>
          ) : (
            <span>👥 Player vs Player</span>
          )}
        </div>
      )}

      {mode === "cpu" && !showSymbolPicker && (
        <div style={{ marginTop: 10 }}>
          <DifficultySelector difficulty={difficulty} setDifficulty={setDifficulty} />
        </div>
      )}

      {mode && !showSymbolPicker && (
        <>
          <div style={{ width: "100%", maxWidth: 980 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "0 12px" }}>
              <div className={`score card ${winner === "x" ? "active" : ""}`}>
                <img src="./Assets/X.png" alt="X" />
                <div className="score-label">
                  <div className="label">
                    X {mode === "cpu" && playerSymbol === "x" && "(You)"}
                  </div>
                  <div className="value glow-text">{scores.x}</div>
                </div>
              </div>

              <div className={`turn card turn-card`}>
                <div className="turn-text">Turn</div>
                <div className={`turn-icon ${cpuThinking ? "thinking" : ""}`}>
                  <img src={ currentTurn === "X" ? "./Assets/X.png" : "./Assets/O.png" } alt="turn" />
                </div>
              </div>

              <div className={`score card ${winner === "o" ? "active" : ""}`}>
                <img src="./Assets/O.png" alt="O" />
                <div className="score-label">
                  <div className="label">
                    O {mode === "cpu" && playerSymbol === "o" && "(You)"}
                  </div>
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