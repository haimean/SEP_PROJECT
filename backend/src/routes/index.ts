import express from 'express';
import multer from 'multer';
import { ConversionController } from '../controllers/conversionController';

const router = express.Router();
const controller = new ConversionController();

// Cấu hình multer cho upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Only JSON files are allowed'));
    }
  },
});

// Routes
router.post('/upload', upload.single('file'), (req, res) => controller.uploadFile(req, res));
router.post('/convert', (req, res) => controller.convertData(req, res));
router.get('/stats/:fileId', (req, res) => controller.getStats(req, res));
router.get('/preview/:fileId', (req, res) => controller.previewData(req, res));
router.delete('/file/:fileId', (req, res) => controller.deleteFile(req, res));

export default router;