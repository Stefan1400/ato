const express = require('express');
const router = express.Router();
const { registerController, loginController, logoutController } = require('../controllers/authControllers');
const validate = require('../middleware/validateRequest');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');
const { sendNewAccessToken } = require('../controllers/refreshController');

router.post(
   '/register', 
   validate(registerSchema),
   registerController
);

router.post(
   '/login',
   validate(loginSchema),
   loginController
);

router.post(
   '/refresh',
   sendNewAccessToken
);

router.post(
   '/logout',
   logoutController
);

module.exports = router;