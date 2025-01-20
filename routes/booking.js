import express from 'express';
import { getAllBookings, createBooking, updateBooking, deleteBooking } from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Применяем middleware ко всем маршрутам бронирования
router.get('/', authenticateToken, getAllBookings);
router.post('/', authenticateToken, createBooking);
router.put('/:id', authenticateToken, updateBooking);
router.delete('/:id', authenticateToken, deleteBooking);

export default router;
