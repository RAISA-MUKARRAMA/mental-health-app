import React, { useState, useEffect } from "react";

const generateSequence = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 4));

const MemoryMiniGame = ({ onNext }) => {
  const [sequence, setSequence] = useState(generateSequence());
  const [currentStep, setCurrentStep] = useState(-1);
  const [showPhase, setShowPhase] = useState(true);
  const [userInput, setUserInput] = useState([]);
  const [message, setMessage] = useState("Observe the pattern carefully");

  // Smooth sequence showing one by one
  useEffect(() => {
    if (showPhase) {
      if (currentStep < sequence.length - 1) {
        const timer = setTimeout(() => setCurrentStep(prev => prev + 1), 800);
        return () => clearTimeout(timer);
      } else if (currentStep === sequence.length - 1) {
        const timer = setTimeout(() => {
          setShowPhase(false);
          setCurrentStep(-1);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [currentStep, showPhase, sequence.length]);

  // Check user input when done
  useEffect(() => {
    if (!showPhase && userInput.length === sequence.length) {
      const correct = userInput.every((val, index) => val === sequence[index]);
      if (correct) {
        setMessage("Correct! Proceeding...");
        setTimeout(() => onNext({ calm: 2 }), 1000); // call global next
      } else {
        setMessage("Incorrect. Try again!");
        setUserInput([]);
        setShowPhase(true);
        setCurrentStep(-1);
        setSequence(generateSequence());
      }
    }
  }, [userInput, showPhase, onNext, sequence]);

  const handleClick = (index) => {
    if (!showPhase) {
      setUserInput(prev => [...prev, index]);
    }
  };

  return (
    <div className="h-96 bg-indigo-950 rounded-2xl flex flex-col items-center justify-center text-white p-4">
      <h2 className="text-lg font-medium mb-4">Sequence Recall</h2>
      <p className="text-sm opacity-70 mb-6">{message}</p>

      <div className="grid grid-cols-2 gap-6">
        {[0, 1, 2, 3].map(i => {
          const isActive = showPhase && sequence[currentStep] === i;
          const isSelected = userInput.includes(i);
          return (
            <div
              key={i}
              onClick={() => handleClick(i)}
              className={`w-20 h-20 rounded-lg transition-all duration-300 cursor-pointer ${
                isActive ? "bg-purple-400 animate-pulse" :
                isSelected ? "bg-purple-600" : "bg-slate-600"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MemoryMiniGame;