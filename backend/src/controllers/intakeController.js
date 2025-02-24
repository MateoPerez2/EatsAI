// src/controllers/intakeController.js
const intakeModel = require('../models/intakeModel');

// Handler to get intake records for a user
exports.getIntakes = (req, res) => {
  const userId = req.user.id;
  const intakes = intakeModel.getIntakes(userId);
  res.status(200).json({ intakes });
};

// Handler to add a new intake record for a user
exports.addIntake = (req, res) => {
  const userId = req.user.id;
  const { meal, calories, macros } = req.body;

  if (!meal || !calories || !macros || !macros.carbs || !macros.protein || !macros.fats) {
    return res.status(400).json({ error: 'Meal, calories, and complete macros are required.' });
  }

  const newIntake = intakeModel.addIntake(userId, { meal, calories, macros });
  res.status(201).json({ intakes: newIntake });
};
