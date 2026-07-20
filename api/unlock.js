// Server-side unlock handler for the mockup master gate
// Vercel Serverless Function

const CORRECT_HASH = '203f0c2eab3114690255bd711f65a6745d46a36cf63d6f482873412101360f0e'; // SHA-256 for "!Paydia1"
const UNLOCK_SECRET = 'pyd_g4t3_s1gn_k3y_2026!mX7';

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Create a signed unlock token (not just a plain "1")
async function createUnlockToken() {
    const payload = JSON.stringify({ unlocked: true, ts: Date.now() });
    const encoded = Buffer.from(payload).toString('base64');
    const signature = await sha256(encoded + ':' + UNLOCK_SECRET);
    return encoded + '.' + signature;
}

// Simple in-memory rate limiting (per serverless instance)
const attempts = new Map();
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 60000; // 1 minute

function isRateLimited(ip) {
    const now = Date.now();
    const entry = attempts.get(ip);
    if (!entry || now - entry.windowStart > WINDOW_MS) {
        attempts.set(ip, { count: 1, windowStart: now });
        return false;
    }
    entry.count++;
    if (entry.count > MAX_ATTEMPTS) return true;
    return false;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Connection', 'close');

    // Rate limit by IP
    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
        return res.status(429).json({ success: false, message: 'Terlalu banyak percobaan. Coba lagi nanti.' });
    }

    try {
        const { password } = req.body || {};

        if (!password || typeof password !== 'string') {
            return res.status(400).json({ success: false, message: 'Password required' });
        }

        // Hash the input password
        const hashedInput = await sha256(password);

        if (hashedInput !== CORRECT_HASH) {
            return res.status(401).json({ success: false, message: 'Password salah' });
        }

        // Create a signed unlock token instead of a plain "1" value
        const unlockToken = await createUnlockToken();

        // Set HttpOnly + Secure cookie with signed token
        // Valid for 7 days
        res.setHeader('Set-Cookie', [
            `dsh_mockup_unlocked=${unlockToken}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Strict`
        ]);

        return res.status(200).json({
            success: true,
            message: 'Mockup unlocked successfully'
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

// Export the secret and verify function for middleware to use
export { UNLOCK_SECRET };
