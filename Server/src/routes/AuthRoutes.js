// Routes for Authentication (Login, Register, etc.)
import express from 'express';
import { AuthRegister } from '../controller/AuthController.js';

const router = express.Router();

// Authentication Routes
router.post('/register', AuthRegister);




export default router;