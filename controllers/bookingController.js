const bookings = [];

export const getAllBookings = (req, res) => {
    res.status(200).json(bookings);
};

export const createBooking = (req, res) => {
    const { date, time, field } = req.body;
    if (!date || !time || !field) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const newBooking = { id: bookings.length + 1, date, time, field };
    bookings.push(newBooking);
    res.status(201).json(newBooking);
};

export const updateBooking = (req, res) => {
    const id = parseInt(req.params.id);
    const { date, time, field } = req.body;
    const booking = bookings.find(b => b.id === id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (date) booking.date = date;
    if (time) booking.time = time;
    if (field) booking.field = field;
    res.status(200).json(booking);
};

export const deleteBooking = (req, res) => {
    const id = parseInt(req.params.id);
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) return res.status(404).json({ error: 'Booking not found' });
    bookings.splice(index, 1);
    res.status(204).send();
};
