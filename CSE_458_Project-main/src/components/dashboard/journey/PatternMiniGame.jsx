import React, { useState, useEffect } from "react";

const PatternMiniGame = ({ onNext }) => {
  const allPatterns = [
    { pattern: [1, 2, 3], correct: 4 },
    { pattern: [2, 4, 6], correct: 8 },
    { pattern: [5, 10, 15], correct: 20 },
    { pattern: [0, 1, 1, 2, 3], correct: 5 },
    { pattern: [1, 4, 9], correct: 16 },
    { pattern: [1, 8, 27], correct: 64 }
  ];

  const [selectedPatterns, setSelectedPatterns] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState("");
  const [isError, setIsError] = useState(false);

  // Initialize 3 random patterns
  useEffect(() => {
    const shuffled = [...allPatterns].sort(() => 0.5 - Math.random());
    setSelectedPatterns(shuffled.slice(0, 3));
  }, []);

  const handleAction = (isSkip = false) => {
    const isLastPattern = currentIdx === selectedPatterns.length - 1;
    let scoreUpdate = {};

    if (isSkip) {
      // Penalty for skipping: increase helplessness/anxiety, decrease happiness
      scoreUpdate = { helpless: 1, anxious: 1, happy: -1 };
    } else {
      const isCorrect = parseInt(input) === selectedPatterns[currentIdx].correct;
      if (!isCorrect) {
        setIsError(true);
        // Small penalty for a wrong attempt but don't move forward
        onNext({ unfocused: 0.5 }, false); 
        return;
      }
      // Reward for correct answer
      scoreUpdate = { happy: 1, calm: 1 };
    }

    // Pass the score AND the completion status to the parent
    // The second argument 'isLastPattern' tells the parent whether to show the button
    onNext(scoreUpdate, isLastPattern);

    if (!isLastPattern) {
      setCurrentIdx(prev => prev + 1);
      setInput("");
      setIsError(false);
    }
  };

  if (selectedPatterns.length === 0) return null;

  return (
    <div className="bg-slate-800 p-8 rounded-2xl text-center shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-2 text-amber-400">Pattern Recognition</h2>
      <p className="text-slate-400 mb-6 text-sm">Step {currentIdx + 1} of 3</p>
      
      <div className="bg-slate-900 py-4 px-6 rounded-xl mb-6 inline-block">
        <p className="text-2xl font-mono tracking-widest text-white">
          {selectedPatterns[currentIdx].pattern.join(", ")}, <span className="text-amber-500">?</span>
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <input
          type="number"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setIsError(false);
          }}
          placeholder="???"
          className={`w-full px-4 py-3 rounded-xl text-black text-center text-xl focus:outline-none transition-all ${
            isError ? "border-4 border-red-500 animate-pulse" : "border-4 border-transparent"
          }`}
        />

        <div className="flex gap-3 w-full justify-center">
          <button
            onClick={() => handleAction(true)}
            className="px-4 py-2 text-slate-400 hover:text-white transition text-sm"
          >
            Skip
          </button>
          
          <button
            onClick={() => handleAction(false)}
            className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-2 rounded-xl font-bold transition-all active:scale-95"
          >
            Submit
          </button>
        </div>
        {isError && <p className="text-red-400 text-sm mt-2">Try again!</p>}
      </div>
    </div>
  );
};

export default PatternMiniGame;