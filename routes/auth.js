import express from 'express';
import { login, registerUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login); // Логин
router.post('/register', registerUser); // Регистрация

export default router;
