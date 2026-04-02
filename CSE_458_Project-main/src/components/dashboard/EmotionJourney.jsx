import React, { useState, useEffect, useLayoutEffect } from "react";
import FocusMiniGame from "./journey/FocusMiniGame";
import MemoryMiniGame from "./journey/MemoryMiniGame";
import SpeedMiniGame from "./journey/SpeedMiniGame";
import SoftQuestion from "./journey/SoftQuestion";
import ReactionMiniGame from "./journey/ReactionMiniGame";
import PatternMiniGame from "./journey/PatternMiniGame";


const EmotionJourney = ({ onComplete, onExit }) => {
  const [step, setStep] = useState(0);
  const [vector, setVector] = useState({
    happy: 0, calm: 0, anxious: 0, sad: 0, unfocused: 0, helpless: 0
  });

  const [currentStepData, setCurrentStepData] = useState(null); // Start as null
  const [canProceed, setCanProceed] = useState(false);

  // useLayoutEffect runs BEFORE the browser paints, preventing the button flicker
  useLayoutEffect(() => {
    setCanProceed(false);
    setCurrentStepData(null); 
  }, [step]);

  const updateVector = (updates) => {
    if (!updates) return;
    setVector((prev) => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(updates).map(([k, v]) => [k, (prev[k] || 0) + v])
      )
    }));
  };

  const handleNext = () => {
    updateVector(currentStepData);
    setStep((prev) => prev + 1);
  };

  const finishJourney = () => {
    updateVector(currentStepData);
    setStep("finalResult");
  };

  const handleStepData = (data, isDone = true) => {
    setCurrentStepData(data);
    if (isDone) setCanProceed(true);
  };

  const renderCurrentStep = () => {
    // We pass handleStepData to every child
    const props = { onNext: handleStepData };
    
    switch (step) {
      case 0: return <FocusMiniGame {...props} />;
      case 1: return (
        <SoftQuestion
          {...props}
          question="Did that feel easy or overwhelming?"
          options={[
            { label: "Easy", effect: { calm: 1, happy: 1 } },
            { label: "A bit stressful", effect: { anxious: 1 } },
            { label: "Hard to focus", effect: { unfocused: 1 } }
          ]}
        />
      );
      case 2: return <MemoryMiniGame {...props} />;
      case 3: return (
        <SoftQuestion
          {...props}
          question="When things get complicated, you usually..."
          options={[
            { label: "Slow down", effect: { calm: 1 } },
            { label: "Rush through", effect: { anxious: 1 } },
            { label: "Avoid it", effect: { helpless: 1 } }
          ]}
        />
      );
      case 4: return <ReactionMiniGame {...props} />;
      case 5: return <SpeedMiniGame {...props} />;
      case 6: return (
        <SoftQuestion
          {...props}
          question="Right now you feel more..."
          options={[
            { label: "Energized", effect: { happy: 1 } },
            { label: "Drained", effect: { sad: 1 } },
            { label: "Restless", effect: { anxious: 1 } },
            { label: "Peaceful", effect: { calm: 1 } }
          ]}
        />
      );
      case 7: return <PatternMiniGame {...props} />;
      default: return null;
    }
  };

  const totalSteps = 8;

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 text-white">
      <button onClick={onExit} className="absolute top-6 right-6 text-slate-500 hover:text-white">✕</button>

      <div className="w-full max-w-xl px-6 flex flex-col items-center">
        {step === "finalResult" ? (
          <div className="text-center">
             {/* Use your getDominantEmotion results here */}
             <button onClick={() => onComplete('happy')} className="bg-green-500 p-4">Finish</button>
          </div>
        ) : (
          <div key={step} className="w-full">
            {renderCurrentStep()}
          </div>
        )}

        {/* CRITICAL CHANGE: Only show button if canProceed is true AND currentStepData is NOT null */}
        {canProceed && currentStepData !== null && step !== "finalResult" && (
          <button
            onClick={step === totalSteps - 1 ? finishJourney : handleNext}
            className={`mt-6 px-10 py-3 rounded-xl text-black font-bold shadow-xl transition-all active:scale-95 ${
              step === totalSteps - 1 ? "bg-green-500 hover:bg-green-400" : "bg-amber-500 hover:bg-amber-400"
            }`}
          >
            {step === totalSteps - 1 ? "Finish Journey" : "Next Step"}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmotionJourney;