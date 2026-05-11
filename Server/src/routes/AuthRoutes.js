// Routes for Authentication (Login, Register, etc.)
import express from 'express';
import { AuthRegister, AuthLogin, LogoutUser, GetUserProfile } from '../controller/AuthController.js';
import { protect } from '../middleware/AuthMiddleware.js';

const router = express.Router();

// Authentication Routes
router.post('/register', AuthRegister);
router.post('/login', AuthLogin);
router.post('/logout', LogoutUser);
router.get('/profile', protect, GetUserProfile);

export default router;
