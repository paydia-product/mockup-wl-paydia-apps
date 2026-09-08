/* =============================================
   Nusumma White Label — Shared Data Module
   =============================================
   Isolated data layer for the BPR Nusumma mockup.
   All data persisted in localStorage with nusumma_wl_* keys.
   Cross-tab sync via StorageEvent.
   ============================================= */

const PaydiaData = (() => {

    // ── Storage Keys ──
    const KEYS = {
        TENANTS: 'nusumma_wl_tenants',
        CONFIG_PREFIX: 'nusumma_wl_config_',
        USERS_PREFIX: 'nusumma_wl_users_',
        TRX_PREFIX: 'nusumma_wl_trx_',
        REQUESTS: 'nusumma_wl_requests',
        AUDIT_LOG: 'nusumma_wl_audit_log',
        CURRENT_TENANT: 'nusumma_wl_current_tenant',
        CURRENT_ROLE: 'nusumma_wl_current_role',
        INITIALIZED: 'nusumma_wl_initialized',
        PAYIN: 'nusumma_wl_payin',
        QRIS_MPM: 'nusumma_wl_qris_mpm'
    };

    // ── Seed Data: Tenants ──
    // BPR Nusumma is a single institution — one tenant only, no per-branch entries.
    const SEED_TENANTS = [
        {
            id: 'NUS-001',
            partnerName: 'PT BPR Nusumma',
            appName: 'Nusumma',
            emailPIC: 'partner@nusumma.co.id',
            phonePIC: '+628123456801',
            paket: 'Premium',
            status: 'Aktif',
            createdAt: '2026-01-15 10:00:00',
            passwordHash: 'nusumma1',
            kategori: 'BPR',
            mid: '200525100000001',
            emailVerified: 'Yes',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2026-05-28 09:00:00'
        }
    ];

    // ── Helper to generate default Configs for merchants ──
    // All Nusumma tenants share one Nusumma-orange icon set at
    // /nusumma/app-preview/icons/NUS (recolored from a Paydia icon folder).
    const NUS_ICON_DIR = '/nusumma/app-preview/icons/NUS';

    const generateDefaultConfig = (id, appName) => {
        const tenantColors = { primary: '#FF9800', secondary: '#FFCC80' };
        return {
            tenantId: id,
            primaryColor: tenantColors.primary,
            secondaryColor: tenantColors.secondary,
            appName: appName,
            logoUrl: '',
            features: {
                kirimUang: true,
                mintaDana: true,
                topUp: true,
                qris: true,
                komunitas: true,
                pulsaPaket: true,
                pln: true,
                pdam: true,
                bpjs: true,
                tagihan: true,
                kasbon: true,
                internet: true,
                telkom: true,
                transaksiFavorit: true
            },
            featureIcons: {
                kirimUang: `${NUS_ICON_DIR}/icon_kirim_uang.svg`,
                mintaDana: `${NUS_ICON_DIR}/icon_minta_dana.svg`,
                topUp: `${NUS_ICON_DIR}/icon_topup.svg`,
                qris: '/app-preview/qris.png',
                komunitas: `${NUS_ICON_DIR}/icon_komunitas.svg`,
                pulsaPaket: `${NUS_ICON_DIR}/icon_pulsa_paket.svg`,
                pln: `${NUS_ICON_DIR}/icon_pln.svg`,
                pdam: `${NUS_ICON_DIR}/icon_pdam.svg`,
                bpjs: `${NUS_ICON_DIR}/icon_bpjs.svg`,
                tagihan: `${NUS_ICON_DIR}/icon_tagihan.svg`,
                kasbon: `${NUS_ICON_DIR}/icon_kasbon.svg`,
                internet: `${NUS_ICON_DIR}/icon_internet.svg`,
                telkom: `${NUS_ICON_DIR}/icon_telkom.svg`,
                transaksiFavorit: `${NUS_ICON_DIR}/nav_transaksi_favorit.svg`
            },
            featureNames: {
                kirimUang: 'Kirim Uang',
                mintaDana: 'Minta Dana',
                topUp: 'Top Up',
                qris: 'QRIS',
                komunitas: 'Komunitas',
                pulsaPaket: 'Pulsa & Paket Data',
                pln: 'PLN',
                pdam: 'PDAM',
                bpjs: 'BPJS Kesehatan',
                tagihan: 'Tagihan',
                kasbon: 'Kasbon',
                internet: 'Internet',
                telkom: 'Telkom',
                transaksiFavorit: 'Transaksi Favorit'
            },
            fontFamily: 'Inter',
            fontSize: '14px',
            banners: [
                '/nusumma/assets/promo-banner-1.svg',
                '/nusumma/assets/promo-banner-2.svg'
            ],
            blogs: [
                {
                    imageUrl: `${NUS_ICON_DIR}/blog_1.svg`,
                    blogUrl: 'https://nusumma.id/blog/artikel-1'
                },
                {
                    imageUrl: `${NUS_ICON_DIR}/blog_2.svg`,
                    blogUrl: 'https://nusumma.id/blog/artikel-2'
                }
            ],
            promos: [
                {
                    imageUrl: `${NUS_ICON_DIR}/promo_1.svg`,
                    promoUrl: 'https://nusumma.id/promo/1'
                },
                {
                    imageUrl: `${NUS_ICON_DIR}/promo_2.svg`,
                    promoUrl: 'https://nusumma.id/promo/2'
                }
            ],
            splashScreenUrl: 'https://placehold.co/360x640/FF9800/white?text=Splash+Screen',
            navbar: [
                { name: 'Beranda', icon: `${NUS_ICON_DIR}/nav_home.svg` },
                { name: 'Favorit', icon: `${NUS_ICON_DIR}/nav_transaksi_favorit.svg` },
                { name: 'Riwayat', icon: `${NUS_ICON_DIR}/nav_riwayat.svg` },
                { name: 'Profil', icon: `${NUS_ICON_DIR}/nav_profil.svg` }
            ],
            emptyStateUrl: 'https://placehold.co/300x200/cccccc/333333?text=Empty+State',
            errorStateUrl: 'https://placehold.co/300x200/ffcccc/990000?text=Error+State',
            onboarding: [
                { name: 'Set PIN', image: 'https://placehold.co/360x640/FF9800/white?text=Set+PIN+Screen' },
                { name: 'Set Biometric', image: 'https://placehold.co/360x640/EF6C00/white?text=Biometric+Screen' }
            ],
            appId: 'APP-' + id.substring(4),
            packageName: 'com.nusumma.' + appName.toLowerCase().replace(/\s+/g, ''),
            appLogoUrl: '/nusumma/assets/logo-nusummadark.png',
            baseUrl: 'https://api.nusumma.id',
            tosText: 'Syarat & Ketentuan Penggunaan Aplikasi Whitelabel BPR Nusumma ini diatur oleh BPR Nusumma. Dengan menggunakan aplikasi ini, Anda setuju untuk mematuhi seluruh hukum yang berlaku di Republik Indonesia serta batasan limit transaksi harian yang ditetapkan.',
            socialMedia: {
                facebook: 'https://facebook.com/nusumma',
                tiktok: 'https://tiktok.com/@nusumma',
                instagram: 'https://instagram.com/@nusumma',
                twitter: 'https://twitter.com/@nusumma'
            },
            languages: ['Bahasa Indonesia', 'English'],
            supportEmail: 'support@nusumma.id',
            callCenter: '1500900',
            whatsapp: '+6281234567800',
            limits: {
                perTransaction: 5000000,
                perDay: 25000000,
                maxBalance: 10000000
            },
            updatedAt: '2026-05-30 09:00:00'
        };
    };

    const SEED_CONFIGS = {
        'NUS-001': generateDefaultConfig('NUS-001', 'Nusumma')
    };

    // ── Seed Data: Users per Tenant ──
    const SEED_USERS = {
        'NUS-001': [
            { id: 'USR-001-001', name: 'AGUS PRASETYO WIBOWO', phone: '089632848301', email: 'agus.prasetyo@gmail.com', dob: '1990-05-15', status: 'Active', balance: 10000, totalTrx: 45, registeredAt: '2026-05-29 11:24:48', lastActivity: '2026-05-29 11:29:52', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ]
    };

    // ── Seed Data: Transactions per Tenant ──
    const SEED_TRX = {
        'NUS-001': [
            { id: 'TRX-001-0001', userId: 'USR-001-001', userName: 'AGUS PRASETYO WIBOWO', userPhone: '089632848301', type: 'transfer', nominal: 10000, fee: 0, status: 'Berhasil', recipientName: 'Siti Rahayu', recipientPhone: '081298765401', refNo: '260529100001', date: '2026-05-29 11:29:52', category: 'Uang Masuk - Transfer Bisnis', tenantId: 'NUS-001' }
        ]
    };

    // ── Generated filler users/transactions so the single tenant has a fuller dataset ──
    // (deterministic, index-based — no Math.random — appended after the named anchor above)
    const FILLER_NAMES = [
        'Budi Santoso', 'Siti Nurhaliza', 'Agus Wijaya', 'Dewi Lestari', 'Rudi Hartono',
        'Ani Suryani', 'Bambang Setiawan', 'Fitri Handayani', 'Joko Susilo', 'Rina Marlina',
        'Hendra Gunawan', 'Yuni Astuti', 'Andi Firmansyah', 'Lina Kartika', 'Wahyu Ramadhan', 'Putri Amelia',
        'Eko Purnomo', 'Maya Anggraini', 'Dian Saputra', 'Retno Wulandari', 'Arief Budiman',
        'Indah Permatasari', 'Yusuf Setiadi', 'Nova Kristanti'
    ];
    const TRX_TYPES = ['transfer', 'topup', 'qris', 'payment', 'biller'];
    const TRX_CATEGORY = {
        transfer: 'Uang Keluar - Transfer Bank', topup: 'Top Up Bank Transfer',
        qris: 'Merchant - Bayar Merchant', payment: 'Payment', biller: 'Tagihan - Pembayaran Biller'
    };
    const pad3 = n => String(n).padStart(3, '0');
    const maxSuffix = (list, re) => list.reduce((max, item) => {
        const m = re.exec(item.id);
        return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);

    function ensureMinUsers(tenantId, tnum, minCount) {
        const list = SEED_USERS[tenantId] || (SEED_USERS[tenantId] = []);
        let seq = maxSuffix(list, /USR-\d+-(\d+)/) + 1, i = 0;
        while (list.length < minCount) {
            const idx = i % FILLER_NAMES.length;
            const round = Math.floor(i / FILLER_NAMES.length);
            const name = FILLER_NAMES[idx] + (round > 0 ? ' ' + (round + 1) : '');
            const day = (seq * 3) % 28 + 1;
            const active = seq % 4 !== 0;
            list.push({
                id: `USR-${tnum}-${pad3(seq)}`,
                name,
                phone: '08' + String(1000000000 + Number(tnum) * 7654321 + seq * 911).slice(-9),
                email: name.toLowerCase().replace(/\s+/g, '.') + seq + '@mail.com',
                dob: `199${seq % 10}-0${(seq % 9) + 1}-1${seq % 9}`,
                status: active ? 'Active' : 'Nonaktif',
                balance: (seq * 15000) % 650000,
                totalTrx: (seq * 3) % 40,
                registeredAt: `2026-0${(seq % 5) + 1}-${String(day).padStart(2, '0')} 0${seq % 9}:${String((seq * 7) % 60).padStart(2, '0')}:00`,
                lastActivity: active ? `2026-0${(seq % 5) + 1}-${String(day).padStart(2, '0')} 1${seq % 9}:${String((seq * 11) % 60).padStart(2, '0')}:00` : '',
                statusDormant: 'In 11 month',
                preKyc: true,
                userType: 'user'
            });
            seq++; i++;
        }
    }

    function ensureMinTransactions(tenantId, tnum, minCount) {
        const list = SEED_TRX[tenantId] || (SEED_TRX[tenantId] = []);
        const users = SEED_USERS[tenantId] || [];
        if (users.length === 0) return;
        const failMod = 6;
        const procMod = 9;
        let seq = maxSuffix(list, /TRX-\d+-(\d+)/) + 1, i = 0;
        while (list.length < minCount) {
            const user = users[i % users.length];
            const type = TRX_TYPES[i % TRX_TYPES.length];
            const day = (seq * 2) % 28 + 1;
            const status = seq % procMod === 0 ? 'Diproses' : (seq % failMod === 0 ? 'Gagal' : 'Berhasil');
            list.push({
                id: `TRX-${tnum}-${String(seq).padStart(4, '0')}`,
                userId: user.id,
                userName: user.name,
                userPhone: user.phone,
                type,
                nominal: (seq * 12345) % 900000 + 5000,
                fee: type === 'transfer' ? 2500 : 0,
                status,
                recipientName: type === 'transfer' ? 'Bank Transfer Tujuan' : (type === 'biller' ? 'PLN Prepaid' : ''),
                recipientPhone: '',
                refNo: `2606${tnum}${String(seq).padStart(5, '0')}`,
                date: `2026-06-${String(day).padStart(2, '0')} 1${seq % 9}:${String((seq * 13) % 60).padStart(2, '0')}:00`,
                category: TRX_CATEGORY[type],
                tenantId
            });
            seq++; i++;
        }
    }

    ensureMinUsers('NUS-001', '001', 24);
    ensureMinTransactions('NUS-001', '001', 40);

    // ── Seed Data: Requests ──
    const SEED_REQUESTS = [
        { id: 'REQ-001', tenantId: 'NUS-001', tenantName: 'Nusumma', type: 'Splash Screen', description: 'Ganti splash screen dengan desain baru sesuai brand guideline terbaru.', attachments: ['splash_v2.png'], status: 'Menunggu Review', createdAt: '2026-05-25 10:00:00', updatedAt: '2026-05-25 10:00:00', notes: '' },
        { id: 'REQ-002', tenantId: 'NUS-001', tenantName: 'Nusumma', type: 'Nama Aplikasi', description: 'Ubah nama aplikasi dari Nusumma ke Nusumma Pro untuk versi premium.', attachments: [], status: 'Sedang Dikerjakan', createdAt: '2026-05-20 14:00:00', updatedAt: '2026-05-26 09:00:00', notes: 'Tim dev sedang update package name' }
    ];

    // ── Seed Data: Audit Log ──
    const SEED_AUDIT_LOG = [
        { id: 'AUD-001', timestamp: '2026-05-28 09:01:00', actor: 'admin@nusumma.id', actorRole: 'Admin Internal', action: 'login', objectType: 'session', objectId: '-', tenantId: '-', description: 'Login ke Dashboard Internal', before: null, after: null },
        { id: 'AUD-002', timestamp: '2026-05-28 09:15:00', actor: 'partner@nusumma.co.id', actorRole: 'Partner', action: 'update_config', objectType: 'config', objectId: 'NUS-001', tenantId: 'NUS-001', description: 'Ubah warna primer tema', before: '#FF9800', after: '#EF6C00' },
        { id: 'AUD-003', timestamp: '2026-05-25 15:25:46', actor: 'admin@nusumma.id', actorRole: 'Admin Internal', action: 'update_config', objectType: 'config', objectId: 'NUS-001', tenantId: 'NUS-001', description: 'Konfigurasi Whitelabel pertama kali disimpan', before: null, after: 'Warna: #FB8C00, App: Nusumma' },
        { id: 'AUD-004', timestamp: '2026-05-25 11:55:34', actor: 'admin@nusumma.id', actorRole: 'Admin Internal', action: 'onboard_merchant', objectType: 'merchant', objectId: 'NUS-001', tenantId: 'NUS-001', description: 'Registrasi merchant: BPR Nusumma', before: null, after: 'Waiting KYC' }
    ];

    // ── Seed Data: Payin Transactions ──
    const SEED_PAYIN = [
        { refNo: 'a1a2e6e6-9526-44ef-82c5-916b25370501', vendor: '', date: '2026-05-20 13:47:09', category: 'payin-topup', merchantMid: '200525100000001', merchantName: 'BPR Nusumma', nominal: 100000, adminFee: 0, total: 100016, status: 'Gagal' },
        { refNo: 'b17cea0a-86f0-424b-b33d-c1e98cc1e902', vendor: '', date: '2026-05-19 11:01:44', category: 'payin-topup', merchantMid: '200525100000001', merchantName: 'BPR Nusumma', nominal: 1000000, adminFee: 0, total: 1000013, status: 'Sukses' },
        { refNo: 'c2a86c4f-3165-460a-a433-70cc3fc30503', vendor: 'mitracomm', date: '2026-05-13 16:35:16', category: 'payin-payment', merchantMid: '200525100000001', merchantName: 'BPR Nusumma', nominal: 100000, adminFee: 0, total: 100012, status: 'Sukses' }
    ];

    // ── Seed Data: QRIS MPM Transactions ──
    const SEED_QRIS_MPM = [
        { id: 'TRX-MPM-001', refNo: '923456789001', date: '2026-05-31 14:22:05', merchantMid: '200525100000001', merchantName: 'BPR Nusumma', category: 'Bayar Merchant', status: 'Sukses', nominal: 150000, tip: 0, mdr: 1050, total: 151050, vendor: 'Nusumma', callbackStatus: 'Sukses' },
        { id: 'TRX-MPM-002', refNo: '923456789002', date: '2026-05-31 15:30:12', merchantMid: '200525100000001', merchantName: 'BPR Nusumma', category: 'Bayar Merchant', status: 'Sukses', nominal: 50000, tip: 5000, mdr: 350, total: 55350, vendor: 'Nusumma', callbackStatus: 'Gagal' }
    ];

    // ── Initialize / Seed Database ──
    function initialize(forceReset = false) {
        const currentVersion = '4'; // Nusumma independent seed version counter
        const seedVersion = localStorage.getItem('nusumma_wl_seed_version');
        if (seedVersion !== currentVersion) {
            forceReset = true;
            localStorage.setItem('nusumma_wl_seed_version', currentVersion);
        }

        if (forceReset || localStorage.getItem(KEYS.INITIALIZED) !== 'true') {
            localStorage.setItem(KEYS.TENANTS, JSON.stringify(SEED_TENANTS));

            Object.entries(SEED_CONFIGS).forEach(([id, config]) => {
                localStorage.setItem(KEYS.CONFIG_PREFIX + id, JSON.stringify(config));
            });

            Object.entries(SEED_USERS).forEach(([id, users]) => {
                localStorage.setItem(KEYS.USERS_PREFIX + id, JSON.stringify(users));
            });

            Object.entries(SEED_TRX).forEach(([id, trx]) => {
                localStorage.setItem(KEYS.TRX_PREFIX + id, JSON.stringify(trx));
            });

            localStorage.setItem(KEYS.REQUESTS, JSON.stringify(SEED_REQUESTS));
            localStorage.setItem(KEYS.AUDIT_LOG, JSON.stringify(SEED_AUDIT_LOG));
            localStorage.setItem(KEYS.PAYIN, JSON.stringify(SEED_PAYIN));
            localStorage.setItem(KEYS.QRIS_MPM, JSON.stringify(SEED_QRIS_MPM));
            localStorage.setItem(KEYS.INITIALIZED, 'true');
        }

        // Self-heal a stale current-tenant pointer (e.g. left over from a prior
        // seed version with more tenants) so it never points at a tenant that
        // no longer exists.
        const tenants = getTenants();
        const current = localStorage.getItem(KEYS.CURRENT_TENANT);
        if (tenants.length > 0 && (!current || !tenants.find(t => t.id === current))) {
            localStorage.setItem(KEYS.CURRENT_TENANT, tenants[0].id);
        }
    }

    // ── Generic Read/Write Helpers ──
    function read(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('PaydiaData.read error:', key, e);
            return null;
        }
    }

    function write(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // ── Tenant CRUD ──
    function getTenants() {
        return read(KEYS.TENANTS) || [];
    }

    function getTenant(id) {
        return getTenants().find(t => t.id === id) || null;
    }

    function addTenant(tenant) {
        const tenants = getTenants();
        tenants.push(tenant);
        write(KEYS.TENANTS, tenants);
        // Initialize empty config, users, trx
        write(KEYS.CONFIG_PREFIX + tenant.id, {
            ...generateDefaultConfig(tenant.id, tenant.appName),
            updatedAt: formatDate(new Date())
        });
        write(KEYS.USERS_PREFIX + tenant.id, []);
        write(KEYS.TRX_PREFIX + tenant.id, []);
        return tenant;
    }

    function updateTenant(id, updates) {
        const tenants = getTenants();
        const idx = tenants.findIndex(t => t.id === id);
        if (idx !== -1) {
            Object.assign(tenants[idx], updates);
            write(KEYS.TENANTS, tenants);
        }
        return tenants[idx] || null;
    }

    // ── Config CRUD ──
    function getConfig(tenantId) {
        return read(KEYS.CONFIG_PREFIX + tenantId);
    }

    function updateConfig(tenantId, updates) {
        const config = getConfig(tenantId) || {};
        Object.assign(config, updates, { updatedAt: formatDate(new Date()) });
        write(KEYS.CONFIG_PREFIX + tenantId, config);
        return config;
    }

    // ── Users CRUD ──
    function getUsers(tenantId) {
        return read(KEYS.USERS_PREFIX + tenantId) || [];
    }

    function getAllUsers() {
        const tenants = getTenants();
        let all = [];
        tenants.forEach(t => {
            const users = getUsers(t.id);
            users.forEach(u => {
                all.push({ ...u, tenantId: t.id, tenantName: t.appName });
            });
        });
        return all;
    }

    function getAllTransactions() {
        const tenants = getTenants();
        let all = [];
        tenants.forEach(t => {
            const trx = getTransactions(t.id);
            trx.forEach(tx => {
                all.push({ ...tx, tenantId: t.id, tenantName: t.appName });
            });
        });
        return all;
    }

    function updateUser(tenantId, userId, updates) {
        const users = getUsers(tenantId);
        const idx = users.findIndex(u => u.id === userId);
        if (idx !== -1) {
            Object.assign(users[idx], updates);
            write(KEYS.USERS_PREFIX + tenantId, users);
        }
        return users[idx] || null;
    }

    // ── Transactions CRUD ──
    function getTransactions(tenantId) {
        return read(KEYS.TRX_PREFIX + tenantId) || [];
    }

    // ── Requests CRUD ──
    function getRequests() {
        return read(KEYS.REQUESTS) || [];
    }

    function addRequest(request) {
        const requests = getRequests();
        requests.unshift(request);
        write(KEYS.REQUESTS, requests);
        return request;
    }

    function updateRequest(id, updates) {
        const requests = getRequests();
        const idx = requests.findIndex(r => r.id === id);
        if (idx !== -1) {
            Object.assign(requests[idx], updates);
            write(KEYS.REQUESTS, requests);
        }
        return requests[idx] || null;
    }

    // ── Audit Log ──
    function getAuditLog() {
        return read(KEYS.AUDIT_LOG) || [];
    }

    function writeAuditLog(entry) {
        const logs = getAuditLog();
        const id = 'AUD-' + String(logs.length + 1).padStart(3, '0');
        const logEntry = {
            id,
            timestamp: formatDate(new Date()),
            ...entry
        };
        logs.unshift(logEntry);
        write(KEYS.AUDIT_LOG, logs);
        return logEntry;
    }

    // ── Payin CRUD ──
    function getPayin() {
        return read(KEYS.PAYIN) || [];
    }

    function updatePayin(refNo, updates) {
        const payin = getPayin();
        const idx = payin.findIndex(p => p.refNo === refNo);
        if (idx !== -1) {
            Object.assign(payin[idx], updates);
            write(KEYS.PAYIN, payin);
        }
        return payin[idx] || null;
    }

    // ── QRIS MPM CRUD ──
    function getQrisMpm() {
        return read(KEYS.QRIS_MPM) || [];
    }

    function updateQrisMpm(id, updates) {
        const qris = getQrisMpm();
        const idx = qris.findIndex(q => q.id === id);
        if (idx !== -1) {
            Object.assign(qris[idx], updates);
            write(KEYS.QRIS_MPM, qris);
        }
        return qris[idx] || null;
    }

    // ── Session / Auth ──
    function setCurrentRole(role) {
        localStorage.setItem(KEYS.CURRENT_ROLE, role);
    }

    function getCurrentRole() {
        return localStorage.getItem(KEYS.CURRENT_ROLE) || '';
    }

    function setCurrentTenant(tenantId) {
        localStorage.setItem(KEYS.CURRENT_TENANT, tenantId);
    }

    function getCurrentTenant() {
        return localStorage.getItem(KEYS.CURRENT_TENANT) || '';
    }

    // ── Cross-Tab Sync ──
    function onStorageChange(callback) {
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('nusumma_wl_')) {
                callback(e.key, e.newValue ? JSON.parse(e.newValue) : null, e.oldValue ? JSON.parse(e.oldValue) : null);
            }
        });
    }

    // ── Formatters ──
    function formatCurrency(amount) {
        return 'Rp' + Number(amount).toLocaleString('id-ID');
    }

    function formatDate(date) {
        if (typeof date === 'string') return date;
        const d = new Date(date);
        const pad = n => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    }

    function formatPhone(phone) {
        if (!phone) return '-';
        return phone.replace(/^\+62/, '0');
    }

    function generateId(prefix) {
        return prefix + '-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }

    // ── Stats Helpers ──
    function getTenantStats(tenantId) {
        const users = getUsers(tenantId);
        const trx = getTransactions(tenantId);
        const today = new Date().toISOString().substring(0, 10);

        const activeUsers = users.filter(u => u.status === 'Active' || u.status === 'Aktif').length;
        const totalUsers = users.length;
        const todayTrx = trx.filter(t => t.date.startsWith(today));
        const todayVolume = todayTrx.reduce((sum, t) => sum + t.nominal, 0);
        const monthTrx = trx;
        const monthVolume = monthTrx.reduce((sum, t) => sum + t.nominal, 0);

        return { totalUsers, activeUsers, todayTrxCount: todayTrx.length, todayVolume, monthTrxCount: monthTrx.length, monthVolume };
    }

    function getGlobalStats() {
        const tenants = getTenants();
        let totalUsers = 0, totalTrx = 0, todayVolume = 0, totalActiveTenants = 0;
        const today = new Date().toISOString().substring(0, 10);

        tenants.forEach(t => {
            if (t.status === 'Aktif') totalActiveTenants++;
            const users = getUsers(t.id);
            totalUsers += users.length;
            const trx = getTransactions(t.id);
            totalTrx += trx.length;
            trx.filter(tx => tx.date.startsWith(today)).forEach(tx => {
                todayVolume += tx.nominal;
            });
        });

        return { totalActiveTenants, totalTenants: tenants.length, totalUsers, totalTrx, todayVolume };
    }

    // ── Public API ──
    return {
        KEYS,
        initialize,
        // Tenants
        getTenants, getTenant, addTenant, updateTenant,
        // Config
        getConfig, updateConfig,
        // Users
        getUsers, getAllUsers, updateUser,
        // Transactions
        getTransactions, getAllTransactions,
        // Requests
        getRequests, addRequest, updateRequest,
        // Audit
        getAuditLog, writeAuditLog,
        // Payin
        getPayin, updatePayin,
        // QRIS MPM
        getQrisMpm, updateQrisMpm,
        // Session
        setCurrentRole, getCurrentRole,
        setCurrentTenant, getCurrentTenant,
        // Sync
        onStorageChange,
        // Helpers
        formatCurrency, formatDate, formatPhone, generateId,
        getTenantStats, getGlobalStats
    };

})();

window.NusummaData = PaydiaData;
