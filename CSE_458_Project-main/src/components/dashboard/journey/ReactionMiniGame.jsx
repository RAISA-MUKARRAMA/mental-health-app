import React, { useState, useEffect } from "react";

const TOTAL_ROUNDS = 3;

const ReactionMiniGame = ({ onNext }) => {
  const [gameState, setGameState] = useState("waiting"); 
  const [round, setRound] = useState(1);
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState([]);
  const [message, setMessage] = useState("Wait for the signal...");
  const [finished, setFinished] = useState(false);

  // Start signal after random delay
  useEffect(() => {
    let timer;

    if (gameState === "waiting" && !finished) {
      const delay = Math.random() * 3000 + 2000; // 2–5 sec
      timer = setTimeout(() => {
        setGameState("ready");
        setStartTime(Date.now());
        setMessage("CLICK NOW!");
      }, delay);
    }

    return () => clearTimeout(timer);
  }, [gameState, finished]);

  const handleClick = () => {
    if (finished) return; // Prevent clicks after game ends

    // Clicked too early
    if (gameState === "waiting") {
      setMessage("Too early! Stay calm.");
      setFinished(true);
      // Call onNext with data and 'true' to show the Next button in Parent
      onNext({ anxious: 2 }, true);
      return;
    }

    // Valid click
    if (gameState === "ready") {
      const reactionTime = Date.now() - startTime;
      const newTimes = [...times, reactionTime];
      setTimes(newTimes);

      // If more rounds left
      if (round < TOTAL_ROUNDS) {
        setRound(prev => prev + 1);
        setGameState("waiting");
        setMessage(`Round ${round + 1}: Wait for the signal...`);
      } else {
        // Final calculation
        const avg = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
        let updates = {};

        if (avg < 300) {
          updates = { calm: 2, happy: 1 };
          setMessage(`Excellent! Avg: ${Math.round(avg)} ms`);
        } else if (avg < 600) {
          updates = { calm: 1 };
          setMessage(`Good! Avg: ${Math.round(avg)} ms`);
        } else {
          updates = { anxious: 1, unfocused: 1 };
          setMessage(`Slow reactions (${Math.round(avg)} ms)`);
        }

        setFinished(true);
        // CRITICAL: Pass 'true' as second argument to show the "Next" button
        onNext(updates, true);
      }
    }
  };

  const handleRetry = () => {
    setRound(1);
    setTimes([]);
    setGameState("waiting");
    setFinished(false);
    setMessage("Wait for the signal...");
    // Reset parent data so "Next" button hides again
    onNext(null, false);
  };

  // FIXED PROGRESS CALCULATION:
  // If finished, show 100%. Otherwise, show progress based on completed rounds.
  const progress = finished 
    ? 100 
    : ((round - 1) / TOTAL_ROUNDS) * 100;

  return (
    <div className="h-96 bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-white p-6 text-center w-full shadow-xl">
      <h2 className="text-2xl font-bold mb-2">Reaction Test</h2>
      <p className="text-sm text-gray-400 mb-4">
        {finished ? "Test Complete" : `Round ${round} of ${TOTAL_ROUNDS}`}
      </p>

      {/* Progress Bar Container */}
      <div className="w-full max-w-xs h-3 bg-slate-900 rounded-full mb-6 overflow-hidden border border-slate-700">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            finished ? "bg-green-500" : "bg-amber-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className={`mb-8 text-lg font-medium ${gameState === "ready" ? "text-green-400" : "text-gray-300"}`}>
        {message}
      </p>

      <button
        onClick={handleClick}
        disabled={finished}
        className={`px-12 py-8 rounded-2xl font-black text-2xl transition-all active:scale-95 shadow-lg ${
          gameState === "ready"
            ? "bg-green-500 hover:bg-green-400 text-black animate-pulse"
            : "bg-slate-700 text-gray-400 cursor-not-allowed"
        } ${finished ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
      >
        {gameState === "ready" ? "CLICK!" : "WAIT..."}
      </button>

      {finished && (
        <button
          onClick={handleRetry}
          className="mt-2 px-6 py-2 bg-slate-700 rounded-xl text-white font-bold hover:bg-slate-600 transition-colors border border-slate-500"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ReactionMiniGame;