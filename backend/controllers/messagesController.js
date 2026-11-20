const fs = require('fs');
const path = require('path');

const MESSAGES_FILE = path.join(__dirname, '..', 'data', 'messages.json');

function getMessages() {
    if (!fs.existsSync(MESSAGES_FILE)) {
        fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2), 'utf-8');
        return [];
    }
    try {
        const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveMessages(data) {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const messagesController = {
    // GET /api/messages (Admin only)
    getAll: (_req, res) => {
        const messages = getMessages();
        // Sort descending by created_at
        messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        res.json({ ok: true, data: messages });
    },

    // POST /api/messages (Public form submission)
    create: (req, res) => {
        const { name, email, phone, subject, message } = req.body || {};
        if (!name || !email || !message) {
            return res.status(400).json({ ok: false, error: 'Nama, email, dan pesan wajib diisi.' });
        }

        const messages = getMessages();
        const newMessage = {
            id: 'msg_' + Date.now() + '_' + Math.round(Math.random() * 1e4),
            name: String(name).trim(),
            email: String(email).trim(),
            phone: phone ? String(phone).trim() : '-',
            subject: subject ? String(subject).trim() : 'Pertanyaan Umum',
            message: String(message).trim(),
            status: 'unread', // 'unread' | 'contacted'
            created_at: new Date().toISOString()
        };

        messages.push(newMessage);
        saveMessages(messages);

        res.status(201).json({
            ok: true,
            message: 'Terima kasih! Pesan Anda telah kami terima.',
            data: newMessage
        });
    },

    // PUT /api/messages/:id/status (Admin toggle status)
    updateStatus: (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const messages = getMessages();
        const idx = messages.findIndex(m => m.id === id);

        if (idx === -1) {
            return res.status(404).json({ ok: false, error: 'Pesan tidak ditemukan' });
        }

        messages[idx].status = status || (messages[idx].status === 'unread' ? 'contacted' : 'unread');
        saveMessages(messages);

        res.json({ ok: true, message: 'Status pesan diperbarui', data: messages[idx] });
    },

    // DELETE /api/messages/:id (Admin delete message)
    delete: (req, res) => {
        const { id } = req.params;
        let messages = getMessages();
        const initialLen = messages.length;
        messages = messages.filter(m => m.id !== id);

        if (messages.length === initialLen) {
            return res.status(404).json({ ok: false, error: 'Pesan tidak ditemukan' });
        }

        saveMessages(messages);
        res.json({ ok: true, message: 'Pesan berhasil dihapus' });
    }
};

module.exports = messagesController;
