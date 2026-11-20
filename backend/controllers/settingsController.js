const fs = require('fs');
const path = require('path');

const SETTINGS_FILE = path.join(__dirname, '..', 'data', 'settings.json');

// Default initial settings based on frontend defaults
const defaultSettings = {
    hero: {
        establishedYear: 1997,
        countriesCount: 7,
        yearsExperience: 25,
        typewriterPhrases: [
            "Marine & Coal Mining Solutions",
            "Engineering, Procurement, and Construction",
            "Automation & System Integration",
            "Software & Control Systems"
        ]
    },
    contact: {
        address: "Jl. Rungkut Industri III No. 55, Surabaya, Jawa Timur, Indonesia",
        phone: "+62 31 843 1234",
        whatsapp: "+62 812 3456 7890",
        email: "info@ciptamajupersada.com",
        mapsUrl: "https://maps.google.com"
    }
};

function getSettings() {
    if (!fs.existsSync(SETTINGS_FILE)) {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify(defaultSettings, null, 2), 'utf-8');
        return defaultSettings;
    }
    try {
        const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return defaultSettings;
    }
}

function saveSettings(data) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const settingsController = {
    getSettings: (_req, res) => {
        res.json({ ok: true, data: getSettings() });
    },

    updateSettings: (req, res) => {
        const current = getSettings();
        const updated = {
            hero: { ...current.hero, ...(req.body.hero || {}) },
            contact: { ...current.contact, ...(req.body.contact || {}) }
        };
        saveSettings(updated);
        res.json({ ok: true, message: 'Pengaturan website berhasil diperbarui!', data: updated });
    }
};

module.exports = settingsController;
