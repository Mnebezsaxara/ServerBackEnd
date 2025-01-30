import User from '../models/user.js';
import Otp from '../models/otp.js';
import { sendEmail } from '../utils/mailer.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

const SECRET_KEY = process.env.JWT_SECRET || 'defaultsecretkey';

// Логин пользователя с OTP
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const otpCountBeforeDelete = await Otp.countDocuments({ email });
        console.log(`⚠️ Найдено OTP перед удалением: ${otpCountBeforeDelete}`);
        await Otp.deleteMany({ email, createdAt: { $lt: new Date() } });
        const otpCountAfterDelete = await Otp.countDocuments({ email });
        console.log(`✅ OTP после удаления: ${otpCountAfterDelete}`);
        
        // Генерация нового OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const newOtp = await Otp.create({ email, otp });
        console.log(`✅ OTP сохранен: ${JSON.stringify(newOtp)}`);

        const otpCheck = await Otp.findOne({ email });
        console.log(`🔍 Проверка сохраненного OTP в базе: ${JSON.stringify(otpCheck)}`);

        console.log(`Тип createdAt: ${typeof newOtp.createdAt}, значение: ${newOtp.createdAt}`);


        // Отправка OTP
        await sendEmail(email, 'Ваш код подтверждения', `Ваш код подтверждения: ${otp}`);

        res.status(200).json({ message: 'OTP отправлен на email. Проверьте почту.' });
    } catch (error) {
        console.error('Ошибка при входе:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Проверка OTP
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }

    try {
        const sanitizedOtp = otp.trim();
        const otpRecord = await Otp.findOne({ email, otp: sanitizedOtp });
        if (!otpRecord) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Удаляем все OTP пользователя после успешного входа
        await Otp.deleteMany({ email });

        // Генерация JWT
        const user = await User.findOne({ email });
        const token = jwt.sign({ userId: user._id, email }, SECRET_KEY, { expiresIn: '1h' });

        // Определение устройства
        const deviceId = req.headers['user-agent'] || 'unknown-device';

        // Удаляем старые токены и добавляем новый
        await User.updateOne({ email }, { $pull: { devices: { deviceId } } }); // Удаляем старый токен этого устройства
        await User.updateOne({ email }, { $push: { devices: { deviceId, token } } }); // Добавляем новый токен

        res.status(200).json({ message: 'Авторизация успешна', token });
    } catch (error) {
        console.error('Ошибка при проверке OTP:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const logout = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(400).json({ error: 'Token is required' });
    }

    try {
        const SECRET_KEY = process.env.JWT_SECRET || 'defaultsecretkey';
        const decoded = jwt.verify(token, SECRET_KEY);

        // Определение устройства
        const deviceId = req.headers['user-agent'] || 'unknown-device';

        // Удаление токена из списка устройств
        await User.updateOne({ email: decoded.email }, { $pull: { devices: { deviceId } } });

        res.status(200).json({ message: 'Вы успешно вышли из системы.' });
    } catch (error) {
        res.status(403).json({ error: 'Invalid token. Could not logout.' });
    }
};


// Регистрация пользователя
export const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, devices: [] });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: error.message });
    }
};
