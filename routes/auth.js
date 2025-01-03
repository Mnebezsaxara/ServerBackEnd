import express from 'express';
import { login, getUser } from '../controllers/authController.js';

const router = express.Router();

router.post('/login', login); // Маршрут для логина
router.get('/user/:id', getUser); // Получение пользователя по ID

export default router;
