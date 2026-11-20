const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { requireAuth } = require('../middleware/auth');

// ── Multer Storage Config ─────────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadController.UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
        cb(null, unique + path.extname(file.originalname));
    },
});

const fileFilter = (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase())
            && allowed.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// ── Routes ────────────────────────────────────────────────────────────────────
router.post('/', requireAuth, upload.array('images', 20), uploadController.uploadFiles);
router.delete('/', requireAuth, uploadController.deleteFile);

module.exports = router;
