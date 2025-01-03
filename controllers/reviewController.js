const reviews = []; // Временное хранилище для отзывов

// Получить все отзывы
export const getAllReviews = (req, res) => {
    res.status(200).json(reviews);
};

// Создать новый отзыв
export const createReview = (req, res) => {
    const { userName, text, rating, place } = req.body;
    if (!userName || !text || !rating || !place) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const newReview = {
        id: reviews.length + 1,
        userName,
        text,
        rating,
        place,
        date: new Date().toISOString()
    };
    reviews.push(newReview);
    res.status(201).json(newReview);
};

// Обновить отзыв
export const updateReview = (req, res) => {
    const id = parseInt(req.params.id);
    const { text, rating } = req.body;
    const review = reviews.find(r => r.id === id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    if (text) review.text = text;
    if (rating) review.rating = rating;
    res.status(200).json(review);
};

// Удалить отзыв
export const deleteReview = (req, res) => {
    const id = parseInt(req.params.id);
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ error: 'Review not found' });
    reviews.splice(index, 1);
    res.status(204).send();
};
