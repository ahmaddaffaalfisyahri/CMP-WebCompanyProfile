require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRouter     = require('./routes/auth');
const projectsRouter = require('./routes/projects');
const uploadRouter   = require('./routes/upload');
const settingsRouter = require('./routes/settings');
const messagesRouter = require('./routes/messages');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));          // Allow Vite dev server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static: serve uploaded images ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',     authRouter);
app.use('/api/login',    authRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/upload',   uploadRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/messages', messagesRouter);

// ── Root / Health check & API Overview ─────────────────────────────────────────
const renderApiStatus = (_req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>CMP Backend API</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #021f35; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
                .card { background: rgba(3, 54, 91, 0.85); border: 1px solid rgba(0, 163, 224, 0.3); border-radius: 24px; padding: 40px 32px; max-width: 460px; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.6); backdrop-filter: blur(16px); }
                .badge { display: inline-block; background: rgba(0, 163, 224, 0.15); border: 1px solid rgba(0, 163, 224, 0.35); color: #00A3E0; font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; padding: 5px 14px; border-radius: 9999px; margin-bottom: 18px; }
                h1 { color: #ffffff; margin: 0 0 10px 0; font-size: 24px; font-weight: 800; }
                p { color: #94a3b8; font-size: 13.5px; line-height: 1.6; margin: 0 0 24px 0; }
                .links { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; text-align: left; background: rgba(2, 36, 62, 0.7); padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(0, 163, 224, 0.15); }
                .link-item { display: flex; justify-content: space-between; font-size: 12px; color: #cbd5e1; text-decoration: none; }
                .link-item:hover { color: #00A3E0; }
                .link-item code { color: #00A3E0; font-family: monospace; }
                .btn { display: inline-flex; align-items: center; justify-content: center; width: 100%; background: linear-gradient(135deg, #00A3E0, #007CA7); color: white; text-decoration: none; padding: 13px 24px; border-radius: 12px; font-weight: 700; font-size: 14px; transition: all 0.2s ease; box-shadow: 0 6px 20px rgba(0, 163, 224, 0.35); box-sizing: border-box; }
                .btn:hover { background: linear-gradient(135deg, #00b2f5, #0089b8); transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0, 163, 224, 0.5); }
            </style>
        </head>
        <body>
            <div class="card">
                <span class="badge">API Status: Online</span>
                <h1>CMP Backend API</h1>
                <p>Server API backend CMP berjalan normal dan siap melayani permintaan.</p>
                <div class="links">
                    <a href="/api/health" class="link-item"><span>Health Check:</span> <code>/api/health</code></a>
                    <a href="/api/projects" class="link-item"><span>Projects Data:</span> <code>/api/projects</code></a>
                </div>
                <a href="/admin" class="btn">Buka Portal Admin</a>
            </div>
        </body>
        </html>
    `);
};

app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date() }));
app.get('/api', renderApiStatus);
app.get('/', renderApiStatus);

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Start ─────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`🚀 CMP API running at http://localhost:${PORT}`);
    });
}

module.exports = app;
