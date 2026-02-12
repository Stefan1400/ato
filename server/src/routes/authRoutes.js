const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/authControllers');

const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');

router.post(
   '/register', 
   registerController
);

router.post(
   '/login',
   loginController
)

module.exports = router;