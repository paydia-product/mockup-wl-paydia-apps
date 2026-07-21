/* =============================================
   Paydia White Label — Version History Widget
   =============================================
   Per-surface version registries + a self-contained
   "version pill + panel" widget mounted into each
   surface's header. Injects its own CSS once (id-guarded)
   so it works across every page without touching the
   per-surface stylesheets.
   ============================================= */

(function () {
    'use strict';

    // ── Version Registries (newest first) ──
    window.PaydiaVersions = {
        admin: [
            {
                version: 'v1.5.0',
                date: '2026-07-21',
                deployed: true,
                latest: true,
                summary: 'Menambahkan widget riwayat versi di header dashboard internal.',
                changes: [
                    'Widget dropdown versi baru di pojok kanan atas setiap halaman',
                    'Pencarian versi langsung di dalam panel'
                ]
            },
            {
                version: 'v1.4.0',
                date: '2026-06-01',
                deployed: false,
                latest: false,
                summary: 'Penataan ulang menu sidebar & modul transaksi.',
                changes: [
                    'Submenu Transaction: Payin, QRIS MPM/CPM, App Users, Topup Manual, Auto Reporting',
                    'Log Perubahan pada detail merchant',
                    'Badge "WIP" pada modul yang belum final'
                ]
            },
            {
                version: 'v1.3.0',
                date: '2026-04-15',
                deployed: false,
                latest: false,
                summary: 'Rilis awal dashboard internal dengan approval & audit log.',
                changes: [
                    'Approval permintaan tenant baru',
                    'Log audit aktivitas admin',
                    'Manajemen QRIS MPM & CPM'
                ]
            }
        ],
        partner: [
            {
                version: 'v2.3.0',
                date: '2026-07-21',
                deployed: true,
                latest: true,
                summary: 'Menambahkan widget riwayat versi di header Paydia Bisnis.',
                changes: [
                    'Widget dropdown versi baru di header partner',
                    'Pencarian versi instan di dalam panel'
                ]
            },
            {
                version: 'v2.2.0',
                date: '2026-06-01',
                deployed: false,
                latest: false,
                summary: 'Re-layout dashboard dengan header penuh & sidebar baru.',
                changes: [
                    'Header full-width dengan sidebar di bawahnya',
                    'Navigasi ke App Whitelabel, Dashboard Tenant Lain, dan Dashboard Internal',
                    'Font & warna teks sidebar diperjelas'
                ]
            },
            {
                version: 'v2.1.0',
                date: '2026-04-20',
                deployed: false,
                latest: false,
                summary: 'Penambahan halaman Customize, Content, dan Members.',
                changes: [
                    'Kustomisasi tema aplikasi whitelabel',
                    'Manajemen konten legal & kontak support',
                    'Manajemen anggota tim partner'
                ]
            }
        ],
        app: [
            {
                version: 'v5.4.0',
                date: '2026-07-21',
                deployed: true,
                latest: true,
                summary: 'Splash screen bertema per-vendor & widget riwayat versi.',
                changes: [
                    'Splash screen full-screen dengan warna, logo, dan nama aplikasi sesuai vendor',
                    'Animasi transisi splash saat berpindah tenant',
                    'Widget riwayat versi di toolbar preview'
                ]
            },
            {
                version: 'v5.3.0',
                date: '2026-06-15',
                deployed: false,
                latest: false,
                summary: 'Sinkronisasi live dari Dashboard Partner.',
                changes: [
                    'Update konfigurasi tenant secara realtime lintas tab',
                    'Switcher tenant di toolbar preview',
                    'Navigasi cepat ke Dashboard Internal & Partner'
                ]
            },
            {
                version: 'v5.2.0',
                date: '2026-05-01',
                deployed: false,
                latest: false,
                summary: 'Peluncuran preview aplikasi whitelabel.',
                changes: [
                    'Simulasi layar Home, Riwayat, QRIS, Notifikasi, dan Profil',
                    'Tema warna dinamis per tenant'
                ]
            }
        ]
    };

    // ── Relative Time Helper ──
    function relativeLabel(dateStr) {
        const then = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.round((today - then) / 86400000);
        if (diffDays <= 0) return 'hari ini';
        if (diffDays === 1) return 'kemarin';
        return diffDays + ' hari lalu';
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // ── Inject Widget CSS (once) ──
    function injectStyles() {
        if (document.getElementById('pvw-styles')) return;
        const style = document.createElement('style');
        style.id = 'pvw-styles';
        style.textContent = `
/* Hallmark · component: version-widget · genre: modern-minimal · theme: paydia-indigo
 * states: default · hover · focus-visible · active
 */
.pvw-root { position: relative; display: inline-block; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
.pvw-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: #fff; border: 1px solid #E2E8F0; border-radius: 20px;
    padding: 6px 12px 6px 14px; cursor: pointer; font-family: inherit;
    font-size: 0.78rem; color: #1E293B; transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
    line-height: 1.3;
}
.pvw-pill:hover { border-color: #2c37b7; box-shadow: 0 1px 4px rgba(44,55,183,0.14); }
.pvw-pill:active { transform: translateY(1px); }
.pvw-pill:focus-visible { outline: 2px solid #2c37b7; outline-offset: 2px; }
.pvw-pill-icon { color: #2c37b7; font-size: 0.72rem; }
.pvw-pill-version { font-weight: 700; color: #1E293B; }
.pvw-pill-latest {
    font-size: 0.62rem; font-weight: 700; color: #10B981; background: rgba(16,185,129,0.12);
    border-radius: 10px; padding: 2px 7px; letter-spacing: 0.01em;
}
.pvw-pill-chevron { font-size: 0.62rem; color: #94A3B8; transition: transform 150ms ease; }
.pvw-pill[aria-expanded="true"] .pvw-pill-chevron { transform: rotate(180deg); }

.pvw-panel {
    display: none; position: absolute; top: calc(100% + 8px); right: 0;
    width: 440px; max-width: min(440px, 92vw); max-height: min(70vh, 520px); overflow-y: auto;
    background: #fff; border: 1px solid #E2E8F0; border-radius: 14px;
    box-shadow: 0 20px 40px -8px rgba(15,23,42,0.18), 0 4px 12px rgba(15,23,42,0.08);
    z-index: 2000; padding: 12px; opacity: 0; transform: translateY(-4px) scale(0.98);
    transition: opacity 160ms ease, transform 160ms ease;
}
.pvw-panel.pvw-open { display: block; }
.pvw-panel.pvw-visible { opacity: 1; transform: translateY(0) scale(1); }
/* app-preview toolbar is a narrow left column with plenty of room to its right,
   so anchor the panel to the pill's left edge there instead of the right edge
   (used in the wide admin/partner headers) — keeps it from clipping sibling buttons. */
.pvw-panel-anchor-left { right: auto; left: 0; }

.pvw-search-wrap { position: relative; margin-bottom: 10px; }
.pvw-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94A3B8; font-size: 0.75rem; }
.pvw-search-input {
    width: 100%; box-sizing: border-box; border: 1px solid #E2E8F0; border-radius: 8px;
    padding: 8px 12px 8px 32px; font-size: 0.8rem; font-family: inherit; color: #1E293B;
    background: #F8FAFC; transition: border-color 150ms ease, background 150ms ease;
}
.pvw-search-input:focus { outline: none; border-color: #2c37b7; background: #fff; }
.pvw-search-input:focus-visible { outline: 2px solid #2c37b7; outline-offset: 1px; }

.pvw-list { display: flex; flex-direction: column; gap: 6px; }
.pvw-card {
    border-radius: 10px; padding: 12px 14px; border: 1px solid transparent; position: relative;
}
.pvw-card-selected { background: #EEF0FD; border-left: 3px solid #2c37b7; padding-left: 12px; }
.pvw-card-head { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.pvw-card-version { font-weight: 700; font-size: 0.85rem; color: #1E293B; }
.pvw-card-badge { font-size: 0.62rem; font-weight: 700; border-radius: 10px; padding: 2px 7px; }
.pvw-card-badge-latest { color: #10B981; background: rgba(16,185,129,0.12); }
.pvw-card-badge-deployed { color: #2c37b7; background: rgba(44,55,183,0.10); }
.pvw-card-check { margin-left: auto; color: #2c37b7; font-size: 0.78rem; }
.pvw-card-meta { font-size: 0.72rem; color: #94A3B8; margin: 3px 0 6px; }
.pvw-card-changes { margin: 0; padding-left: 18px; color: #64748B; font-size: 0.76rem; line-height: 1.6; }
.pvw-card-changes li { margin-bottom: 1px; }
.pvw-card-empty { text-align: center; color: #94A3B8; font-size: 0.78rem; padding: 24px 0; }

@media (prefers-reduced-motion: reduce) {
    .pvw-panel { transition: none; }
    .pvw-pill-chevron { transition: none; }
}
`;
        document.head.appendChild(style);
    }

    // ── Container Resolver Per Scope ──
    function resolveContainer(scope) {
        const selectors = {
            admin: ['.topbar-right'],
            partner: ['.pb-topbar-right', '.topbar-right'],
            app: ['.preview-controls']
        };
        const list = selectors[scope] || [];
        for (let i = 0; i < list.length; i++) {
            const el = document.querySelector(list[i]);
            if (el) return el;
        }
        return null;
    }

    // ── Build Widget Markup ──
    function buildWidget(scope, entries) {
        const uid = 'pvw-' + scope;
        const newest = entries[0];

        const root = document.createElement('div');
        root.className = 'pvw-root';
        root.id = uid + '-root';

        const cardsHtml = entries.map(function (entry, idx) {
            const badges = [
                entry.latest ? '<span class="pvw-card-badge pvw-card-badge-latest">Latest</span>' : '',
                entry.deployed ? '<span class="pvw-card-badge pvw-card-badge-deployed">🌐 Deployed</span>' : ''
            ].join('');
            const changesHtml = entry.changes.map(function (c) {
                return '<li>' + escapeHtml(c) + '</li>';
            }).join('');
            // Search index must stay RAW (only the attribute-delimiter quote is escaped) so
            // queries containing " ' & < > can still match; escapeHtml() is reserved for text
            // that is actually rendered as HTML (version/summary/changes above).
            const searchBlob = (entry.version + ' ' + entry.summary + ' ' + entry.changes.join(' '))
                .toLowerCase()
                .replace(/"/g, '&quot;');
            return (
                '<div class="pvw-card' + (idx === 0 ? ' pvw-card-selected' : '') + '" data-pvw-search="' + searchBlob + '">' +
                    '<div class="pvw-card-head">' +
                        '<span class="pvw-card-version">' + escapeHtml(entry.version) + '</span>' +
                        badges +
                        (idx === 0 ? '<i class="fas fa-check pvw-card-check"></i>' : '') +
                    '</div>' +
                    '<div class="pvw-card-meta">' + escapeHtml(entry.summary) + ' · ' + relativeLabel(entry.date) + '</div>' +
                    '<ul class="pvw-card-changes">' + changesHtml + '</ul>' +
                '</div>'
            );
        }).join('');

        root.innerHTML =
            '<button type="button" class="pvw-pill" id="' + uid + '-pill" aria-haspopup="true" aria-expanded="false">' +
                '<i class="fas fa-code-branch pvw-pill-icon"></i>' +
                '<span class="pvw-pill-version">' + escapeHtml(newest.version) + '</span>' +
                (newest.latest ? '<span class="pvw-pill-latest">Latest</span>' : '') +
                '<i class="fas fa-chevron-down pvw-pill-chevron"></i>' +
            '</button>' +
            '<div class="pvw-panel' + (scope === 'app' ? ' pvw-panel-anchor-left' : '') + '" id="' + uid + '-panel" role="menu">' +
                '<div class="pvw-search-wrap">' +
                    '<i class="fas fa-magnifying-glass pvw-search-icon"></i>' +
                    '<input type="text" class="pvw-search-input" id="' + uid + '-search" placeholder="Cari versi…" autocomplete="off">' +
                '</div>' +
                '<div class="pvw-list" id="' + uid + '-list">' + cardsHtml + '</div>' +
                '<div class="pvw-card-empty" id="' + uid + '-empty" style="display:none;">Tidak ada versi yang cocok.</div>' +
            '</div>';

        return root;
    }

    // ── Mount ──
    window.mountVersionWidget = function (scope) {
        if (!window.PaydiaVersions || !window.PaydiaVersions[scope]) return;
        const uid = 'pvw-' + scope;
        if (document.getElementById(uid + '-root')) return; // already mounted on this page

        const container = resolveContainer(scope);
        if (!container) return;

        injectStyles();

        const entries = window.PaydiaVersions[scope];
        const widget = buildWidget(scope, entries);
        container.insertBefore(widget, container.firstChild);

        const pill = document.getElementById(uid + '-pill');
        const panel = document.getElementById(uid + '-panel');
        const search = document.getElementById(uid + '-search');
        const list = document.getElementById(uid + '-list');
        const empty = document.getElementById(uid + '-empty');

        function openPanel() {
            panel.classList.add('pvw-open');
            pill.setAttribute('aria-expanded', 'true');
            // Force reflow so the transition plays on open
            requestAnimationFrame(function () { panel.classList.add('pvw-visible'); });
        }
        function closePanel() {
            panel.classList.remove('pvw-visible');
            pill.setAttribute('aria-expanded', 'false');
            setTimeout(function () { panel.classList.remove('pvw-open'); }, 160);
        }

        pill.addEventListener('click', function (e) {
            e.stopPropagation();
            if (panel.classList.contains('pvw-open')) closePanel(); else openPanel();
        });

        document.addEventListener('click', function (e) {
            if (!e.target.closest('#' + uid + '-root')) closePanel();
        });

        if (search) {
            search.addEventListener('input', function () {
                const q = search.value.trim().toLowerCase();
                let visibleCount = 0;
                list.querySelectorAll('.pvw-card').forEach(function (card) {
                    const match = !q || card.getAttribute('data-pvw-search').indexOf(q) !== -1;
                    card.style.display = match ? '' : 'none';
                    if (match) visibleCount++;
                });
                empty.style.display = visibleCount === 0 ? 'block' : 'none';
            });
        }
    };
})();
