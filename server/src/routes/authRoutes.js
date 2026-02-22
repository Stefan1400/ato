const express = require('express');
const router = express.Router();
const { 
   registerController, 
   loginController, 
   logoutController, 
   deleteUserController, 
   changePasswordController,
   getUserController,
} = require('../controllers/authControllers');
const validate = require('../middleware/validateRequest');
const { registerSchema, loginSchema, changePasswordSchema } = require('../schemas/authSchemas');
const { sendNewAccessToken } = require('../controllers/refreshController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

//register
router.post(
   '/register', 
   validate(registerSchema),
   registerController
);

//login
router.post(
   '/login',
   validate(loginSchema),
   loginController
);

//refresh
router.post(
   '/refresh',
   sendNewAccessToken
);

//logout
router.post(
   '/logout',
   logoutController
);

//delete
router.delete(
   '/',
   authMiddleware,
   deleteUserController
);

//change password
router.patch(
   '/change-password',
   authMiddleware,
   validateRequest(changePasswordSchema),
   changePasswordController
);

router.get(
   '/',
   authMiddleware,
   getUserController
);

module.exports = router;