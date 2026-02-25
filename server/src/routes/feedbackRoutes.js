const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');

const { getFeedbackController } = require('../controllers/feedbackController');

router.get(
   '/',
   authMiddleware,
   getFeedbackController
);

module.exports = router;