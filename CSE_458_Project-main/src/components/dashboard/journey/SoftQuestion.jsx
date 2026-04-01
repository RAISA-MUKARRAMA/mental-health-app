import React from "react";

const SoftQuestion = ({ question, options, onNext }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl mb-6">{question}</h2>

      <div className="space-y-4">
        {options.map((opt, index) => (
          <button
            key={index}
            onClick={() => onNext(opt.effect)}
            className="w-full px-6 py-3 bg-white text-black rounded-xl hover:bg-gray-200 transition"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SoftQuestion;