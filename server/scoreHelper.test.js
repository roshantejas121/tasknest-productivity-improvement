const assert = require('node:assert/strict');
const { calculateProductivity } = require('./utils/scoreHelper');

assert.deepEqual(calculateProductivity([]), {
  value: 0,
  completedCount: 0,
  totalCount: 0,
  importantCompleted: 0,
  importantCount: 0,
  completedWeight: 0,
  totalWeight: 0,
});

assert.equal(
  calculateProductivity([
    { completed: true, important: true },
    { completed: false, important: false },
  ]).value,
  67
);

assert.equal(
  calculateProductivity([
    { completed: true, important: true },
    { completed: true, important: false },
  ]).value,
  100
);

assert.equal(
  calculateProductivity([
    { completed: false, important: true },
    { completed: true, important: false },
  ]).value,
  33
);

console.log('scoreHelper tests passed');
