const express = require('express');
const router = express.Router();
const { 
   registerController, 
   loginController,
   createGuestController,
   convertGuestToUserController,
   logoutController, 
   deleteUserController, 
   changePasswordController,
   getUserController,
} = require('../controllers/authControllers');
const validate = require('../middleware/validateRequest');
const { registerSchema, loginSchema, changePasswordSchema } = require('../schemas/authSchemas');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

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
   '/guest',
   createGuestController
);

router.post(
   '/convert',
   authMiddleware,
   validate(registerSchema),
   convertGuestToUserController
);

router.post(
   '/logout',
   logoutController
);

router.delete(
   '/',
   authMiddleware,
   deleteUserController
);

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