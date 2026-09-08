// Server-side login handler — multi-role authentication
// Vercel Serverless Function

const CORRECT_HASH = '203f0c2eab3114690255bd711f65a6745d46a36cf63d6f482873412101360f0e';
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'pyd_s3cR3t_k3y_r3c0n_2026!xZ9';

// Valid credentials mapping
const VALID_ACCOUNTS = {
    // Internal admin
    'admin@paydia.id': { role: 'internal', tenantId: null },
    // Partners
    'partner@danaku.id': { role: 'partner', tenantId: 'TNT-001' },
    'partner@payease.id': { role: 'partner', tenantId: 'TNT-002' },
    'farhanfauzan119@gmail.com': { role: 'partner', tenantId: 'TNT-003' },
    'testing.ga@gmail.com': { role: 'partner', tenantId: 'TNT-004' },
    'support@elangindo.com': { role: 'partner', tenantId: 'TNT-005' },
    'support@obsidia.com': { role: 'partner', tenantId: 'TNT-006' },
    'kuncoro@lumina.com': { role: 'partner', tenantId: 'TNT-007' },
    'cs.supp@clangteknoplay.com': { role: 'partner', tenantId: 'TNT-008' },
    'lumtek@gmail.com': { role: 'partner', tenantId: 'TNT-009' },
    'cs@stratos.com': { role: 'partner', tenantId: 'TNT-010' },
    'incarnate.maria@pt-mfa.com': { role: 'partner', tenantId: 'TNT-011' },
    'dion@paydia.id': { role: 'partner', tenantId: 'TNT-012' },
    'partner@nusumma.co.id': { role: 'partner', tenantId: 'NUS-001' }
};

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createToken(email, role, tenantId) {
    const payload = JSON.stringify({
        email,
        role,
        tenantId: tenantId || '',
        ts: Date.now()
    });
    const encoded = Buffer.from(payload).toString('base64');
    const signature = await sha256(encoded + ':' + TOKEN_SECRET);
    return encoded + '.' + signature;
}

export async function verifyToken(token) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [encoded, signature] = parts;
    const expectedSignature = await sha256(encoded + ':' + TOKEN_SECRET);
    if (signature !== expectedSignature) return false;
    try {
        const payload = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
        // Check token is not older than 24 hours
        const age = Date.now() - payload.ts;
        if (age > 86400000) return false;
        return payload;
    } catch (e) {
        return false;
    }
}

// Simple in-memory rate limiting (per serverless instance)
const attempts = new Map();
const MAX_ATTEMPTS = 15;
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
        const { email, password, role } = req.body || {};

        if (!email || typeof email !== 'string') {
            return res.status(400).json({ success: false, message: 'Email required' });
        }

        const emailLower = email.toLowerCase().trim();
        const account = VALID_ACCOUNTS[emailLower];

        if (!account) {
            return res.status(401).json({ success: false, message: 'Email tidak terdaftar' });
        }

        // Validate role matches
        if (role && account.role !== role) {
            return res.status(401).json({ success: false, message: 'Role tidak cocok dengan email ini' });
        }

        // Create signed token with role info
        const token = await createToken(emailLower, account.role, account.tenantId);

        // Set HttpOnly + Secure cookies
        // FIX: dsh_role is now also HttpOnly to prevent client-side tampering
        res.setHeader('Set-Cookie', [
            `dsh_auth=${token}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict`,
            `dsh_role=${account.role}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict`,
            `dsh_tenant=${account.tenantId || ''}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=Strict`
        ]);

        return res.status(200).json({
            success: true,
            role: account.role,
            tenantId: account.tenantId,
            email: emailLower
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}
