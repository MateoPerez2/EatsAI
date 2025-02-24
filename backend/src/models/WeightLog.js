// src/models/WeightLog.js
const mongoose = require('mongoose');

const weightLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // e.g. "YYYY-MM-DD"
  weight: { type: Number, required: true }, // in kg
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('WeightLog', weightLogSchema);
