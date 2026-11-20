const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

/**
 * Controller untuk pengelolaan file upload
 */
const uploadController = {
    UPLOAD_DIR,

    // POST /api/upload
    uploadFiles: (req, res) => {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Kembalikan public URLs yang dapat diakses via /uploads/<filename>
        const urls = req.files.map(f => `/uploads/${f.filename}`);
        res.json({ urls });
    },

    // DELETE /api/upload
    deleteFile: (req, res) => {
        const { filename } = req.body;
        if (!filename) return res.status(400).json({ error: 'filename is required' });

        // Guard against path traversal
        const safeFilename = path.basename(filename);
        const filePath = path.join(UPLOAD_DIR, safeFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlink(filePath, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to delete file' });
            res.json({ message: 'File deleted', filename: safeFilename });
        });
    }
};

module.exports = uploadController;
