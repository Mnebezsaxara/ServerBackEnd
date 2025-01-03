import express from 'express';
import bookingRoutes from './routes/booking.js';
import authRoutes from './routes/auth.js';
import staticRoutes from './routes/static.js';
import reviewRoutes from './routes/review.js';
import connectDB from './db.js';

// Подключение базы данных
connectDB();


const app = express();
const PORT = 8080;

app.use(express.json());

// Подключение маршрутов
app.use('/booking', bookingRoutes); // Маршруты для бронирования
app.use('/auth', authRoutes); // Маршруты для логина
app.use('/reviews', reviewRoutes); // Маршруты для отзывов
app.use('/', staticRoutes); // Маршруты для статических файлов

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
