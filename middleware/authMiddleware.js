import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. Please log in first.' });
    }

    try {
        const SECRET_KEY = process.env.JWT_SECRET || 'defaultsecretkey';
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log('Decoded token:', decoded);

        // Определение устройства
        const deviceId = req.headers['user-agent'] || 'unknown-device';

        // Проверяем, есть ли токен у пользователя
        const user = await User.findOne({ email: decoded.email, "devices.token": token });

        if (!user) {
            return res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
        }

        // Проверяем, совпадает ли устройство
        const device = user.devices.find(d => d.token === token);
        if (!device || device.deviceId !== deviceId) {
            return res.status(403).json({ error: 'Token не привязан к этому устройству. Пожалуйста, войдите снова.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};
