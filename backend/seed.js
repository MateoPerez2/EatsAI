// seed.js
// Seeds random daily intake records for approximately 90 days (3 months)

const mongoose = require('mongoose');
const Intake = require('./src/models/Intake'); // adjust the path if needed
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutriblend';

// Use a forced user ID for seeding – adjust as necessary
const forcedUserId = "679fa0ecd95c0c988f3c04f4";

// Helper function: random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seedIntakes() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB for seeding");

    // Optionally clear previous intakes for this user
    await Intake.deleteMany({ userId: forcedUserId });
    console.log("Deleted existing intakes for user:", forcedUserId);

    const today = new Date();
    const daysToSeed = 90; // about 3 months
    let count = 0;
    const intakeDocs = [];

    // For each day from today back to 90 days ago
    for (let i = 0; i < daysToSeed; i++) {
      const day = new Date();
      day.setDate(today.getDate() - i);
      // Format date as "YYYY-MM-DD"
      const year = day.getFullYear();
      const month = String(day.getMonth() + 1).padStart(2, '0');
      const date = String(day.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${date}`;

      // Seed 3 intakes for each day (adjust if needed)
      for (let j = 1; j <= 3; j++) {
        const calories = getRandomInt(200, 800);
        const carbs = getRandomInt(20, 100);
        const protein = getRandomInt(10, 60);
        const fats = getRandomInt(5, 30);
        const mealName = `Seeded Meal: ${dateStr} #${j}`;

        const intakeDoc = new Intake({
          meal: mealName,
          calories,
          macros: {
            carbs,
            protein,
            fats
          },
          userId: forcedUserId,
          date: dateStr
        });
        intakeDocs.push(intakeDoc);
        count++;
      }
    }

    await Intake.insertMany(intakeDocs);
    console.log(`Seeded ${count} intake records for user ${forcedUserId}`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seedIntakes();
