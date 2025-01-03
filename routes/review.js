import express from 'express';
import { getAllReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', getAllReviews); // Получить все отзывы
router.post('/', createReview); // Добавить новый отзыв
router.put('/:id', updateReview); // Обновить отзыв
router.delete('/:id', deleteReview); // Удалить отзыв

export default router;
