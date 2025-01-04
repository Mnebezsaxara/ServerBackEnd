import express from 'express';
import cors from 'cors';
import bookingRoutes from './routes/booking.js';
import authRoutes from './routes/auth.js';
import staticRoutes from './routes/static.js';
import connectDB from './db.js';

// Подключение базы данных
connectDB();


const app = express();
const PORT = 8080;

app.use(express.json());

// Подключение CORS
app.use(cors()); // Разрешает запросы со всех доменов

// Подключение маршрутов
app.use('/booking', bookingRoutes); // Маршруты для бронирования
app.use('/auth', authRoutes); // Маршруты для логина
app.use('/', staticRoutes); // Маршруты для статических файлов

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
