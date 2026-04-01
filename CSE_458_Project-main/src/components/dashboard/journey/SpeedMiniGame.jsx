import React, { useState, useEffect } from "react";

const thoughts = [
  { text: "Small progress", type: "helpful" },
  { text: "Deadline tomorrow", type: "stressful" },
  { text: "Quiet evening", type: "neutral" }
];

const SpeedMiniGame = ({ onNext }) => {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [time, setTime] = useState(18);

  useEffect(() => {
    if (time === 0 || index >= thoughts.length) {
      const result =
        correct >= 2 ? { happy: 2 } :
        correct === 1 ? { calm: 1 } :
        { sad: 2 };

      onNext(result);
      return;
    }

    const timer = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, index]);

  const handleChoice = (choice) => {
    if (choice === thoughts[index].type) {
      setCorrect(c => c + 1);
    }
    setIndex(i => i + 1);
  };

  return (
    <div className="h-96 bg-slate-800 rounded-2xl flex flex-col items-center justify-center text-white">
      <h2 className="text-lg mb-4">Thought Sorting</h2>
      <p className="text-sm opacity-70 mb-6">
        Categorize the thought calmly
      </p>

      {index < thoughts.length && (
        <div className="bg-slate-700 px-6 py-4 rounded-lg mb-6">
          {thoughts[index].text}
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={() => handleChoice("helpful")} className="px-4 py-2 bg-emerald-600 rounded">
          Helpful
        </button>
        <button onClick={() => handleChoice("neutral")} className="px-4 py-2 bg-slate-500 rounded">
          Neutral
        </button>
        <button onClick={() => handleChoice("stressful")} className="px-4 py-2 bg-rose-600 rounded">
          Stressful
        </button>
      </div>

      <p className="text-xs opacity-50 mt-6">⏳ {time}s remaining</p>
    </div>
  );
};

export default SpeedMiniGame;