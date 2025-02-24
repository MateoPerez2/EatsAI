// src/controllers/analyticsController.js
const Intake = require('../models/Intake');
const WeightLog = require('../models/WeightLog'); // optional
const Goal = require('../models/Goal');
const mongoose = require('mongoose');

// 1) Past 30 days macros
exports.getPast30DaysMacros = async (req, res) => {
  try {
    const userId = req.userId; // from auth middleware
    // Compute the date range
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - 29); // past 30 days

    // Convert to "YYYY-MM-DD" if your Intakes store date as string
    // or if you store date as actual Date, do a $gte with start & end
    const startStr = start.toISOString().slice(0, 10);
    const endStr   = end.toISOString().slice(0, 10);

    // Aggregation pipeline
    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startStr, $lte: endStr },
        }
      },
      {
        $group: {
          _id: "$date",
          totalCalories: { $sum: "$calories" },
          totalCarbs: { $sum: "$macros.carbs" },
          totalProtein: { $sum: "$macros.protein" },
          totalFats: { $sum: "$macros.fats" }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await Intake.aggregate(pipeline);

    // Return array of { date, totalCalories, totalCarbs, totalProtein, totalFats }
    return res.json(results.map(r => ({
      date: r._id,
      totalCalories: r.totalCalories,
      totalCarbs: r.totalCarbs,
      totalProtein: r.totalProtein,
      totalFats: r.totalFats
    })));
  } catch (err) {
    console.error('getPast30DaysMacros Error:', err);
    return res.status(500).json({ error: 'Failed to get 30-day macros.' });
  }
};

// 2) Monthly macros aggregator (e.g. group by "YYYY-MM")
exports.getMonthlyMacros = async (req, res) => {
  try {
    const userId = req.userId;
    const { year } = req.query; // e.g. year=2023
    if (!year) {
      return res.status(400).json({ error: 'year query param required' });
    }

    // We'll assume `date` is stored as "YYYY-MM-DD"
    const startStr = `${year}-01-01`;
    const endStr   = `${year}-12-31`;

    const pipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startStr, $lte: endStr }
        }
      },
      // Create a "month" field from the first 7 chars of date => "YYYY-MM"
      {
        $project: {
          month: { $substr: ["$date", 0, 7] },
          calories: "$calories",
          macros: "$macros"
        }
      },
      {
        $group: {
          _id: "$month",
          totalCalories: { $sum: "$calories" },
          totalCarbs: { $sum: "$macros.carbs" },
          totalProtein: { $sum: "$macros.protein" },
          totalFats: { $sum: "$macros.fats" }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const results = await Intake.aggregate(pipeline);
    // Return { month: "YYYY-MM", totals... }
    return res.json(results.map(r => ({
      month: r._id,
      totalCalories: r.totalCalories,
      totalCarbs: r.totalCarbs,
      totalProtein: r.totalProtein,
      totalFats: r.totalFats
    })));
  } catch (err) {
    console.error('getMonthlyMacros Error:', err);
    return res.status(500).json({ error: 'Failed to get monthly macros.' });
  }
};

// 3) Weight logs aggregator (optional)
exports.getWeightHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query; // default 30
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - (days - 1));

    // If WeightLog stores date as "YYYY-MM-DD", do similarly to intakes
    const startStr = start.toISOString().slice(0, 10);
    const endStr   = end.toISOString().slice(0, 10);

    const logs = await WeightLog.find({
      userId,
      date: { $gte: startStr, $lte: endStr }
    }).sort({ date: 1 });

    return res.json(logs); 
    // e.g. [{ date: "2023-08-01", weight: 80 }, ...]
  } catch (err) {
    console.error('getWeightHistory Error:', err);
    return res.status(500).json({ error: 'Failed to get weight history.' });
  }
};

// 4) Predicted days to goal (if you have weight logs + a goal)
exports.getGoalProgress = async (req, res) => {
  try {
    const userId = req.userId;
    // We assume each user has 1 active goal for weight
    const goal = await Goal.findOne({ userId }).sort({ createdAt: -1 });
    if (!goal) {
      return res.status(404).json({ error: 'No active goal found' });
    }

    // Retrieve last N weight logs to see the rate of change
    const logs = await WeightLog.find({ userId }).sort({ date: 1 });
    if (logs.length < 2) {
      return res.json({ 
        goal, 
        progress: 'Not enough weight logs to predict trend' 
      });
    }

    // Calculate average daily weight change
    // e.g. from earliest to latest
    const firstWeight = logs[0].weight;
    const firstDate = new Date(logs[0].date);
    const lastWeight = logs[logs.length - 1].weight;
    const lastDate = new Date(logs[logs.length - 1].date);

    const daysBetween = (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    const weightChange = lastWeight - firstWeight; // positive if gained, negative if lost
    const dailyChange = weightChange / daysBetween;

    // If the user wants to go from lastWeight to goal.targetWeight
    const weightToLose = lastWeight - goal.targetWeight; 
    // If dailyChange is negative, user is losing weight daily
    // predictedDays = weightToLose / dailyChange (but watch sign)
    let predictedDays = null;
    if (dailyChange < 0 && weightToLose > 0) {
      predictedDays = Math.ceil(Math.abs(weightToLose / dailyChange));
    }

    return res.json({
      goal,
      firstLog: logs[0],
      lastLog: logs[logs.length - 1],
      dailyChange,
      predictedDaysToGoal: predictedDays,
    });
  } catch (err) {
    console.error('getGoalProgress Error:', err);
    return res.status(500).json({ error: 'Failed to get goal progress.' });
  }
};
