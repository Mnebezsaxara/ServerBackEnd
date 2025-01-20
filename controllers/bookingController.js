import Booking from '../models/booking.js';

// Получить все бронирования с пагинацией, сортировкой и фильтрацией
export const getAllBookings = async (req, res) => {
    const { filter, sort, page = 1 } = req.query;
    const limit = 10; // Количество записей на странице
    const skip = (page - 1) * limit;

    try {
        let query = {};
        if (filter) {
            query.field = filter; // Фильтрация по полю
        }

        let sortOption = {};
        if (sort === 'date') sortOption.date = 1;
        if (sort === 'time') sortOption.time = 1;

        const totalRecords = await Booking.countDocuments(query); // Общее количество записей
        const totalPages = Math.ceil(totalRecords / limit);

        const bookings = await Booking.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.status(200).json({ data: bookings, totalPages });
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
        const booking = await Booking.create({ date, time, field });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Обновить бронирование
export const updateBooking = async (req, res) => {
    const id = req.params.id;
    try {
        const booking = await Booking.findByIdAndUpdate(id, req.body, { new: true });
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
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json({ message: 'Booking successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
