import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
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
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        res.status(403).json({ error: 'Invalid or expired token. Please log in again.' });
    }
};
