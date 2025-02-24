// src/models/Goal.js
const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Weight-based goal
  targetWeight: { type: Number, required: true }, // in kg
  targetDate: { type: Date, required: true },

  // Optional daily calorie or macro targets
  dailyCalorieTarget: { type: Number, default: 2000 },
  macrosRatio: {
    carbs: { type: Number, default: 40 },   // e.g., 40% carbs
    protein: { type: Number, default: 30 }, // e.g., 30% protein
    fats: { type: Number, default: 30 },    // e.g., 30% fats
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Goal', goalSchema);
