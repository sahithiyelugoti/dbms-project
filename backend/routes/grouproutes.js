// routes/groupRoutes.js
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupcontroller');

// Define routes for creating, joining, and listing groups
router.post('/create', groupController.createGroup);
router.post('/join', groupController.joinGroup);
router.get('/student/:studentId', groupController.getStudentGroups);

module.exports = router;
