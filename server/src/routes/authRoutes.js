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

//guest account
router.post(
   '/guest',
   createGuestController
);

//convert guest to normal account
router.post(
   '/convert',
   authMiddleware,
   validate(registerSchema),
   convertGuestToUserController
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

//get user
router.get(
   '/',
   authMiddleware,
   getUserController
);

module.exports = router;