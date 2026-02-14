const express = require('express');
const router = express.Router();
const { addSessionController } = require('../controllers/sessionControllers');

const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const { addSessionSchema }  = require('../schemas/sessionSchemas');

router.post(
   '/',
   authMiddleware,
   validateRequest(addSessionSchema),
   addSessionController
);

module.exports = router;