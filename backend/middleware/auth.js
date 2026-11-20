const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET;

/**
 * Generate a signed session token for authenticated admin
 */
function createToken(username) {
    const payload = {
        u: username,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days validity
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', SECRET).update(encodedPayload).digest('hex');
    return `${encodedPayload}.${signature}`;
}

/**
 * Verify signed session token
 */
function verifyToken(token) {
    if (!SECRET || !token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', SECRET).update(encodedPayload).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
        return null;
    }

    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
        if (payload.exp && payload.exp > Date.now()) {
            return payload;
        }
    } catch {
        return null;
    }
    return null;
}

/**
 * Express middleware to protect sensitive admin routes
 */
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Token autentikasi diperlukan' });
    }

    const token = authHeader.split(' ')[1];
    const verified = verifyToken(token);

    if (!verified) {
        return res.status(401).json({ error: 'Unauthorized: Sesi telah berakhir atau tidak valid' });
    }

    req.user = verified.u;
    next();
}

module.exports = {
    createToken,
    verifyToken,
    requireAuth,
};
