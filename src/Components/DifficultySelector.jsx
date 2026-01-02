// src/components/DifficultySelector.jsx

export default function DifficultySelector({ difficulty, setDifficulty }) {
  return (
    <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
      <div style={{ color: "var(--muted)", fontSize: 13 }}>CPU Difficulty</div>
      <div style={{ display: "flex", gap: 8 }}>
        {["easy","medium","hard"].map(level => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`mode-btn difficulty-btn ${difficulty === level ? "active" : ""}`}
            style={{ minWidth: 80 }}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}