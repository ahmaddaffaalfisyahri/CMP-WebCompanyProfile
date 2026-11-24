const fs = require('node:fs');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const { UPLOAD_DIR } = require('./uploadController');

const FILE = path.join(__dirname, '..', 'data', 'appearance.json');
const sectionPhotos = new Set(['heroMain', 'heroTop', 'heroBottom', 'aboutTeam', 'vision']);
const textLimits = {
    heroTitle: 120,
    heroDescription: 450,
    projectSolutions: 36,
    address: 400,
    phone: 48,
    email: 254,
};

function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isLegacyPortfolioSlot(slot) {
    return /^cmp-\d{1,3}-\d{1,2}$/.test(slot);
}

function isUploadedPhoto(value) {
    if (typeof value !== 'string' || !/^\/uploads\/[\w.-]+\.(jpe?g|png|webp|gif)$/i.test(value)) return false;
    return fs.statSync(path.join(UPLOAD_DIR, path.basename(value)), { throwIfNoEntry: false })?.isFile() === true;
}

function validateAppearance(body, savedPhotos) {
    if (!isRecord(body) || !isRecord(body.text) || !isRecord(body.photos)) return null;
    const { text, photos } = body;
    const cleanText = {};

    for (const [name, value] of Object.entries(text)) {
        if (name === 'establishedYear' || name === 'disciplineCount') {
            const min = name === 'establishedYear' ? 1800 : 1;
            const max = name === 'establishedYear' ? new Date().getFullYear() : 99;
            if (!Number.isInteger(value) || value < min || value > max) return null;
            cleanText[name] = value;
            continue;
        }
        if (!Object.hasOwn(textLimits, name) || typeof value !== 'string') return null;
        const trimmed = value.trim();
        if (!trimmed || trimmed.length > textLimits[name]) return null;
        if (name === 'heroTitle' && (trimmed.split('\n').length > 3 || trimmed.split('\n').some(line => !line.trim()))) return null;
        if (name === 'phone' && !/[0-9]/.test(trimmed)) return null;
        if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
        cleanText[name] = trimmed;
    }

    // Keep overrides published before the portfolio editor was removed.
    const cleanPhotos = Object.fromEntries(
        Object.entries(savedPhotos).filter(([slot]) => isLegacyPortfolioSlot(slot)),
    );
    for (const [slot, value] of Object.entries(photos)) {
        if (isLegacyPortfolioSlot(slot) && cleanPhotos[slot] === value) continue;
        if (!sectionPhotos.has(slot) || !isUploadedPhoto(value)) return null;
        cleanPhotos[slot] = value;
    }

    return { text: cleanText, photos: cleanPhotos };
}

function readAppearance() {
    try {
        const raw = fs.readFileSync(FILE, 'utf8');
        const revision = createHash('sha256').update(raw).digest('hex');
        return { ...JSON.parse(raw), revision };
    } catch (error) {
        if (error.code === 'ENOENT') return { text: {}, photos: {}, revision: null };
        throw error;
    }
}

function saveAppearance(appearance) {
    const temporaryFile = `${FILE}.${randomUUID()}.tmp`;
    const raw = JSON.stringify(appearance, null, 2) + '\n';
    try {
        fs.writeFileSync(temporaryFile, raw, { flag: 'wx' });
        fs.renameSync(temporaryFile, FILE);
    } finally {
        fs.rmSync(temporaryFile, { force: true });
    }
    return createHash('sha256').update(raw).digest('hex');
}

module.exports = {
    getAppearance: (_req, res) => {
        try {
            res.set('Cache-Control', 'no-store').json({ ok: true, data: readAppearance() });
        } catch (error) {
            console.error('Gagal membaca pengaturan tampilan:', error.code || error.name);
            res.status(500).json({ ok: false, error: 'Gagal membaca pengaturan tampilan.' });
        }
    },
    updateAppearance: (req, res) => {
        try {
            const current = readAppearance();
            const appearance = validateAppearance(req.body, current.photos || {});
            if (!appearance) {
                return res.status(400).json({ ok: false, error: 'Periksa isi pengaturan dan pastikan foto yang dipilih masih tersedia.' });
            }
            if (req.body.revision !== current.revision) {
                return res.status(409).json({ ok: false, error: 'Pengaturan sudah diperbarui di tempat lain. Buka ulang panel sebelum menyimpan.' });
            }
            const revision = saveAppearance(appearance);
            res.json({ ok: true, data: { ...appearance, revision } });
        } catch (error) {
            console.error('Gagal menyimpan pengaturan tampilan:', error.code || error.name);
            res.status(500).json({ ok: false, error: 'Gagal menyimpan pengaturan tampilan.' });
        }
    },
};
