import React, { useState } from "react";

const PatternMiniGame = ({ onNext, onComplete }) => {
  const patterns = [
    { pattern: [1,2,3], correct: 3 },
    { pattern: [2,4,6], correct: 8 },
    { pattern: [5,10,15], correct: 20 }
  ];

  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");

  const handleNext = () => {
    const correct = patterns[current].correct;
    let updates = {};
    if (parseInt(input) === correct) {
      updates = { happy: 2, calm: 1 }; // correct -> positive
    } else {
      updates = { anxious: 1, unfocused: 1 }; // wrong -> anxious/unfocused
    }
    onNext(updates);
    if (current + 1 < patterns.length) {
      setCurrent(current + 1);
      setInput("");
    } else {
      onComplete();
    }
  };

  return (
    <div className="bg-slate-700 p-6 rounded-xl text-center">
      <h2 className="text-2xl font-bold mb-4">Pattern Recognition</h2>
      <p className="mb-4">Complete the pattern: {patterns[current].pattern.join(", ")} , ?</p>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="mb-4 px-3 py-2 rounded-lg text-black"
      />
      <br />
      <button
        onClick={handleNext}
        className="bg-amber-600 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold"
      >
        Next
      </button>
    </div>
  );
};

export default PatternMiniGame;