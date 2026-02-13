const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/authControllers');

const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validateRequest');
const authSchemas = require('../schemas/authSchemas');

router.post(
   '/register', 
   validate(authSchemas),
   registerController
);

router.post(
   '/login',
   validate(authSchemas),
   loginController
)

module.exports = router;