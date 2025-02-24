// nutriblendai-backend/src/models/Intake.js
const mongoose = require('mongoose');

const intakeSchema = new mongoose.Schema({
  meal: { type: String, required: true },
  calories: { type: Number, required: true },
  macros: {
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    fats: { type: Number, required: true }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String }  // e.g. "2025-02-28"
}, { timestamps: true });

module.exports = mongoose.model('Intake', intakeSchema);
