        import User from '../models/user.js';
        import jwt from 'jsonwebtoken';

        const SECRET_KEY = 'Sportlife111';

        // Логин пользователя с JWT
        export const login = async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }
            try {
                const user = await User.findOne({ email }); // Ищем пользователя по email
                if (!user || user.password !== password) { // Проверяем, совпадает ли пароль
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                // Генерация JWT токена
                const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ message: 'Login successful', token });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };

        // Регистрация пользователя
        export const registerUser = async (req, res) => {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }
            try {
                const user = new User({ email, password });
                await user.save(); // Сохраняем нового пользователя в базе данных
                res.status(201).json(user);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        };

    