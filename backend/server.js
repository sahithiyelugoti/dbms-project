const cors = require("cors");
const express = require('express');
const db = require('./config/db');
const authRoutes = require('./routes/authroutes');
const sessionRoutes = require('./routes/sessionroute');
const groupRoutes = require('./routes/grouproutes');
require('dotenv').config();

const app = express();
app.get("/api/cors-check", (req, res) => {
  res.json({ message: "Updated server.js is running" });
});
app.use(cors());

app.options(/.*/, cors());

app.use(express.json());

// Register application routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/groups', groupRoutes);

// Test database connection
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT student_id, first_name, email FROM student'
    );

    res.json({
      status: 'All database layers fully linked!',
      data: result.rows
    });
  } catch (err) {
    console.error('Database connection error:', err.message);
    res.status(500).json({
      error: 'Database connection failed.'
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `CogniTrade backend engine is actively listening on port ${PORT}`
  );
});
