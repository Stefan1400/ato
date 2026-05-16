const express = require('express');
const router = express.Router();
const { 
   addSessionController, 
   getSessionsController, 
   editSessionController,
   deleteSessionController
} = require('../controllers/sessionControllers');

const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const { addSessionSchema } = require('../schemas/sessionSchemas');

//add session
router.post(
   '/',
   authMiddleware,
   validateRequest(addSessionSchema),
   addSessionController
);

//get sessions by date
router.get(
   '/',
   authMiddleware,
   getSessionsController
);

module.exports = router;