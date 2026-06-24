import { Router } from 'express';
import { AuthRegister, AuthLogin, LogoutUser, GetUserProfile } from '../controller/AuthController.js';
import { protect } from '../middleware/AuthMiddleware.js';
import validate from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../validators/authValidators.js';

const router = Router();

router.post('/register', validate(registerSchema), AuthRegister);
router.post('/login', validate(loginSchema), AuthLogin);
router.post('/logout', LogoutUser);
router.get('/profile', protect, GetUserProfile);

export default router;
