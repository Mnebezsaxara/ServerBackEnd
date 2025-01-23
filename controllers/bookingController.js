import Booking from '../models/booking.js';

export const getAllBookings = async (req, res) => {
    const { filter, sort, page = 1 } = req.query;
    const limit = 10; // Количество записей на странице
    const skip = (page - 1) * limit;

    try {
        let query = { email: req.user.email }; // Показывать бронирования только для текущего пользователя
        if (filter) {
            query.field = filter; // Фильтрация по полю
        }

        let sortOption = {};
        if (sort === 'date') sortOption.date = 1;
        if (sort === 'time') sortOption.time = 1;

        console.log('Запрос к базе данных:', query); // Лог фильтра
        console.log('Пагинация: пропуск', skip, 'лимит', limit);

        const totalRecords = await Booking.countDocuments(query); // Общее количество записей
        const totalPages = Math.ceil(totalRecords / limit);

        const bookings = await Booking.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        console.log('Найденные бронирования:', bookings); // Лог бронирований

        res.status(200).json({ data: bookings, totalPages });
    } catch (error) {
        console.error('Ошибка при получении бронирований:', error.message);
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
        const booking = await Booking.create({ 
            date, 
            time, 
            field, 
            email: req.user.email // Используем email пользователя
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Обновить бронирование
export const updateBooking = async (req, res) => {
    const { email, date, time, field, newDate, newTime, newField } = req.body;

    if (!email || !date || !time || !field) {
        return res.status(400).json({ error: 'All fields are required for update' });
    }

    try {
        const booking = await Booking.findOneAndUpdate(
            { email, date, time, field }, // Поиск по email и параметрам бронирования
            { date: newDate || date, time: newTime || time, field: newField || field }, // Обновление
            { new: true }
        );
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Удалить бронирование
export const deleteBooking = async (req, res) => {
    const { email, date, time, field } = req.body;

    if (!email || !date || !time || !field) {
        return res.status(400).json({ error: 'All fields are required for deletion' });
    }

    try {
        const booking = await Booking.findOneAndDelete({ email, date, time, field });
        if (!booking) return res.status(404).json({ error: 'Booking not found' });
        res.status(200).json({ message: 'Booking successfully deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
