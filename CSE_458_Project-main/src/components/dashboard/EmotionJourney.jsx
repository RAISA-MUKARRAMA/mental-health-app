import React, { useState } from "react";
import FocusMiniGame from "./journey/FocusMiniGame";
import MemoryMiniGame from "./journey/MemoryMiniGame";
import SpeedMiniGame from "./journey/SpeedMiniGame";
import SoftQuestion from "./journey/SoftQuestion";
import ReactionMiniGame from "./journey/ReactionMiniGame";
import PatternMiniGame from "./journey/PatternMiniGame";

const EmotionJourney = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(0);
  const [vector, setVector] = useState({
    happy: 0,
    calm: 0,
    anxious: 0,
    sad: 0,
    unfocused: 0,
    helpless: 0
  });

  const [currentStepData, setCurrentStepData] = useState({});
  const [canProceed, setCanProceed] = useState(false);

  const updateVector = (updates) => {
    setVector((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(updates).map(([k, v]) => [k, prev[k] + v])
      )
    }));
  };

  const handleNext = () => {
    updateVector(currentStepData);
    setCurrentStepData({});
    setCanProceed(false);
    setStep((prev) => prev + 1);
  };

  const getDominantEmotion = () => {
    const maxScore = Math.max(...Object.values(vector));
    const dominant = Object.keys(vector).filter((k) => vector[k] === maxScore);
    return { dominant, score: maxScore };
  };

  const finishJourney = () => {
    // Go to the final result step
    setStep("finalResult");
  };

  const steps = [
    <FocusMiniGame onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }} />,
    <SoftQuestion
      question="Did that feel easy or overwhelming?"
      options={[
        { label: "Easy", effect: { calm: 1, happy: 1 } },
        { label: "A bit stressful", effect: { anxious: 1 } },
        { label: "Hard to focus", effect: { unfocused: 1 } }
      ]}
      onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }}
    />,
    <MemoryMiniGame onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }} />,
    <SoftQuestion
      question="When things get complicated, you usually..."
      options={[
        { label: "Slow down", effect: { calm: 1 } },
        { label: "Rush through", effect: { anxious: 1 } },
        { label: "Avoid it", effect: { helpless: 1 } }
      ]}
      onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }}
    />,
    <ReactionMiniGame onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }} />,
    <SpeedMiniGame onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }} />,
    <SoftQuestion
      question="Right now you feel more..."
      options={[
        { label: "Energized", effect: { happy: 1 } },
        { label: "Drained", effect: { sad: 1 } },
        { label: "Restless", effect: { anxious: 1 } },
        { label: "Peaceful", effect: { calm: 1 } }
      ]}
      onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }}
    />,
    <PatternMiniGame onNext={(data) => { setCurrentStepData(data); setCanProceed(true); }} />
  ];

  // Final result component
  const finalResultStep = () => {
    const { dominant, score } = getDominantEmotion();
    return (
      <div className="h-96 bg-indigo-950 rounded-2xl flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-2xl font-bold mb-4">Your Result</h2>
        <p className="text-lg mb-2">Dominant Emotion: <span className="text-amber-400">{dominant.join(", ")}</span></p>
        <p className="text-sm opacity-70 mb-6">Score: {score}</p>
        <button
          onClick={() => onComplete(dominant[0])} // proceed to quote page
          className="mt-4 px-6 py-2 bg-green-500 rounded-xl text-black font-bold hover:bg-green-600 transition"
        >
          See Your Quote
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center z-50 text-white">
      <button
        onClick={onExit}
        className="absolute top-6 right-6 text-gray-400 hover:text-white"
      >
        ✕
      </button>

      <div className="w-full max-w-xl px-6 flex flex-col items-center">
        {step === "finalResult" ? finalResultStep() : steps[step]}

        {canProceed && step !== "finalResult" && step < steps.length - 1 && (
          <button
            onClick={handleNext}
            className="mt-6 px-6 py-2 bg-amber-500 rounded-xl text-black font-bold hover:bg-amber-600 transition"
          >
            Next
          </button>
        )}

        {canProceed && step !== "finalResult" && step === steps.length - 1 && (
          <button
            onClick={() => { updateVector(currentStepData); finishJourney(); }}
            className="mt-6 px-6 py-2 bg-green-500 rounded-xl text-black font-bold hover:bg-green-600 transition"
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default EmotionJourney;