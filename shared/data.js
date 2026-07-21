/* =============================================
   Paydia White Label — Shared Data Module
   =============================================
   Central data layer for all 3 dashboard modes.
   All data persisted in localStorage with shared keys.
   Cross-tab sync via StorageEvent.
   ============================================= */

const PaydiaData = (() => {

    // ── Storage Keys ──
    const KEYS = {
        TENANTS: 'paydia_wl_tenants',
        CONFIG_PREFIX: 'paydia_wl_config_',
        USERS_PREFIX: 'paydia_wl_users_',
        TRX_PREFIX: 'paydia_wl_trx_',
        REQUESTS: 'paydia_wl_requests',
        AUDIT_LOG: 'paydia_wl_audit_log',
        CURRENT_TENANT: 'paydia_wl_current_tenant',
        CURRENT_ROLE: 'paydia_wl_current_role',
        INITIALIZED: 'paydia_wl_initialized',
        PAYIN: 'paydia_wl_payin',
        QRIS_MPM: 'paydia_wl_qris_mpm'
    };

    // ── Seed Data: Tenants ──
    const SEED_TENANTS = [
        {
            id: 'TNT-001',
            partnerName: 'PT Dana Kita Bersama',
            appName: 'DanaKu',
            emailPIC: 'partner@danaku.id',
            phonePIC: '+628123456789',
            paket: 'Premium',
            status: 'Aktif',
            createdAt: '2026-01-15 10:00:00',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '200525000000001',
            emailVerified: 'Yes',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2026-05-28 09:00:00'
        },
        {
            id: 'TNT-002',
            partnerName: 'PT Bayar Mudah Sejahtera',
            appName: 'PayEase',
            emailPIC: 'partner@payease.id',
            phonePIC: '+628198765432',
            paket: 'Standard',
            status: 'Aktif',
            createdAt: '2026-03-22 14:30:00',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '200525000000002',
            emailVerified: 'Yes',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2026-05-27 14:00:00'
        },
        {
            id: 'TNT-003',
            partnerName: 'KREASI MITRAKA DIGITARA',
            appName: 'KreasiPay',
            emailPIC: 'farhanfauzan119@gmail.com',
            phonePIC: '+628123456703',
            paket: 'Premium',
            status: 'Aktif',
            createdAt: '2028-05-25 15:20:40',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '200525002000000',
            emailVerified: 'Yes',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-25 15:25:46'
        },
        {
            id: 'TNT-004',
            partnerName: 'Testing GA',
            appName: 'GAPay',
            emailPIC: 'testing.ga@gmail.com',
            phonePIC: '+628123456704',
            paket: 'Standard',
            status: 'Aktif',
            createdAt: '2028-05-25 11:55:34',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280525001000000',
            emailVerified: 'No',
            aksesTransaksi: 'Active',
            statusKYM: 'Waiting',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-25 11:55:34'
        },
        {
            id: 'TNT-005',
            partnerName: 'PT ELANG TEKNO INDO',
            appName: 'ElangPay',
            emailPIC: 'support@elangindo.com',
            phonePIC: '+628123456705',
            paket: 'Enterprise',
            status: 'Aktif',
            createdAt: '2028-05-19 15:08:05',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280519006000000',
            emailVerified: 'No',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-20 17:00:17'
        },
        {
            id: 'TNT-006',
            partnerName: 'PT OBSIDIAN',
            appName: 'ObsidianPay',
            emailPIC: 'support@obsidia.com',
            phonePIC: '+628123456706',
            paket: 'Basic',
            status: 'Aktif',
            createdAt: '2026-05-19 15:01:00',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280519005000000',
            emailVerified: 'No',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2026-05-20 17:07:03'
        },
        {
            id: 'TNT-007',
            partnerName: 'PT LUMINA DIGITAL TEKNO',
            appName: 'LuminaPay',
            emailPIC: 'kuncoro@lumina.com',
            phonePIC: '+628123456707',
            paket: 'Premium',
            status: 'Aktif',
            createdAt: '2028-05-19 14:58:18',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280519004000000',
            emailVerified: 'No',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-20 18:00:58'
        },
        {
            id: 'TNT-008',
            partnerName: 'elangamer',
            appName: 'ClanPay',
            emailPIC: 'cs.supp@clangteknoplay.com',
            phonePIC: '+628123456708',
            paket: 'Standard',
            status: 'Aktif',
            createdAt: '2028-05-19 14:24:28',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280519003000000',
            emailVerified: 'Yes',
            aksesTransaksi: 'Active',
            statusKYM: 'Waiting',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-19 14:24:28'
        },
        {
            id: 'TNT-009',
            partnerName: 'PT LUMINA DIGITAL TEKNO',
            appName: 'LuminaTech',
            emailPIC: 'lumtek@gmail.com',
            phonePIC: '+628123456709',
            paket: 'Premium',
            status: 'Aktif',
            createdAt: '2028-05-19 14:21:03',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280519002000000',
            emailVerified: 'No',
            aksesTransaksi: 'Active',
            statusKYM: 'Waiting',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-19 14:21:03'
        },
        {
            id: 'TNT-010',
            partnerName: 'PT STRATOS',
            appName: 'StratosPay',
            emailPIC: 'cs@stratos.com',
            phonePIC: '+628123456710',
            paket: 'Basic',
            status: 'Aktif',
            createdAt: '2028-05-19 14:17:23',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280519001000000',
            emailVerified: 'No',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-20 15:52:50'
        },
        {
            id: 'TNT-011',
            partnerName: 'PORTRAITS2000 SNAPROOM',
            appName: 'SnapPay',
            emailPIC: 'incarnate.maria@pt-mfa.com',
            phonePIC: '+628123456711',
            paket: 'Premium',
            status: 'Aktif',
            createdAt: '2028-05-18 14:37:50',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280518001000000',
            emailVerified: 'Yes',
            aksesTransaksi: 'Active',
            statusKYM: 'Approved',
            statusDormant: 'In 11 month',
            lastActivity: '2028-05-28 14:28:55'
        },
        {
            id: 'TNT-012',
            partnerName: 'sasas',
            appName: 'sasasPay',
            emailPIC: 'dion@paydia.id',
            phonePIC: '+628123456712',
            paket: 'Standard',
            status: 'Aktif',
            createdAt: '2028-05-16 10:13:12',
            passwordHash: 'paydia1',
            kategori: 'Merchant',
            mid: '280510010000000',
            lastActivity: '2028-05-16 10:13:12'
        }
    ];

    // ── Helper to generate default Configs for merchants ──
    const generateDefaultConfig = (id, appName) => {
        const colors = {
            'TNT-001': { primary: '#4F46E5', secondary: '#818CF8' }, // DanaKu (Indigo)
            'TNT-002': { primary: '#0EA5E9', secondary: '#38BDF8' }, // PayEase (Sky Blue)
            'TNT-003': { primary: '#D97706', secondary: '#F59E0B' }, // KreasiPay (Amber)
            'TNT-004': { primary: '#EC4899', secondary: '#F472B6' }, // GAPay (Pink)
            'TNT-005': { primary: '#10B981', secondary: '#34D399' }, // ElangPay (Green)
            'TNT-006': { primary: '#1F2937', secondary: '#4B5563' }, // ObsidianPay (Dark Gray)
            'TNT-007': { primary: '#8B5CF6', secondary: '#A78BFA' }, // LuminaPay (Purple)
            'TNT-008': { primary: '#EF4444', secondary: '#F87171' }, // ClanPay (Red)
            'TNT-009': { primary: '#06B6D4', secondary: '#22D3EE' }, // LuminaTech (Cyan)
            'TNT-010': { primary: '#F97316', secondary: '#FB923C' }, // StratosPay (Orange)
            'TNT-011': { primary: '#14B8A6', secondary: '#2DD4BF' }, // SnapPay (Teal)
            'TNT-012': { primary: '#3B82F6', secondary: '#60A5FA' }  // sasasPay (Blue)
        };
        const tenantColors = colors[id] || { primary: '#20298B', secondary: '#3B82F6' };

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
                kirimUang: `/app-preview/icons/${id}/icon_kirim_uang.svg`,
                mintaDana: `/app-preview/icons/${id}/icon_minta_dana.svg`,
                topUp: `/app-preview/icons/${id}/icon_topup.svg`,
                qris: '/app-preview/qris.png',
                komunitas: `/app-preview/icons/${id}/icon_komunitas.svg`,
                pulsaPaket: `/app-preview/icons/${id}/icon_pulsa_paket.svg`,
                pln: `/app-preview/icons/${id}/icon_pln.svg`,
                pdam: `/app-preview/icons/${id}/icon_pdam.svg`,
                bpjs: `/app-preview/icons/${id}/icon_bpjs.svg`,
                tagihan: `/app-preview/icons/${id}/icon_tagihan.svg`,
                kasbon: `/app-preview/icons/${id}/icon_kasbon.svg`,
                internet: `/app-preview/icons/${id}/icon_internet.svg`,
                telkom: `/app-preview/icons/${id}/icon_telkom.svg`,
                transaksiFavorit: `/app-preview/icons/${id}/nav_transaksi_favorit.svg`
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
                'https://placehold.co/600x250/20298B/white?text=Banner+1',
                'https://placehold.co/600x250/3B82F6/white?text=Banner+2'
            ],
            blogs: [
                {
                    imageUrl: `/app-preview/icons/${id}/blog_1.svg`,
                    blogUrl: 'https://paydia.id/blog/artikel-1'
                },
                {
                    imageUrl: `/app-preview/icons/${id}/blog_2.svg`,
                    blogUrl: 'https://paydia.id/blog/artikel-2'
                }
            ],
            promos: [
                {
                    imageUrl: `/app-preview/icons/${id}/promo_1.svg`,
                    promoUrl: 'https://paydia.id/promo/1'
                },
                {
                    imageUrl: `/app-preview/icons/${id}/promo_2.svg`,
                    promoUrl: 'https://paydia.id/promo/2'
                }
            ],
            splashScreenUrl: 'https://placehold.co/360x640/20298B/white?text=Splash+Screen',
            navbar: [
                { name: 'Home', icon: `/app-preview/icons/${id}/nav_home.svg` },
                { name: 'Favorite Transaction', icon: `/app-preview/icons/${id}/nav_transaksi_favorit.svg` },
                { name: 'Riwayat Transaksi', icon: `/app-preview/icons/${id}/nav_riwayat.svg` },
                { name: 'Profil', icon: `/app-preview/icons/${id}/nav_profil.svg` }
            ],
            emptyStateUrl: 'https://placehold.co/300x200/cccccc/333333?text=Empty+State',
            errorStateUrl: 'https://placehold.co/300x200/ffcccc/990000?text=Error+State',
            onboarding: [
                { name: 'Set PIN', image: 'https://placehold.co/360x640/20298B/white?text=Set+PIN+Screen' },
                { name: 'Set Biometric', image: 'https://placehold.co/360x640/3B82F6/white?text=Biometric+Screen' }
            ],
            appId: 'APP-' + id.substring(4),
            packageName: 'com.paydia.' + appName.toLowerCase(),
            appLogoUrl: `/app-preview/icons/${id}/logo.svg`,
            baseUrl: 'https://api.' + appName.toLowerCase() + '.id',
            tosText: 'Syarat & Ketentuan Penggunaan Aplikasi Whitelabel ini diatur oleh Paydia dan mitra partner. Dengan menggunakan aplikasi ini, Anda setuju untuk mematuhi seluruh hukum yang berlaku di Republik Indonesia serta batasan limit transaksi harian yang ditetapkan.',
            socialMedia: {
                facebook: 'https://facebook.com/' + appName.toLowerCase(),
                tiktok: 'https://tiktok.com/@' + appName.toLowerCase(),
                instagram: 'https://instagram.com/@' + appName.toLowerCase(),
                twitter: 'https://twitter.com/@' + appName.toLowerCase()
            },
            languages: ['Bahasa Indonesia', 'English'],
            supportEmail: 'support@' + appName.toLowerCase() + '.id',
            callCenter: '1500300',
            whatsapp: '+6281234567890',
            limits: {
                perTransaction: 5000000,
                perDay: 25000000,
                maxBalance: 10000000
            },
            updatedAt: '2026-05-30 09:00:00'
        };
    };

    const SEED_CONFIGS = {
        'TNT-001': {
            ...generateDefaultConfig('TNT-001', 'DanaKu'),
            tosUrl: 'https://danaku.id/tos',
            privacyUrl: 'https://danaku.id/privacy',
            supportEmail: 'support@danaku.id',
            whatsapp: '+628111222333'
        },
        'TNT-002': {
            ...generateDefaultConfig('TNT-002', 'PayEase'),
            supportEmail: 'help@payease.id',
            whatsapp: '+628222333444'
        },
        'TNT-003': generateDefaultConfig('TNT-003', 'KreasiPay'),
        'TNT-004': { ...generateDefaultConfig('TNT-004', 'GAPay'), isWhitelabelActive: false },
        'TNT-005': generateDefaultConfig('TNT-005', 'ElangPay'),
        'TNT-006': generateDefaultConfig('TNT-006', 'ObsidianPay'),
        'TNT-007': generateDefaultConfig('TNT-007', 'LuminaPay'),
        'TNT-008': generateDefaultConfig('TNT-008', 'ClanPay'),
        'TNT-009': generateDefaultConfig('TNT-009', 'LuminaTech'),
        'TNT-010': generateDefaultConfig('TNT-010', 'StratosPay'),
        'TNT-011': generateDefaultConfig('TNT-011', 'SnapPay'),
        'TNT-012': generateDefaultConfig('TNT-012', 'sasasPay')
    };

    // ── Seed Data: Users per Tenant ──
    const SEED_USERS = {
        'TNT-001': [
            { id: 'USR-001-001', name: 'DARREN ADLAN EDNAWAN SUJONO', phone: '089632848293', email: 'adlan.darren26@gmail.com', dob: '1990-05-15', status: 'Active', balance: 10000, totalTrx: 45, registeredAt: '2026-05-29 11:24:48', lastActivity: '2026-05-29 11:29:52', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-002': [
            { id: 'USR-002-001', name: 'Ariskurniawan', phone: '082244274194', email: 'oaoaoa@gmail.com', dob: '1993-04-18', status: 'Active', balance: 484000, totalTrx: 120, registeredAt: '2026-05-26 16:00:59', lastActivity: '2026-05-28 14:28:41', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-003': [
            { id: 'USR-003-001', name: 'nirza', phone: '089667711222', email: 'wowitip421@nriza.com', dob: '1995-05-15', status: 'Active', balance: 0, totalTrx: 12, registeredAt: '2026-05-25 14:16:05', lastActivity: '', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-004': [
            { id: 'USR-004-001', name: 'Test aja', phone: '08988888999', email: 'aja@gmail.com', dob: '1995-05-15', status: 'Active', balance: 0, totalTrx: 0, registeredAt: '2026-05-25 14:11:12', lastActivity: '', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-005': [
            { id: 'USR-005-001', name: 'sungjinwo', phone: '08554941616', email: 'sung@gmail.com', dob: '1995-05-15', status: 'Active', balance: 10000, totalTrx: 5, registeredAt: '2026-05-25 14:09:56', lastActivity: '2026-05-25 14:10:07', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-006': [
            { id: 'USR-006-001', name: 'Rani', phone: '085710915509', email: 'rykdmaharani0311@gmail.com', dob: '1995-05-15', status: 'Active', balance: 0, totalTrx: 0, registeredAt: '2026-05-22 14:45:24', lastActivity: '', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-010': [
            { id: 'USR-010-001', name: 'BAMBANG DWI', phone: '0851283516351', email: 'bambang@stratos.com', dob: '1990-11-20', status: 'Active', balance: 430000, totalTrx: 34, registeredAt: '2026-05-20 11:42:03', lastActivity: '2026-05-20 18:00:50', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-009': [
            { id: 'USR-009-001', name: 'ALFAN QA', phone: '081290238465', email: 'alfanqa.kopnus@yopmail.com', dob: '1995-05-15', status: 'Active', balance: 0, totalTrx: 0, registeredAt: '2026-05-19 16:01:07', lastActivity: '', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-011': [
            { id: 'USR-011-001', name: 'TIJANI RIJENDRES', phone: '081200000007', email: 'testdev@mail.com', dob: '1995-05-15', status: 'Active', balance: 0, totalTrx: 0, registeredAt: '2026-05-13 10:47:38', lastActivity: '', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ],
        'TNT-012': [
            { id: 'USR-012-001', name: 'Dion', phone: '087885900280', email: 'dion.scholus@gmail.com', dob: '1995-05-15', status: 'Active', balance: 999990, totalTrx: 150, registeredAt: '2026-05-11 17:05:58', lastActivity: '2026-05-18 16:15:39', statusDormant: 'In 11 month', preKyc: true, userType: 'user' }
        ]
    };

    // ── Seed Data: Transactions per Tenant ──
    const SEED_TRX = {
        'TNT-001': [
            { id: 'TRX-001-0001', userId: 'USR-001-001', userName: 'DARREN ADLAN EDNAWAN SUJONO', userPhone: '089632848293', type: 'transfer', nominal: 10000, fee: 0, status: 'Berhasil', recipientName: 'Siti Rahayu', recipientPhone: '081298765432', refNo: '260529000001', date: '2026-05-29 11:29:52', category: 'Uang Masuk - Transfer Bisnis', tenantId: 'TNT-001' }
        ],
        'TNT-002': [
            { id: 'TRX-002-0014', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 2000, fee: 0, status: 'Berhasil', recipientName: '', recipientPhone: '', refNo: '260528000014', date: '2026-05-28 14:28:41', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' },
            { id: 'TRX-002-0013', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 1000, fee: 0, status: 'Berhasil', recipientName: '', recipientPhone: '', refNo: '260528000013', date: '2026-05-28 14:25:29', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' },
            { id: 'TRX-002-0012', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 1000, fee: 0, status: 'Buat', recipientName: '', recipientPhone: '', refNo: '260528000012', date: '2026-05-28 14:20:18', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' },
            { id: 'TRX-002-0011', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 1000, fee: 0, status: 'Buat', recipientName: '', recipientPhone: '', refNo: '260528000011', date: '2026-05-28 14:19:43', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' },
            { id: 'TRX-002-0010', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 2000, fee: 0, status: 'Berhasil', recipientName: '', recipientPhone: '', refNo: '260528000010', date: '2026-05-28 14:15:43', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' },
            { id: 'TRX-002-0009', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 1000, fee: 0, status: 'Berhasil', recipientName: '', recipientPhone: '', refNo: '260528000009', date: '2026-05-28 14:10:46', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' },
            { id: 'TRX-002-0008', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 1000, fee: 0, status: 'Berhasil', recipientName: '', recipientPhone: '', refNo: '260528000008', date: '2026-05-28 14:06:40', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' },
            { id: 'TRX-002-0007', userId: 'USR-002-001', userName: 'Ariskurniawan', userPhone: '082244274194', type: 'qris', nominal: 1000, fee: 0, status: 'Berhasil', recipientName: '', recipientPhone: '', refNo: '260528000007', date: '2026-05-28 14:05:20', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-002' }
        ],
        'TNT-003': [
            { id: 'TRX-003-0006', userId: 'USR-003-001', userName: 'nirza', userPhone: '089667711222', type: 'qris', nominal: 9000, fee: 0, status: 'Berhasil', recipientName: '', recipientPhone: '', refNo: '260528000006', date: '2026-05-28 11:16:28', category: 'Merchant - Bayar Merchant', tenantId: 'TNT-003' }
        ],
        'TNT-004': [], 'TNT-005': [], 'TNT-006': [], 'TNT-007': [], 'TNT-008': [], 'TNT-009': [], 'TNT-010': [], 'TNT-011': [],
        'TNT-012': [
            { id: 'TRX-012-0001', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'transfer', nominal: 1000000, fee: 0, status: 'Berhasil', recipientName: 'BCA', recipientPhone: '', refNo: '260531000001', date: '2026-05-31 21:15:00', category: 'Bank Transfer', tenantId: 'TNT-012' },
            { id: 'TRX-012-0002', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'topup', nominal: 1000000, fee: 0, status: 'Berhasil', recipientName: '-', recipientPhone: '', refNo: '260529000002', date: '2026-05-29 10:41:00', category: 'Top Up Transfer Business', tenantId: 'TNT-012' },
            { id: 'TRX-012-0003', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'topup', nominal: 995000, fee: 0, status: 'Gagal', recipientName: 'Alfamart, Alfamidi, Dan+Dan', recipientPhone: '', refNo: '260522000003', date: '2026-05-22 11:34:00', category: 'Top Up Retail', tenantId: 'TNT-012' },
            { id: 'TRX-012-0004', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'payment', nominal: 1, fee: 0, status: 'Berhasil', recipientName: 'Musholla Al-Ikhlas', recipientPhone: '', refNo: '260508000004', date: '2026-05-08 13:56:00', category: 'Payment', tenantId: 'TNT-012' },
            { id: 'TRX-012-0005', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'payment', nominal: 1, fee: 0, status: 'Berhasil', recipientName: 'Musholla Al-Ikhlas', recipientPhone: '', refNo: '260508000005', date: '2026-05-08 13:55:00', category: 'Payment', tenantId: 'TNT-012' },
            { id: 'TRX-012-0006', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'payment', nominal: 1, fee: 0, status: 'Berhasil', recipientName: 'Musholla Al-Ikhlas', recipientPhone: '', refNo: '260508000006', date: '2026-05-08 13:54:00', category: 'Payment', tenantId: 'TNT-012' },
            { id: 'TRX-012-0007', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'payment', nominal: 1, fee: 0, status: 'Berhasil', recipientName: 'Musholla Al-Ikhlas', recipientPhone: '', refNo: '260508000007', date: '2026-05-08 13:51:00', category: 'Payment', tenantId: 'TNT-012' },
            { id: 'TRX-012-0008', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'payment', nominal: 1, fee: 0, status: 'Berhasil', recipientName: 'Musholla Al-Ikhlas', recipientPhone: '', refNo: '260508000008', date: '2026-05-08 11:44:00', category: 'Payment', tenantId: 'TNT-012' },
            { id: 'TRX-012-0009', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'payment', nominal: 5000, fee: 0, status: 'Berhasil', recipientName: 'NUR HOLIS, Makanan & Minu', recipientPhone: '', refNo: '260507000009', date: '2026-05-07 18:35:00', category: 'Payment', tenantId: 'TNT-012' },
            { id: 'TRX-012-0010', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'payment', nominal: 6500, fee: 0, status: 'Berhasil', recipientName: 'Pulsa', recipientPhone: '', refNo: '260507000010', date: '2026-05-07 16:18:00', category: 'Digital Transaction', tenantId: 'TNT-012' },
            { id: 'TRX-012-0011', userId: 'USR-012-001', userName: 'Dion', userPhone: '087885900280', type: 'topup', nominal: 20066, fee: 0, status: 'Gagal', recipientName: 'BCA', recipientPhone: '', refNo: '260507000011', date: '2026-05-07 12:36:00', category: 'Top Up Bank Transfer', tenantId: 'TNT-012' }
        ]
    };

    // ── Generated filler users/transactions so every tenant has ≥12 of each ──
    // (deterministic, index-based — no Math.random — appended after the named anchors above)
    const FILLER_NAMES = [
        'Budi Santoso', 'Siti Nurhaliza', 'Agus Wijaya', 'Dewi Lestari', 'Rudi Hartono',
        'Ani Suryani', 'Bambang Setiawan', 'Fitri Handayani', 'Joko Susilo', 'Rina Marlina',
        'Hendra Gunawan', 'Yuni Astuti', 'Andi Firmansyah', 'Lina Kartika', 'Wahyu Ramadhan', 'Putri Amelia'
    ];
    const TENANT_NUMS = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', '011', '012'];
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
            const round = Math.floor(i / FILLER_NAMES.length);
            const name = FILLER_NAMES[i % FILLER_NAMES.length] + (round > 0 ? ' ' + (round + 1) : '');
            const day = (seq * 3) % 28 + 1;
            const active = seq % 4 !== 0;
            list.push({
                id: `USR-${tnum}-${pad3(seq)}`,
                name,
                phone: '08' + String(1000000000 + Number(tnum) * 7654321 + seq * 911).slice(-9),
                email: name.toLowerCase().replace(/\s+/g, '.') + seq + '@mail.com',
                dob: `199${seq % 10}-0${(seq % 9) + 1}-1${seq % 9}`,
                status: active ? 'Active' : 'Nonaktif',
                balance: (seq * 15000) % 750000,
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
        let seq = maxSuffix(list, /TRX-\d+-(\d+)/) + 1, i = 0;
        while (list.length < minCount) {
            const user = users[i % users.length];
            const type = TRX_TYPES[i % TRX_TYPES.length];
            const day = (seq * 2) % 28 + 1;
            const status = seq % 11 === 0 ? 'Diproses' : (seq % 7 === 0 ? 'Gagal' : 'Berhasil');
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

    TENANT_NUMS.forEach(tnum => {
        const tid = `TNT-${tnum}`;
        ensureMinUsers(tid, tnum, 12);
        ensureMinTransactions(tid, tnum, 12);
    });

    // ── Seed Data: Requests ──
    const SEED_REQUESTS = [
        { id: 'REQ-001', tenantId: 'TNT-001', tenantName: 'DanaKu', type: 'Splash Screen', description: 'Ganti splash screen dengan desain baru sesuai brand guideline terbaru.', attachments: ['splash_v2.png'], status: 'Menunggu Review', createdAt: '2026-05-25 10:00:00', updatedAt: '2026-05-25 10:00:00', notes: '' },
        { id: 'REQ-002', tenantId: 'TNT-002', tenantName: 'PayEase', type: 'Nama Aplikasi', description: 'Ubah nama aplikasi dari PayEase ke PayEase Pro untuk versi premium.', attachments: [], status: 'Sedang Dikerjakan', createdAt: '2026-05-20 14:00:00', updatedAt: '2026-05-26 09:00:00', notes: 'Tim dev sedang update package name' }
    ];

    // ── Seed Data: Audit Log ──
    const SEED_AUDIT_LOG = [
        { id: 'AUD-001', timestamp: '2026-05-28 09:01:00', actor: 'admin@paydia.id', actorRole: 'Admin Internal', action: 'login', objectType: 'session', objectId: '-', tenantId: '-', description: 'Login ke Dashboard Internal', before: null, after: null },
        { id: 'AUD-002', timestamp: '2026-05-28 09:15:00', actor: 'partner@danaku.id', actorRole: 'Partner', action: 'update_config', objectType: 'config', objectId: 'TNT-001', tenantId: 'TNT-001', description: 'Ubah warna primer tema', before: '#4F46E5', after: '#6C3CE1' },
        { id: 'AUD-003', timestamp: '2028-05-25 15:25:46', actor: 'admin@paydia.id', actorRole: 'Admin Internal', action: 'update_config', objectType: 'config', objectId: 'TNT-003', tenantId: 'TNT-003', description: 'Konfigurasi Whitelabel pertama kali disimpan', before: null, after: 'Warna: #20298B, App: KreasiPay' },
        { id: 'AUD-004', timestamp: '2028-05-25 11:55:34', actor: 'admin@paydia.id', actorRole: 'Admin Internal', action: 'onboard_merchant', objectType: 'merchant', objectId: 'TNT-004', tenantId: 'TNT-004', description: 'Registrasi merchant baru: Testing GA', before: null, after: 'Waiting KYC' }
    ];

    // ── Seed Data: Payin Transactions ──
    const SEED_PAYIN = [
        { refNo: '571a2e6e-9526-44ef-82c5-916b253704ff', vendor: '', date: '2026-05-20 13:47:09', category: 'payin-topup', merchantMid: '230503001000000', merchantName: 'Farhan', nominal: 100000, adminFee: 0, total: 100016, status: 'Gagal' },
        { refNo: 'c17cea0a-86f0-424b-b33d-c1e98cc1e97e', vendor: '', date: '2026-05-19 11:01:44', category: 'payin-topup', merchantMid: '250519005000000', merchantName: 'Paydia Dev', nominal: 1000000, adminFee: 0, total: 1000013, status: 'Gagal' },
        { refNo: 'ea8edb25-9c17-468e-98f6-5cd4d20eb010', vendor: '', date: '2026-05-19 11:00:58', category: 'payin-topup', merchantMid: '250519005000000', merchantName: 'Paydia Dev', nominal: 1000000, adminFee: 0, total: 1000010, status: 'Gagal' },
        { refNo: 'd874d3d8-b253-44df-84a8-052909befdc4', vendor: '', date: '2026-05-19 11:00:51', category: 'payin-topup', merchantMid: '250519005000000', merchantName: 'Paydia Dev', nominal: 1000000, adminFee: 0, total: 1000015, status: 'Gagal' },
        { refNo: 'bede27a4-ed9c-4201-bcfe-d0d798089fa0', vendor: '', date: '2026-05-19 10:58:43', category: 'payin-topup', merchantMid: '250519005000000', merchantName: 'Paydia Dev', nominal: 10000000, adminFee: 0, total: 10000019, status: 'Gagal' },
        { refNo: 'cab86c4f-3165-460a-a433-70cc3fc30559', vendor: '', date: '2026-05-13 16:35:16', category: 'payin-topup', merchantMid: '250519005000000', merchantName: 'Paydia Dev', nominal: 100000, adminFee: 0, total: 100012, status: 'Gagal' },
        { refNo: '3e889fbc-566a-4c4b-b114-17db352622b9', vendor: '', date: '2026-05-13 16:35:07', category: 'payin-topup', merchantMid: '250519005000000', merchantName: 'Paydia Dev', nominal: 100000, adminFee: 0, total: 100018, status: 'Gagal' },
        { refNo: '2540caaa-c347-4f2e-9d5f-bc1d8c855178', vendor: 'mitracomm', date: '2026-05-11 13:28:28', category: 'payin-payment', merchantMid: '250611001000000', merchantName: 'Koperasi', nominal: 1000000, adminFee: 0, total: 1000000, status: 'Sukses' },
        { refNo: '152d752f-042d-4b83-8d14-1d39024b2949', vendor: 'mitracomm', date: '2026-05-11 09:56:15', category: 'payin-payment', merchantMid: '250611001000000', merchantName: 'Koperasi', nominal: 1397500, adminFee: 0, total: 1397500, status: 'Sukses' },
        { refNo: '3835a6a1-c0bd-4cf9-8450-eef9f8d16590', vendor: 'mitracomm', date: '2026-05-11 08:49:36', category: 'payin-payment', merchantMid: '250611001000000', merchantName: 'Koperasi', nominal: 6249000, adminFee: 0, total: 6249000, status: 'Sukses' }
    ];

    // ── Seed Data: QRIS MPM Transactions ──
    const SEED_QRIS_MPM = [
        { id: 'TRX-MPM-001', refNo: '123456789012', date: '2026-05-31 14:22:05', merchantMid: '200525002000000', merchantName: 'PT KREASI MITRAKA DIGITARA', category: 'Bayar Merchant', status: 'Sukses', nominal: 150000, tip: 0, mdr: 1050, total: 151050, vendor: 'Paydia', callbackStatus: 'Sukses' },
        { id: 'TRX-MPM-002', refNo: '123456789013', date: '2026-05-31 15:30:12', merchantMid: '280519005000000', merchantName: 'PT OBSIDIAN', category: 'Bayar Merchant', status: 'Sukses', nominal: 50000, tip: 5000, mdr: 350, total: 55350, vendor: 'Paydia', callbackStatus: 'Gagal' },
        { id: 'TRX-MPM-003', refNo: '123456789014', date: '2026-05-30 10:12:44', merchantMid: '250611001000000', merchantName: 'Koperasi', category: 'Pengembalian Pembayaran', status: 'Sukses', nominal: 200000, tip: 0, mdr: 1400, total: 198600, vendor: 'Paydia', callbackStatus: 'Sukses' },
        { id: 'TRX-MPM-004', refNo: '123456789015', date: '2026-05-29 18:45:00', merchantMid: '280519006000000', merchantName: 'PT ELANG TEKNO INDO', category: 'Dispute', status: 'Proses', nominal: 1200000, tip: 0, mdr: 8400, total: 1200000, vendor: 'Paydia', callbackStatus: 'Pending' },
        { id: 'TRX-MPM-005', refNo: '123456789016', date: '2026-05-28 09:30:15', merchantMid: '230503001000000', merchantName: 'Farhan', category: 'Auth Payment', status: 'Sukses', nominal: 85000, tip: 0, mdr: 595, total: 85000, vendor: 'Paydia', callbackStatus: 'Sukses' },
        { id: 'TRX-MPM-006', refNo: '123456789017', date: '2026-05-27 11:20:10', merchantMid: '230503001000000', merchantName: 'Farhan', category: 'Auth Payment Void', status: 'Gagal', nominal: 85000, tip: 0, mdr: 0, total: 85000, vendor: 'Paydia', callbackStatus: 'Gagal' }
    ];

    // ── Initialize / Seed Database ──
    function initialize(forceReset = false) {
        const currentVersion = '19'; // Increment to reset cache and apply new schema
        const seedVersion = localStorage.getItem('paydia_wl_seed_version');
        if (seedVersion !== currentVersion) {
            forceReset = true;
            localStorage.setItem('paydia_wl_seed_version', currentVersion);
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
            if (e.key && e.key.startsWith('paydia_wl_')) {
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
