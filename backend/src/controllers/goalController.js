// src/controllers/goalController.js
const Goal = require('../models/Goal');

exports.setGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { targetWeight, targetDate, dailyCalorieTarget, macrosRatio } = req.body;
    if (!targetWeight || !targetDate) {
      return res.status(400).json({ error: 'targetWeight and targetDate are required' });
    }

    const newGoal = new Goal({
      userId,
      targetWeight,
      targetDate,
      dailyCalorieTarget: dailyCalorieTarget || 2000,
      macrosRatio: macrosRatio || { carbs: 40, protein: 30, fats: 30 }
    });
    await newGoal.save();
    return res.status(201).json({ message: 'Goal set', goal: newGoal });
  } catch (err) {
    console.error('setGoal Error:', err);
    return res.status(500).json({ error: 'Failed to set goal.' });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });
    if (!goal) {
      return res.status(404).json({ error: 'No goal found' });
    }
    return res.json(goal);
  } catch (err) {
    console.error('getGoal Error:', err);
    return res.status(500).json({ error: 'Failed to get goal.' });
  }
};
