import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Корневая папка для статических файлов
const publicDir = path.join(__dirname, '../public');
router.use(express.static(publicDir));

// Роут для изображений
router.get('/images/:folder/:filename', (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(publicDir, 'images', folder, filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

// Роут для видео
router.get('/videos/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(publicDir, 'videos', filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: 'Video not found' });
        }
    });
});

export default router;
