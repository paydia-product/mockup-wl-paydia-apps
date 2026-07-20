const TOKEN_SECRET = process.env.TOKEN_SECRET || 'pyd_s3cR3t_k3y_r3c0n_2026!xZ9';
const UNLOCK_SECRET = 'pyd_g4t3_s1gn_k3y_2026!mX7';

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyToken(token) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [encoded, signature] = parts;
    const expectedSignature = await sha256(encoded + ':' + TOKEN_SECRET);
    if (signature !== expectedSignature) return false;
    try {
        const raw = atob(encoded);
        const payload = JSON.parse(raw);
        const age = Date.now() - payload.ts;
        if (age > 86400000) return false;
        return payload;
    } catch (e) {
        return false;
    }
}

// Verify the signed unlock token (not just "1")
async function verifyUnlockToken(token) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [encoded, signature] = parts;
    const expectedSignature = await sha256(encoded + ':' + UNLOCK_SECRET);
    if (signature !== expectedSignature) return false;
    try {
        const raw = atob(encoded);
        const payload = JSON.parse(raw);
        // Check unlock token age (7 days max)
        const age = Date.now() - payload.ts;
        if (age > 604800000) return false;
        return payload.unlocked === true;
    } catch (e) {
        return false;
    }
}

function parseCookies(cookieHeader) {
    const cookies = {};
    if (!cookieHeader) return cookies;
    cookieHeader.split(';').forEach(c => {
        const [key, ...rest] = c.trim().split('=');
        if (key) cookies[key.trim()] = rest.join('=').trim();
    });
    return cookies;
}

export default async function middleware(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Bypass check for assets/endpoints needed to unlock the mockup
    if (pathname === '/gate.html' || 
        pathname === '/api/unlock' || 
        pathname === '/favicon.ico' || 
        pathname.startsWith('/shared/')) {
        return;
    }

    // Parse cookies
    const cookieHeader = request.headers.get('cookie') || '';
    const cookies = parseCookies(cookieHeader);

    // 2. Check if mockup is unlocked via master password (now verified with HMAC signature)
    const unlockToken = cookies['dsh_mockup_unlocked'];
    const isUnlocked = await verifyUnlockToken(unlockToken);
    if (!isUnlocked) {
        const gateUrl = new URL('/gate.html', request.url);
        // Save the original path to redirect back after unlocking
        // FIX: Only allow relative paths to prevent open redirect
        const safePath = (pathname + url.search).replace(/^\/+/, '/');
        if (safePath.startsWith('/') && !safePath.startsWith('//')) {
            gateUrl.searchParams.set('next', safePath);
        } else {
            gateUrl.searchParams.set('next', '/login.html');
        }
        return Response.redirect(gateUrl, 302);
    }

    // Allow API routes once unlocked
    if (pathname.startsWith('/api/')) {
        return;
    }

    // Allow app-preview without role authentication (public demo, but needs gate unlocked)
    if (pathname.startsWith('/app-preview/') || pathname === '/app-preview') {
        return;
    }

    // Allow login page (navigation portal) once unlocked
    if (pathname === '/login.html') {
        return;
    }

    // Check for signed auth cookie
    const token = cookies['dsh_auth'];

    const payload = token ? await verifyToken(token) : false;

    if (!payload) {
        url.pathname = '/login.html';
        return Response.redirect(url, 302);
    }

    // FIX: Role is now ONLY derived from the signed token, never from an unsigned cookie
    const role = payload.role;

    // Internal dashboard pages — only internal role
    if (pathname.startsWith('/internal/') || pathname === '/internal') {
        if (role !== 'internal') {
            url.pathname = '/login.html';
            return Response.redirect(url, 302);
        }
    }

    // Partner dashboard pages — allowed for both internal and partner roles
    if (pathname.startsWith('/partner/') || pathname === '/partner') {
        if (role !== 'partner' && role !== 'internal') {
            url.pathname = '/login.html';
            return Response.redirect(url, 302);
        }
    }

    // Root base URL or index.html — redirect to portal page
    if (pathname === '/' || pathname === '/index.html') {
        url.pathname = '/login.html';
        return Response.redirect(url, 302);
    }

    // Allow other static assets (.css, .js, images) for authenticated users
}

export const config = {
    matcher: ['/((?!_next/static|_next/image).*)'],
};
