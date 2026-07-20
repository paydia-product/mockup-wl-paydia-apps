// Server-side logout handler — clears ALL auth cookies
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Clear ALL auth-related cookies with matching attributes
    res.setHeader('Set-Cookie', [
        `dsh_auth=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
        `dsh_role=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
        `dsh_tenant=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`,
        `dsh_mockup_unlocked=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Strict`
    ]);

    return res.status(200).json({ success: true });
}
