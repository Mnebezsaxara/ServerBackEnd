const serverErrorHandler = (err, req, res, next) => {
    console.error('Серверная ошибка:', err.stack); // Логируем стек ошибки для отладки

    // Ошибка подключения к базе данных (MongoDB)
    if (err.name === 'MongoNetworkError' || err.name === 'MongooseServerSelectionError') {
        return res.status(503).json({
            error: {
                message: 'Database connection failed. Please try again later.',
                status: 503,
            },
        });
    }

    // Ошибки JavaScript
    if (err instanceof ReferenceError || err instanceof TypeError || err instanceof SyntaxError) {
        return res.status(500).json({
            error: {
                message: 'Internal Server Error. Please contact support.',
                status: 500,
                details: err.message, // Подробности ошибки
            },
        });
    }

    // Обработка других критических ошибок сервера
    if (!err.status || err.status >= 500) {
        return res.status(500).json({
            error: {
                message: 'Internal Server Error',
                status: 500,
            },
        });
    }

    // Если ошибка не связана с сервером, передаём её дальше (например, для локальной обработки)
    next(err);
};

export default serverErrorHandler;
