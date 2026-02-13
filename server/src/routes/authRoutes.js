const express = require('express');
const router = express.Router();
const { registerController, loginController } = require('../controllers/authControllers');

const authMiddleware = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const validate = require('../middleware/validateRequest');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

router.post(
   '/register', 
   validate(registerSchema),
   registerController
);

router.post(
   '/login',
   validate(loginSchema),
   loginController
)

module.exports = router;