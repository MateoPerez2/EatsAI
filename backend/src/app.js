/***************************************************************
 * Unified app.js for nutriblendai-backend (port 3001, /api prefix)
 ***************************************************************/
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const logger = require('./utils/logger');
const analyticsRoutes = require('./routes/analytics');
const goalRoutes = require('./routes/goal');

// Import your Mongoose models (make sure these exist):
//   nutriblendai-backend/src/models/User.js
//   nutriblendai-backend/src/models/Intake.js
const User = require('./models/User');
const IntakeModel = require('./models/Intake');




// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutriblend', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

// Basic middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

app.use('/api/auth', authRoutes);

// Secrets
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret-jwt-key';
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error("Missing OPENAI_API_KEY in .env");
  process.exit(1);
}

app.use('/api/analytics', analyticsRoutes);
app.use('/api/goal', goalRoutes);


/***************************************************************
 *  Analyze: /api/analyze-structured
 *  Receives base64 image data, calls OpenAI
 ***************************************************************/
app.post('/api/analyze-structured', async (req, res) => {
  try {
    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: 'No imageData' });
    }

    const schemaDefinition = {
      name: "meal_analysis",
      schema: {
        type: "object",
        properties: {
          calories: { type: "number" },
          carbs: { type: "number" },
          protein: { type: "number" },
          fats: { type: "number" },
          notes: { type: "string" }
        },
        required: ["calories", "carbs", "protein", "fats", "notes"],
        additionalProperties: false
      },
      strict: true
    };

    const body = {
      model: "gpt-4o-2024-08-06", // hypothetical model w/ structured outputs
      messages: [
        {
          role: "system",
          content: "You are a meal analysis AI. Return valid JSON per the schema."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Estimate macros from this image in JSON (calories, carbs, protein, fats, notes)."
            },
            {
              type: "image_url",
              image_url: { url: imageData, detail: "low" }
            }
          ]
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: schemaDefinition
      },
      max_tokens: 300
    };

    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_KEY}`
        }
      }
    );

    const message = openaiRes.data.choices[0]?.message;
    if (!message) {
      return res.status(500).json({ error: "No structured response from OpenAI" });
    }

    if (message.refusal) {
      return res.status(400).json({ refusal: message.refusal });
    } else if (message.parsed) {
      return res.json({ analysis: message.parsed });
    } else if (message.content) {
      return res.json({ analysis: message.content });
    }

    return res.status(500).json({ error: "No structured output" });
  } catch (err) {
    console.error("Analyze structured error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Analysis with structured outputs failed" });
  }
});

/***************************************************************
 *  Intakes: /api/intakes
 *    GET  => list user’s intakes (optionally filter by date)
 *    POST => create new intake
 ***************************************************************/
const requireAuth = require('./middleware/authMiddleware');
app.get('/api/intakes', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    const filter = { userId };
    if (date) {
      filter.date = date;
    }

    const intakes = await IntakeModel.find(filter).sort({ _id: -1 });
    return res.json(intakes);
  } catch (err) {
    console.error("GET /intakes error:", err.message);
    return res.status(500).json({ error: "Failed to get intakes" });
  }
});

app.post('/api/intakes', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    let { meal, calories, macros, date } = req.body;
    
    // Default date => today's YYYY-MM-DD
    if (!date) {
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      date = `${y}-${m}-${d}`;
    }

    const newIntake = new IntakeModel({
      meal,
      calories,
      macros,
      userId, // store the user ID from the token
      date
    });

    await newIntake.save();
    return res.json({ message: 'Intake saved', data: newIntake });
  } catch (err) {
    console.error('[Error /intakes]', err.message);
    return res.status(500).json({ error: 'Failed to save intake' });
  }
});

/***************************************************************
 *  Intakes Stats: /api/intakes/stats
 ***************************************************************/
app.get('/api/intakes/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    const filter = { userId };
    if (date) filter.date = date;

    const intakes = await IntakeModel.find(filter);
    const totalMeals = intakes.length;
    const totalCalories = intakes.reduce((acc, it) => acc + (it.calories || 0), 0);

    return res.json({ totalMeals, totalCalories });
  } catch (err) {
    console.error("[GET /api/intakes/stats]", err.message);
    return res.status(500).json({ error: "Failed to retrieve stats" });
  }
});

/***************************************************************
 *  Auth: /api/auth
 *    /register, /login, /me
 ***************************************************************/
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const newUser = new User({ email, password, name });
    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({
      message: 'User registered',
      token,
      user: { email: newUser.email, name: newUser.name }
    });
  } catch (err) {
    console.error('[Register Error]', err.message);
    return res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    return res.json({
      message: 'Logged in',
      token,
      user: { email: user.email, name: user.name }
    });
  } catch (err) {
    console.error('[Login Error]', err.message);
    return res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('email name');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

/***************************************************************
 *  Analytics: /api/analytics/daily-calories
 ***************************************************************/
app.get('/api/analytics/daily-calories', requireAuth, async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

    // We rely on timestamps: true in the Intake model for createdAt
    const intakes = await IntakeModel.find({
      userId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: 1 });

    // Build a map day => total calories
    const dailyMap = {};
    for (let i = 0; i < 7; i++) {
      const dt = new Date(sevenDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      dailyMap[dt.toISOString().slice(0, 10)] = 0;
    }

    intakes.forEach(item => {
      const key = item.createdAt.toISOString().slice(0, 10);
      if (key in dailyMap) {
        dailyMap[key] += (item.calories || 0);
      }
    });

    const dailyData = Object.keys(dailyMap).sort().map(dateKey => ({
      date: dateKey,
      calories: dailyMap[dateKey]
    }));

    return res.json(dailyData);
  } catch (err) {
    console.error("[GET /api/analytics/daily-calories]", err);
    return res.status(500).json({ error: "Failed to retrieve daily stats" });
  }
});

/***************************************************************
 *  Health Check, Global Error Handler, Start Server
 ***************************************************************/
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running' });
});

// Global error handling
app.use((err, req, res, next) => {
  // Log the error using Winston
  logger.error('Unhandled Error:', err);

  // If headers already sent, delegate to default error handler
  if (res.headersSent) {
    return next(err);
  }

  // Send a uniform JSON error response
  res.status(500).json({
    error: {
      code: 500,
      message: 'An unexpected error occurred.',
      // Optionally include err.message in development mode:
      // message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.'
    }
  });
});


const startServer = () => {
  const PORT = process.env.PORT || 3001;
  const server = app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use. Exiting...`);
    } else {
      console.error('Server Error:', err);
    }
  });
};

startServer();

module.exports = app;
