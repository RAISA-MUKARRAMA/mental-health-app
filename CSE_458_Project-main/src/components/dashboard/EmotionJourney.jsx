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
          (() => {
            const total = Object.values(vector).reduce((a, b) => a + b, 0) || 1;
            const normalizedScores = Object.fromEntries(
              Object.entries(vector).map(([k, v]) => [k, (v / total).toFixed(2)])
            );
            const sortedScores = Object.entries(normalizedScores)
              .sort((a, b) => b[1] - a[1]);
            const dominantEmotion = sortedScores[0][0];

            return (
              /* Added max-h and overflow-y-auto to handle smaller screens */
              <div className="w-full max-w-md bg-slate-800 rounded-3xl p-6 shadow-2xl text-center border border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                {/* Header - Compact */}
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-white">Emotion Report</h2>
                  <p className="text-xs text-slate-400">Dominant: 
                    <span className="text-amber-400 uppercase font-mono ml-2">{dominantEmotion}</span>
                  </p>
                </div>

                {/* Scrollable Content Area */}
                <div className="space-y-4">
                  {/* Quick Score Grid - Smaller padding */}
                  <div className="grid grid-cols-3 gap-2">
                    {sortedScores.slice(0, 3).map(([key, value]) => (
                      <div key={key} className="bg-slate-900/50 rounded-xl p-2 border border-slate-700">
                        <p className="capitalize text-[10px] text-slate-400">{key}</p>
                        <p className="text-sm font-bold text-amber-400">{(value * 100).toFixed(0)}%</p>
                      </div>
                    ))}
                  </div>

                  {/* Detailed Progress Bars - Compacted */}
                  <div className="bg-slate-900/30 p-4 rounded-2xl space-y-3">
                    {sortedScores.map(([key, value]) => (
                      <div key={key} className="text-left">
                        <div className="flex justify-between text-[11px] mb-1 capitalize text-slate-300">
                          <span>{key}</span>
                          <span className="font-mono text-amber-500">{(value * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-1.5">
                          <div
                            className="bg-amber-400 h-1.5 rounded-full transition-all duration-1000"
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer / Navigation */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <p className="text-[11px] text-slate-400 mb-4 italic">
                    "Your results are ready. Let's find some inspiration."
                  </p>
                  <button
                    onClick={() => onComplete(dominantEmotion)}
                    className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-black rounded-xl transition-all transform active:scale-95 shadow-lg flex items-center justify-center gap-2"
                  >
                    GET MOTIVATION
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })()
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