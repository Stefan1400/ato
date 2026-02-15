const express = require('express');
const router = express.Router();
const { 
   addSessionController, 
   getSessionsController, 
   editSessionController 
} = require('../controllers/sessionControllers');

const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

const { addSessionSchema, editSessionSchema }  = require('../schemas/sessionSchemas');

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

router.patch(
   '/:sessionId',
   authMiddleware,
   validateRequest(editSessionSchema),
   editSessionController
);

module.exports = router;