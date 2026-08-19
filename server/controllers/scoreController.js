const { PrismaClient } = require('@prisma/client');
const { calculateProductivity } = require('../utils/scoreHelper');

const prisma = new PrismaClient();

const getScore = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      select: { completed: true, important: true },
    });

    res.json(calculateProductivity(tasks));
  } catch (error) {
    console.error('Failed to calculate productivity score:', error);
    res.status(500).json({ error: 'Failed to fetch score' });
  }
};

module.exports = {
  getScore,
};
