import React, { useState, useEffect } from "react";

const FocusMiniGame = ({ onNext }) => {
  const [radius, setRadius] = useState(20);
  const [direction, setDirection] = useState(1);
  const [time, setTime] = useState(15);
  const [accuracy, setAccuracy] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRadius(prev => {
        if (prev >= 90) setDirection(-1);
        if (prev <= 20) setDirection(1);
        return prev + direction * 3;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [direction]);

  useEffect(() => {
    if (time === 0) {
      const avg =
        accuracy.length > 0
          ? accuracy.reduce((a, b) => a + b, 0) / accuracy.length
          : 0;

      const result =
        avg > 80 ? { calm: 2 } :
        avg > 60 ? { calm: 1 } :
        avg > 40 ? { anxious: 1 } :
        { anxious: 2 };

      onNext(result);
      return;
    }

    const timer = setTimeout(() => setTime(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  const handleClick = () => {
    const distanceFromCenter = Math.abs(radius - 65);
    const score = Math.max(0, 100 - distanceFromCenter * 3);
    setAccuracy(prev => [...prev, score]);
  };

  return (
    <div className="h-96 bg-slate-900 rounded-2xl flex flex-col items-center justify-center text-white">
      <h2 className="text-lg font-medium mb-2">Rhythm Control</h2>
      <p className="text-sm opacity-70 mb-6">
        Click when the circle aligns with the center band
      </p>

      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          onClick={handleClick}
          className="absolute rounded-full border-4 border-cyan-400 cursor-pointer transition-all duration-75"
          style={{
            width: radius * 2,
            height: radius * 2
          }}
        />
        <div className="absolute w-28 h-28 border border-white opacity-30 rounded-full" />
      </div>

      <p className="text-xs opacity-50 mt-6">⏳ {time}s remaining</p>
    </div>
  );
};

export default FocusMiniGame;