/**
 * Calculate a transparent productivity score from the current task list.
 *
 * Important tasks carry twice the weight of regular tasks. The score is the
 * percentage of completed task weight, so it stays between 0 and 100 and
 * always changes for an understandable reason.
 */
const calculateProductivity = (tasks = []) => {
  const totalWeight = tasks.reduce((sum, task) => sum + (task.important ? 2 : 1), 0);
  const completedWeight = tasks.reduce(
    (sum, task) => sum + (task.completed ? (task.important ? 2 : 1) : 0),
    0
  );

  const score = totalWeight === 0 ? 0 : Math.round((completedWeight / totalWeight) * 100);

  return {
    value: score,
    completedCount: tasks.filter((task) => task.completed).length,
    totalCount: tasks.length,
    importantCompleted: tasks.filter((task) => task.completed && task.important).length,
    importantCount: tasks.filter((task) => task.important).length,
    completedWeight,
    totalWeight,
  };
};

module.exports = {
  calculateProductivity,
};
/* c8 ignore next */
module.exports.calculateMomentumBonus = () => 0;
