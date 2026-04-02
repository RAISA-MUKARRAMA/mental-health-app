import React, { useState } from "react";

const SoftQuestion = ({ question, options, onNext }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (option, index) => {
    if (selected !== null) return; // Prevent double-clicking
    setSelected(index);
    onNext(option.effect); 
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl text-center text-white w-full">
      <h2 className="text-xl font-bold mb-6">{question}</h2>

      <div className="flex flex-col gap-4">
        {options.map((opt, index) => (
          <button
            key={index}
            onClick={() => selected === null && handleClick(opt, index)}
            className={`px-4 py-3 rounded-xl font-medium transition-all duration-200
              ${
                selected === index
                  ? "bg-amber-500 text-black scale-105"
                  : "bg-slate-600 hover:bg-slate-500"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoftQuestion;