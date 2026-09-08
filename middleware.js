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

    // Nusumma portal — mirrors the rules above, once unlocked.
    if (pathname === '/nusumma/login.html') {
        return;
    }

    if (pathname.startsWith('/nusumma/app-preview/') || pathname === '/nusumma/app-preview') {
        return;
    }

    // Static assets (logos, data-nusumma.js) must be reachable for an
    // unlocked user who does not have a dsh_auth cookie yet — the
    // unauthenticated branch below redirects to /nusumma/login.html BEFORE
    // reaching the generic "allow other static assets" fall-through at the
    // bottom of this function, so without this the Nusumma login page would
    // render unstyled and its scripts would 404-redirect.
    if (pathname.startsWith('/nusumma/assets/') || pathname === '/nusumma/data-nusumma.js') {
        return;
    }

    if (pathname === '/nusumma' || pathname === '/nusumma/' || pathname === '/nusumma/index.html') {
        url.pathname = '/nusumma/login.html';
        return Response.redirect(url, 302);
    }

    // Check for signed auth cookie
    const token = cookies['dsh_auth'];

    const payload = token ? await verifyToken(token) : false;

    if (!payload) {
        url.pathname = pathname.startsWith('/nusumma/') ? '/nusumma/login.html' : '/login.html';
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

    // Partner dashboard pages — allowed for both internal and partner roles.
    // A tenantId is only ever minted for role:'partner' — internal tokens
    // carry no tenantId (or ''), so the NUS- prefix check must only apply
    // when a tenantId is actually present, otherwise internal is locked out.
    const tenantId = payload.tenantId || '';
    if (pathname.startsWith('/partner/') || pathname === '/partner') {
        const wrongSurface = tenantId.startsWith('NUS-');
        if ((role !== 'partner' && role !== 'internal') || wrongSurface) {
            url.pathname = '/login.html';
            return Response.redirect(url, 302);
        }
    }

    // Nusumma partner dashboard pages — mirrors /partner/* above, requiring
    // the token's tenantId to belong to the Nusumma (NUS-) surface so a
    // Paydia-tenant session cannot open the Nusumma dashboard.
    if (pathname.startsWith('/nusumma/partner/') || pathname === '/nusumma/partner') {
        const wrongSurface = !tenantId.startsWith('NUS-');
        if ((role !== 'partner' && role !== 'internal') || wrongSurface) {
            url.pathname = '/nusumma/login.html';
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
