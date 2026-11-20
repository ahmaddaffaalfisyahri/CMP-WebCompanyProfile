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
                :root {
                    --cmp-primary: #010066;
                    --cmp-accent: #FE0000;
                    --cmp-cta: #E00000;
                    --cmp-cta-hover: #B80000;
                    --cmp-background: #FFFFFF;
                    --cmp-background-alt: #F7F7F7;
                    --cmp-border: #D8D9E2;
                    --cmp-text-secondary: #4A4F63;
                }
                body {
                    display: grid;
                    place-items: center;
                    min-height: 100vh;
                    margin: 0;
                    padding: 20px;
                    box-sizing: border-box;
                    background: var(--cmp-primary);
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                }
                .card {
                    width: 100%;
                    max-width: 460px;
                    box-sizing: border-box;
                    padding: clamp(20px, 6vw, 36px);
                    border-top: 4px solid var(--cmp-accent);
                    border-radius: 16px;
                    background: var(--cmp-background);
                    box-shadow: 0 16px 40px rgb(0 0 0 / 24%);
                }
                .status { margin: 0 0 12px; color: var(--cmp-primary); font-size: 13px; font-weight: 700; }
                h1 { margin: 0 0 12px; color: var(--cmp-primary); font-size: 28px; }
                p { margin: 0 0 24px; color: var(--cmp-text-secondary); line-height: 1.5; }
                .links {
                    display: grid;
                    gap: 12px;
                    margin-bottom: 24px;
                    padding: 16px;
                    border: 1px solid var(--cmp-border);
                    border-radius: 10px;
                    background: var(--cmp-background-alt);
                }
                .link-item {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: baseline;
                    gap: 4px 12px;
                    color: var(--cmp-primary);
                    font-size: 14px;
                    text-underline-offset: 3px;
                }
                .link-item:hover { color: var(--cmp-cta-hover); }
                .btn {
                    display: block;
                    padding: 13px 16px;
                    border-radius: 8px;
                    background: var(--cmp-cta);
                    color: var(--cmp-background);
                    font-size: 14px;
                    font-weight: 700;
                    text-align: center;
                    text-decoration: none;
                }
                .btn:hover { background: var(--cmp-cta-hover); }
                a:focus-visible { outline: 2px solid var(--cmp-primary); outline-offset: 3px; }
            </style>
        </head>
        <body>
            <main class="card">
                <p class="status">API aktif</p>
                <h1>CMP Backend API</h1>
                <p>Periksa status API atau buka data proyek.</p>
                <div class="links">
                    <a href="/api/health" class="link-item"><span>Status API</span> <code>/api/health</code></a>
                    <a href="/api/projects" class="link-item"><span>Data proyek</span> <code>/api/projects</code></a>
                </div>
                <a href="${process.env.NODE_ENV === 'production' ? '/admin' : 'http://localhost:5173/admin'}" class="btn">Buka Portal Admin</a>
            </main>
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
