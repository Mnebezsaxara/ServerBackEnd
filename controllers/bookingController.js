import Booking from '../models/booking.js';

// Получить все бронирования
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find(); // Чтение данных из MongoDB
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Создать новое бронирование
export const createBooking = async (req, res) => {
    const { date, time, field } = req.body;
    if (!date || !time || !field) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const booking = await Booking.create({ date, time, field }); // Сохранение данных в MongoDB
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Обновить бронирование
export const updateBooking = async (req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true }); // Обновление данных в MongoDB
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Удалить бронирование
export const deleteBooking = async (req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findByIdAndDelete(id); // Удаление данных из MongoDB
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
