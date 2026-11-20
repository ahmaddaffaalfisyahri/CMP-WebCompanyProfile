const fs = require('fs');
const path = require('path');
const { createToken, verifyToken } = require('../middleware/auth');

const ENV_PATH = path.join(__dirname, '..', '.env');

/**
 * Helper untuk membaca admin credentials terkini
 */
function getAdminCredentials() {
    let username = process.env.ADMIN_USER || 'cmp';
    let password = process.env.ADMIN_PASSWORD;

    if (fs.existsSync(ENV_PATH)) {
        try {
            const envContent = fs.readFileSync(ENV_PATH, 'utf-8');
            const userMatch = envContent.match(/^ADMIN_USER=(.*)$/m);
            const passMatch = envContent.match(/^ADMIN_PASSWORD=(.*)$/m);
            if (userMatch && userMatch[1]) username = userMatch[1].trim();
            if (passMatch && passMatch[1]) password = passMatch[1].trim();
        } catch (e) {
            console.error('Gagal membaca .env:', e);
        }
    }
    return { username, password };
}

/**
 * Controller untuk otentikasi & konfigurasi profil admin
 */
const authController = {
    login: (req, res) => {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({
                ok: false,
                error: 'Username dan password wajib diisi'
            });
        }

        const cleanUsername = String(username).trim();
        const cleanPassword = String(password);
        const creds = getAdminCredentials();

        if (!creds.password || !process.env.AUTH_SECRET) {
            return res.status(503).json({ ok: false, error: 'Konfigurasi autentikasi admin belum lengkap' });
        }

        if (cleanUsername === creds.username && cleanPassword === creds.password) {
            const token = createToken(cleanUsername);
            return res.json({
                ok: true,
                message: 'Login berhasil! Selamat datang di CMP Admin Portal.',
                token,
                user: {
                    username: cleanUsername,
                    role: 'admin',
                    name: 'CMP Administrator'
                }
            });
        }

        return res.status(401).json({
            ok: false,
            error: 'Username atau password yang Anda masukkan salah'
        });
    },

    verify: (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ ok: false, error: 'Token tidak ditemukan' });
        }

        const token = authHeader.split(' ')[1];
        const verified = verifyToken(token);

        if (!verified) {
            return res.status(401).json({ ok: false, error: 'Sesi tidak valid atau telah kadaluarsa' });
        }

        const creds = getAdminCredentials();

        res.json({
            ok: true,
            user: {
                username: creds.username,
                role: 'admin',
                name: 'CMP Administrator'
            }
        });
    },

    // GET /api/auth/profile
    getProfile: (req, res) => {
        const creds = getAdminCredentials();
        res.json({
            ok: true,
            user: {
                username: creds.username,
                role: 'admin',
                name: 'CMP Administrator'
            }
        });
    },

    // PUT /api/auth/update-profile
    updateProfile: (req, res) => {
        const { currentPassword, newUsername, newPassword } = req.body || {};
        const creds = getAdminCredentials();

        // 1. Verifikasi password saat ini
        if (!currentPassword || String(currentPassword) !== creds.password) {
            return res.status(400).json({
                ok: false,
                error: 'Password saat ini yang Anda masukkan salah'
            });
        }

        // 2. Siapkan kredensial baru
        const updatedUsername = newUsername ? String(newUsername).trim() : creds.username;
        const updatedPassword = newPassword ? String(newPassword).trim() : creds.password;

        if (!updatedUsername) {
            return res.status(400).json({
                ok: false,
                error: 'Username tidak boleh kosong'
            });
        }

        if (newPassword && updatedPassword.length < 5) {
            return res.status(400).json({
                ok: false,
                error: 'Password baru minimal harus 5 karakter'
            });
        }

        // 3. Update file .env
        try {
            let envContent = '';
            if (fs.existsSync(ENV_PATH)) {
                envContent = fs.readFileSync(ENV_PATH, 'utf-8');
            }

            // Ganti atau tambahkan ADMIN_USER
            if (/^ADMIN_USER=.*$/m.test(envContent)) {
                envContent = envContent.replace(/^ADMIN_USER=.*$/m, `ADMIN_USER=${updatedUsername}`);
            } else {
                envContent += `\nADMIN_USER=${updatedUsername}`;
            }

            // Ganti atau tambahkan ADMIN_PASSWORD
            if (/^ADMIN_PASSWORD=.*$/m.test(envContent)) {
                envContent = envContent.replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${updatedPassword}`);
            } else {
                envContent += `\nADMIN_PASSWORD=${updatedPassword}`;
            }

            fs.writeFileSync(ENV_PATH, envContent, 'utf-8');

            // Update proses environment runtime
            process.env.ADMIN_USER = updatedUsername;
            process.env.ADMIN_PASSWORD = updatedPassword;

            // Buat token baru dengan username yang baru
            const newToken = createToken(updatedUsername);

            return res.json({
                ok: true,
                message: 'Profil dan kredensial admin berhasil diperbarui!',
                token: newToken,
                user: {
                    username: updatedUsername,
                    role: 'admin',
                    name: 'CMP Administrator'
                }
            });
        } catch (err) {
            console.error('Gagal memperbarui .env:', err);
            return res.status(500).json({
                ok: false,
                error: 'Gagal menyimpan perubahan ke server'
            });
        }
    },

    logout: (_req, res) => {
        res.json({ ok: true, message: 'Anda telah berhasil logout' });
    }
};

module.exports = authController;
