import React, { useState, useEffect } from "react";

const ReactionMiniGame = ({ onNext, onComplete }) => {
  const [clickTime, setClickTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("Get ready...");

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("Click NOW!");
      setStartTime(Date.now());
    }, Math.random() * 2000 + 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (!startTime) return;
    const reaction = Date.now() - startTime;
    setClickTime(reaction);
    let updates = {};
    if (reaction < 300) {
      updates = { calm: 2, happy: 1 }; // quick reaction -> calm + happy
    } else if (reaction < 600) {
      updates = { calm: 1, anxious: 1 };
    } else {
      updates = { anxious: 2, unfocused: 1 }; // slow reaction -> anxious/unfocused
    }
    onNext(updates);
    onComplete();
  };

  return (
    <div className="bg-slate-700 p-6 rounded-xl text-center">
      <h2 className="text-2xl font-bold mb-4">Reaction Test</h2>
      <p className="mb-4">{clickTime ? `Your reaction: ${clickTime}ms` : message}</p>
      {!clickTime && (
        <button
          onClick={handleClick}
          className="bg-amber-600 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold"
        >
          Click Me!
        </button>
      )}
    </div>
  );
};

export default ReactionMiniGame;