const express = require('express');
const router = express.Router();
const { addSessionController, getSessionsController } = require('../controllers/sessionControllers');

const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const { addSessionSchema }  = require('../schemas/sessionSchemas');

router.post(
   '/',
   authMiddleware,
   validateRequest(addSessionSchema),
   addSessionController
);

router.get(
   '/',
   authMiddleware,
   getSessionsController
);

module.exports = router;