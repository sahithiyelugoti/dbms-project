// server.js
const express = require('express');
const db = require('./config/db'); 
const authRoutes = require('./routes/authroutes');
const sessionRoutes = require('./routes/sessionRoutes');
const groupRoutes = require('./routes/grouproutes'); // 1. Load the new group routing maps
require('dotenv').config();

const app = express();
app.use(express.json()); // Essential body-parser line for JSON inputs

// 2. Wire up all individual project application feature modules
app.use('/api/auth', authRoutes);         // Connected to Developer 1's Module
app.use('/api/sessions', sessionRoutes); // Connected to Developer 2's Module
app.use('/api/groups', groupRoutes);     // Connected to Developer 3's Module

// Baseline System Check Verification Endpoint
app.get('/api/test-connection', async (req, res) => {
  try {
    const result = await db.query('SELECT student_id, first_name, email FROM student;');
    res.json({ status: "All database layers fully linked!", data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }clearImmediate
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CogniTrade backend engine is actively listening on port ${PORT}`);
});
