import React, { useState } from "react";
import { calculateMood } from "./moodLogic";

const questions = [
  {
    question: "Pick a sky that feels like today",
    options: [
      { label: "☀️ Sunny", type: "happy" },
      { label: "🌥 Cloudy", type: "calm" },
      { label: "🌧 Rainy", type: "sad" },
      { label: "🌪 Stormy", type: "anxious" },
      { label: "🌫 Foggy", type: "helpless" }
    ]
  },
  {
    question: "Choose your pace",
    options: [
      { label: "🚀 Fast", type: "happy" },
      { label: "🐢 Slow", type: "sad" },
      { label: "😵 Overloaded", type: "anxious" },
      { label: "🧘 Balanced", type: "calm" },
      { label: "🤯 Restless", type: "helpless" }
    ]
  },
  {
    question: "Pick a sound",
    options: [
      { label: "🎵 Music", type: "happy" },
      { label: "🌊 Waves", type: "calm" },
      { label: "⏰ Ticking", type: "anxious" },
      { label: "💥 Noise", type: "helpless" },
      { label: "🔕 Silence", type: "sad" }
    ]
  },
  {
    question: "Choose a weekend plan",
    options: [
      { label: "🎉 Party", type: "happy" },
      { label: "📚 Read", type: "calm" },
      { label: "🛏 Stay in bed", type: "sad" },
      { label: "📋 Catch up work", type: "anxious" },
      { label: "🚶 Walk alone", type: "helpless" }
    ]
  },
  {
    question: "Pick a color",
    options: [
      { label: "🟡 Yellow", type: "happy" },
      { label: "🔵 Blue", type: "calm" },
      { label: "⚫ Grey", type: "sad" },
      { label: "🔴 Red", type: "anxious" },
      { label: "🟣 Purple", type: "helpless" }
    ]
  }
];

const EmotionCardsGrid = ({ handleEmotionSelect }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const handleAnswer = (option) => {
    const updated = [...answers, option];
    setAnswers(updated);

    if (updated.length === 5) {
      const mood = calculateMood(updated);
      handleEmotionSelect(mood);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 shadow-lg mb-8 text-center animate-fade-in-up">

      {/* Progress */}
      <p className="text-sm text-gray-500 mb-4">
        Question {step + 1} of 5
      </p>

      {/* Question */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {questions[step].question}
      </h2>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {questions[step].options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="bg-white hover:bg-orange-50 transition-all px-4 py-3 rounded-xl shadow-md hover:scale-105"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionCardsGrid;