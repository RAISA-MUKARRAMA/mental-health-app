export const calculateMood = (answers) => {
  const score = {};

  answers.forEach((answer) => {
    score[answer.type] = (score[answer.type] || 0) + 1;
  });

  return Object.keys(score).reduce((a, b) =>
    score[a] > score[b] ? a : b
  );
};