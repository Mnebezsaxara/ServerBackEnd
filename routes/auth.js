import express from 'express';
import { login, verifyOtp, registerUser } from '../controllers/authController.js';
import { logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login); // Отправка OTP
router.post('/verify-otp', verifyOtp); // Проверка OTP
router.post('/register', registerUser); // Регистрация пользователя
router.post('/logout', logout);

export default router;
