// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessioncontroller');

// Route mapping for booking and confirmation tracking endpoints
router.post('/book', sessionController.bookSession);
router.patch('/:id/status', sessionController.updateStatus); // e.g., PATCH /api/sessions/1/status

module.exports = router;
