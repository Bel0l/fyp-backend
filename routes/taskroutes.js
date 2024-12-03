// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../Controllers/taskController');
const {protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('supervisor'), createTask);
router.get('/', protect, authorize('student','supervisor'), getTasks);

module.exports = router;
