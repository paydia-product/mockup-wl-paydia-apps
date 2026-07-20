/* ============================================
   Paydia Bisnis – QRIS Auto Reconcile Dashboard
   Dispute Data Page Logic
   ============================================ */

// ── Seed Transactions Database ──
const rawTransactions = [
    // --- ACQUIRER MATCHED ---
    { id: 'TX-ACQ-10001', refNo: 'REF-20260527-010', date: '2026-05-27 08:12:44', nominal: 150000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '00', switching: 'Rintis', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-10002', refNo: 'REF-20260527-011', date: '2026-05-27 08:35:19', nominal: 45000, merchantId: 'MID-88134', merchantName: 'Indomaret', rc: '00', switching: 'Jalin', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-10003', refNo: 'REF-20260527-012', date: '2026-05-27 09:04:11', nominal: 1250000, merchantId: 'MID-88220', merchantName: 'Sushi Tei', rc: '00', switching: 'Artajasa', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-10004', refNo: 'REF-20260527-013', date: '2026-05-27 10:14:02', nominal: 87000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '00', switching: 'Alto', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-10005', refNo: 'REF-20260527-014', date: '2026-05-27 11:22:58', nominal: 32000, merchantId: 'MID-88155', merchantName: 'Alfa Mart', rc: '00', switching: 'Rintis', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-10006', refNo: 'REF-20260527-015', date: '2026-05-27 14:02:11', nominal: 105000, merchantId: 'MID-88301', merchantName: 'Starbucks', rc: '00', switching: 'Jalin', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Crossborder', disputeRef: null },
    
    // --- ACQUIRER UNMATCHED ---
    { id: 'TX-ACQ-20001', refNo: 'REF-20260527-020', date: '2026-05-27 07:11:02', nominal: 75000, merchantId: 'MID-88134', merchantName: 'Indomaret', rc: '00', switching: 'Jalin', statusRekon: 'Unmatched', label: 'Switching-Only', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-20002', refNo: 'REF-20260527-021', date: '2026-05-27 09:44:32', nominal: 220000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '00', switching: 'Rintis', statusRekon: 'Unmatched', label: 'Paydia-Only', flaggingStatus: 'On-Hold', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: 'DISP-001' },
    { id: 'TX-ACQ-20003', refNo: 'REF-20260527-022', date: '2026-05-27 10:05:14', nominal: 500000, merchantId: 'MID-88220', merchantName: 'Sushi Tei', rc: '68', switching: 'Artajasa', statusRekon: 'Unmatched', label: 'Paydia-Only', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-20004', refNo: 'REF-20260527-023', date: '2026-05-27 15:30:19', nominal: 180000, merchantId: 'MID-88301', merchantName: 'Starbucks', rc: '00', switching: 'Alto', statusRekon: 'Unmatched', label: 'Switching-Only', flaggingStatus: 'Settled', tipe: 'Acquirer', skema: 'MPM', domestic: 'Crossborder', disputeRef: null },
    
    // --- ACQUIRER DECLINED ---
    { id: 'TX-ACQ-30001', refNo: 'REF-20260527-030', date: '2026-05-27 08:02:11', nominal: 11000, merchantId: 'MID-88134', merchantName: 'Indomaret', rc: '51', switching: 'Jalin', statusRekon: 'Declined', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ACQ-30002', refNo: 'REF-20260527-031', date: '2026-05-27 11:45:00', nominal: 95000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '05', switching: 'Rintis', statusRekon: 'Declined', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    
    // --- ISSUER MATCHED ---
    { id: 'TX-ISS-10001', refNo: 'REF-20260527-040', date: '2026-05-27 08:05:22', nominal: 24000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '00', switching: 'Jalin', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ISS-10002', refNo: 'REF-20260527-041', date: '2026-05-27 09:12:18', nominal: 155000, merchantId: 'MID-99120', merchantName: 'Solaria Mall', rc: '00', switching: 'Rintis', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ISS-10003', refNo: 'REF-20260527-042', date: '2026-05-27 10:20:11', nominal: 60000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '00', switching: 'Alto', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ISS-10004', refNo: 'REF-20260527-043', date: '2026-05-27 13:14:02', nominal: 320000, merchantId: 'MID-99440', merchantName: 'Shell Gandaria', rc: '00', switching: 'Artajasa', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
    
    // --- ISSUER UNMATCHED ---
    { id: 'TX-ISS-20001', refNo: 'REF-20260527-050', date: '2026-05-27 08:22:19', nominal: 89000, merchantId: 'MID-99120', merchantName: 'Solaria Mall', rc: '00', switching: 'Rintis', statusRekon: 'Unmatched', label: 'Switching-Only', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    { id: 'TX-ISS-20002', refNo: 'REF-20260527-051', date: '2026-05-27 11:05:44', nominal: 45000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '68', switching: 'Jalin', statusRekon: 'Unmatched', label: 'Paydia-Only', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
    
    // --- ISSUER DECLINED ---
    { id: 'TX-ISS-30001', refNo: 'REF-20260527-060', date: '2026-05-27 07:44:06', nominal: 18000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '14', switching: 'Jalin', statusRekon: 'Declined', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null }
];

const seedLogs = [
    { id: 9145, tanggal: '28-05-2026 15:01:39', container: 'paydia-account', type: 'merchant-login', detail: 'email : incarnata.maria@pt-mfa.com\nuser.type : merchant', ip: '36.75.6.222' },
    { id: 9144, tanggal: '28-05-2026 15:00:31', container: 'paydia-account', type: 'merchant-login', detail: 'email : incarnata.maria@pt-mfa.com\nuser.type : merchant', ip: '36.75.6.222' },
    { id: 9143, tanggal: '28-05-2026 14:57:42', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : kenny@paydia.id\nuser.type : admin', ip: '125.161.77.69' },
    { id: 9142, tanggal: '28-05-2026 14:42:06', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : dion@paydia.id\nuser.type : admin', ip: '125.161.77.69' },
    { id: 9141, tanggal: '28-05-2026 14:28:23', container: 'paydia-account', type: 'merchant-login', detail: 'email : incarnata.maria@pt-mfa.com\nuser.type : merchant', ip: '38.75.8.222' },
    { id: 9140, tanggal: '28-05-2026 11:31:14', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : kenny@paydia.id\nuser.type : admin', ip: '125.161.77.69' },
    { id: 9139, tanggal: '28-05-2026 15:54:41', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : aldy@merchant.id\nuser.type : admin', ip: '103.177.100.34' }
];

// ── State Management ──
let transactions = [];
let disputes = [];

let permissions = {
    read: true,
    flagging: true,
    inputDispute: true,
    export: true,
    approve: true,
    rerun: true,
    log: true
};

// ── DOM References ──
const filterBtn = document.getElementById('filterBtn');
const filterPanel = document.getElementById('filterPanel');
const resetBtn = document.getElementById('resetBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const exportBtn = document.getElementById('exportBtn');
const btnImportData = document.getElementById('btnImportData');
const importProgressOverlay = document.getElementById('importProgressOverlay');
const importProgressBarFill = document.getElementById('importProgressBarFill');
const importProgressStatus = document.getElementById('importProgressStatus');
const disputeOverlay = document.getElementById('disputeOverlay');
const disputeForm = document.getElementById('disputeForm');
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

// Permissions widget inputs
const permRead = document.getElementById('permRead');
const permFlagging = document.getElementById('permFlagging');
const permInputDispute = document.getElementById('permInputDispute');
const permExport = document.getElementById('permExport');
const permApprove = document.getElementById('permApprove');
const permRerun = document.getElementById('permRerun');
const permLog = document.getElementById('permLog');

function loadPermissions() {
    const saved = localStorage.getItem('paydia_mock_perms');
    if (saved) {
        permissions = JSON.parse(saved);
    } else {
        permissions = {
            read: true,
            flagging: true,
            inputDispute: true,
            export: true,
            approve: true,
            rerun: true,
            log: true
        };
    }
    // Update checkboxes
    if (permRead) permRead.checked = permissions.read;
    if (permFlagging) permFlagging.checked = permissions.flagging;
    if (permInputDispute) permInputDispute.checked = permissions.inputDispute;
    if (permExport) permExport.checked = permissions.export;
    if (permApprove) permApprove.checked = permissions.approve;
    if (permRerun) permRerun.checked = permissions.rerun;
    if (permLog) permLog.checked = permissions.log;
}

function savePermissions() {
    permissions = {
        read: permRead ? permRead.checked : true,
        flagging: permFlagging ? permFlagging.checked : true,
        inputDispute: permInputDispute ? permInputDispute.checked : true,
        export: permExport ? permExport.checked : true,
        approve: permApprove ? permApprove.checked : true,
        rerun: permRerun ? permRerun.checked : true,
        log: permLog ? permLog.checked : true
    };
    localStorage.setItem('paydia_mock_perms', JSON.stringify(permissions));
    applyPermissions();
}

function applyPermissions() {
    // 1. Read permission overlay
    const mainContent = document.querySelector('.main-content');
    const existingOverlay = document.getElementById('permissionErrorOverlay');
    
    if (!permissions.read) {
        if (!existingOverlay && mainContent) {
            const overlay = document.createElement('div');
            overlay.id = 'permissionErrorOverlay';
            overlay.className = 'permission-error-overlay';
            overlay.innerHTML = `
                <div class="permission-error-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h2 class="permission-error-title">Akses Rekonsiliasi Dibatasi</h2>
                <p class="permission-error-desc">
                    Akun Anda tidak memiliki izin <strong>Read Reconcile</strong>. Hubungi administrator sistem untuk meminta akses ke modul ini.
                </p>
            `;
            Array.from(mainContent.children).forEach(child => {
                if (child.id !== 'permissionErrorOverlay' && child.className !== 'breadcrumb') {
                    child.style.display = 'none';
                }
            });
            mainContent.appendChild(overlay);
        }
        return;
    } else {
        if (existingOverlay) {
            existingOverlay.remove();
            if (mainContent) {
                Array.from(mainContent.children).forEach(child => {
                    if (child.className !== 'filter-panel' && child.id !== 'disputeOverlay' && child.id !== 'modalOverlay') {
                        child.style.display = '';
                    }
                });
            }
        }
    }

    // 2. Input Dispute check
    if (btnImportData) {
        btnImportData.style.display = permissions.inputDispute ? '' : 'none';
    }
    
    // 3. Export check
    if (exportBtn) {
        exportBtn.style.display = permissions.export ? '' : 'none';
    }
}

// ── Initialize Dashboard ──
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    loadPermissions();
    applyPermissions();
    bindEvents();
    renderSummary();
    renderTableData();
    initMockDataControl();
});

function initDatabase() {
    const isPopulated = localStorage.getItem('paydia_mock_populated') === 'true';
    if (isPopulated) {
        // Load or initialize transactions
        const savedTrx = localStorage.getItem('paydia_recon_trx');
        if (savedTrx) {
            transactions = JSON.parse(savedTrx);
        } else {
            transactions = [...rawTransactions];
            localStorage.setItem('paydia_recon_trx', JSON.stringify(transactions));
        }

        // Load or initialize disputes
        const savedDis = localStorage.getItem('paydia_disputes');
        if (savedDis) {
            disputes = JSON.parse(savedDis);
            // Migrate old types if they exist in localStorage
            disputes.forEach(d => {
                if (d.type === 'Paydia-Only' || d.type === 'Nominal-Mismatch' || d.type === 'Suspect') d.type = '1st chargeback';
                else if (d.type === 'Switching-Only') d.type = 'good faith';
            });
            localStorage.setItem('paydia_disputes', JSON.stringify(disputes));
        } else {
            disputes = [
                { id: 'DISP-001', refId: 'REF-20260527-021', date: '2026-05-28 09:15:00', type: '1st chargeback', switching: 'Rintis', nominal: 220000, status: 'Open', desc: 'Double payment terdeteksi, saldo merchant terpotong dua kali' },
                { id: 'DISP-002', refId: 'TX-ISS-20001', date: '2026-05-28 09:44:00', type: 'good faith', switching: 'Rintis', nominal: 89000, status: 'Open', desc: 'Dana menggantung di switching, merchant belum terima dana' }
            ];
            localStorage.setItem('paydia_disputes', JSON.stringify(disputes));
        }
    } else {
        transactions = [];
        disputes = [];
    }
}

function saveTrxToStorage() {
    localStorage.setItem('paydia_recon_trx', JSON.stringify(transactions));
}

function saveDisputesToStorage() {
    localStorage.setItem('paydia_disputes', JSON.stringify(disputes));
}

// ── Log Helper ──
function writeLog(type, detail) {
    const savedLogs = localStorage.getItem('paydia_logs');
    let logsList = [];
    if (savedLogs) {
        logsList = JSON.parse(savedLogs);
    } else {
        logsList = [...seedLogs];
    }
    
    // Find max ID
    let maxId = 9138;
    logsList.forEach(l => {
        const numericId = parseInt(l.id);
        if (!isNaN(numericId) && numericId > maxId) {
            maxId = numericId;
        }
    });
    const nextId = maxId + 1;
    
    const now = new Date();
    const dateStr = String(now.getDate()).padStart(2, '0') + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        now.getFullYear() + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
        
    const newLog = {
        id: nextId,
        tanggal: dateStr,
        container: 'paydia-reconcile',
        type: type,
        detail: detail,
        ip: '125.161.77.69'
    };
    
    logsList.unshift(newLog);
    localStorage.setItem('paydia_logs', JSON.stringify(logsList));
}

// ── Summary Cards Calculations ──
function renderSummary() {
    const dateVal = document.getElementById('filterDate').value;
    const switchingVal = document.getElementById('filterSwitching').value;

    let filtered = transactions.filter(t => {
        if (dateVal && !t.date.startsWith(dateVal)) return false;
        if (switchingVal && t.switching !== switchingVal) return false;
        return true;
    });

    const totalTrx = filtered.length;
    const matched = filtered.filter(t => t.statusRekon === 'Matched').length;
    const unmatched = filtered.filter(t => t.statusRekon === 'Unmatched').length;
    const onHold = filtered.filter(t => t.flaggingStatus === 'On-Hold').length;
    
    // Disputes filtered
    let filteredDisputes = disputes.filter(d => {
        if (dateVal && !d.date.startsWith(dateVal)) return false;
        if (switchingVal && d.switching !== switchingVal) return false;
        return true;
    });
    const disputeCount = filteredDisputes.length;

    // Nominal settlement = (matched nominal - matched on-hold) + unmatch nominal that is Settled
    const settleTrx = filtered.filter(t => {
        if (t.statusRekon === 'Matched' && t.flaggingStatus !== 'On-Hold') return true;
        if (t.statusRekon === 'Unmatched' && t.flaggingStatus === 'Settled') return true;
        return false;
    });
    const nominalSettle = settleTrx.reduce((sum, t) => sum + t.nominal, 0);

    document.getElementById('cardTotalTrx').textContent = totalTrx.toLocaleString('id-ID');
    document.getElementById('cardTotalMatch').textContent = matched.toLocaleString('id-ID');
    document.getElementById('cardTotalUnmatch').textContent = unmatched.toLocaleString('id-ID');
    document.getElementById('cardTotalOnhold').textContent = onHold.toLocaleString('id-ID');
    document.getElementById('cardTotalDispute').textContent = disputeCount.toLocaleString('id-ID');
    document.getElementById('cardNominalSettle').textContent = 'Rp' + nominalSettle.toLocaleString('id-ID');
}

// ── Main Rendering ──
function renderTableData() {
    renderSummary();

    const dateVal = document.getElementById('filterDate').value;
    const switchingVal = document.getElementById('filterSwitching').value;
    const typeVal = document.getElementById('filterDisputeType').value;
    const statusVal = document.getElementById('filterStatus').value;
    const searchVal = searchInput.value.trim().toLowerCase();

    const tbody = document.getElementById('disputeTableBody');
    tbody.innerHTML = '';

    let filtered = disputes.filter(d => {
        if (dateVal && !d.date.startsWith(dateVal)) return false;
        if (switchingVal && d.switching !== switchingVal) return false;
        if (typeVal && d.type !== typeVal) return false;
        if (statusVal && d.status !== statusVal) return false;
        if (searchVal && !d.id.toLowerCase().includes(searchVal) && !d.refId.toLowerCase().includes(searchVal)) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);">Tidak ada data dispute</td></tr>`;
        updatePaginationInfo(0);
        return;
    }

    filtered.forEach((d, idx) => {
        const tr = document.createElement('tr');
        
        let statusClass = 'status-proses';
        if (d.status === 'Closed') statusClass = 'status-sukses';

        let displayType = d.type;
        if (d.type === '1st chargeback') displayType = '1st Chargeback';
        else if (d.type === '2nd chargeback') displayType = '2nd Chargeback';
        else if (d.type === 'good faith') displayType = 'Good Faith';

        tr.innerHTML = `
            <td class="col-no">${idx + 1}</td>
            <td><strong style="color:var(--primary-dark);">${d.id}</strong></td>
            <td><a href="#" class="ref-link detail-trx-trigger" data-id="${d.refId}">${d.refId}</a></td>
            <td style="font-variant-numeric: tabular-nums;">${d.date}</td>
            <td><span class="request-badge" style="background:var(--primary-bg);color:var(--primary);border:1px solid rgba(99, 102, 241, 0.1);">${displayType}</span></td>
            <td>${d.switching}</td>
            <td><strong>Rp${d.nominal.toLocaleString('id-ID')}</strong></td>
            <td><span class="status-badge ${statusClass}">${d.status}</span></td>
            <td>
                <button class="flag-btn settle ${permissions.inputDispute ? 'btn-edit-dispute' : ''}" data-id="${d.id}" ${permissions.inputDispute ? '' : 'disabled style="opacity: 0.5; cursor: not-allowed;" title="Izin Edit diperlukan"'}>
                    <i class="fas fa-edit"></i> Edit
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updatePaginationInfo(filtered.length);
}

function updatePaginationInfo(count) {
    document.getElementById('paginationInfo').textContent = `1 - ${count} of ${count}`;
}

// ── Open Drill-down Modal ──
function openDetailModal(trxId) {
    const t = transactions.find(item => item.id === trxId || item.refNo === trxId);
    if (!t) {
        showToast('Error', 'Detail transaksi tidak ditemukan');
        return;
    }

    modalBody.innerHTML = `
        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-info-circle"></i> Detail Transaksi</h3>
            <table class="modal-detail-table">
                <tr>
                    <td class="detail-label">Transaction ID</td>
                    <td class="detail-value">${t.id}</td>
                </tr>
                <tr>
                    <td class="detail-label">Reference Number</td>
                    <td class="detail-value">${t.refNo}</td>
                </tr>
                <tr>
                    <td class="detail-label">Tanggal & Waktu</td>
                    <td class="detail-value">${t.date}</td>
                </tr>
                <tr>
                    <td class="detail-label">Kategori / Tipe</td>
                    <td class="detail-value"><span class="request-badge" style="background:#e0e7ff;color:#4338ca;border:1px solid #c7d2fe;">QRIS ${t.tipe}</span></td>
                </tr>
                <tr>
                    <td class="detail-label">Merchant ID</td>
                    <td class="detail-value">${t.merchantId || '-'}</td>
                </tr>
                <tr>
                    <td class="detail-label">Merchant Name</td>
                    <td class="detail-value">${t.merchantName}</td>
                </tr>
            </table>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-coins"></i> Rincian Finansial & Switching</h3>
            <table class="modal-detail-table">
                <tr>
                    <td class="detail-label">Nominal</td>
                    <td class="detail-value"><strong>Rp${t.nominal.toLocaleString('id-ID')}</strong></td>
                </tr>
                <tr>
                    <td class="detail-label">Response Code</td>
                    <td class="detail-value"><span class="status-badge status-${t.rc === '00' ? 'sukses' : 'proses'}">${t.rc}</span></td>
                </tr>
                <tr>
                    <td class="detail-label">Switching Partner</td>
                    <td class="detail-value">${t.switching}</td>
                </tr>
                <tr>
                    <td class="detail-label">Skema Transaksi</td>
                    <td class="detail-value"><span class="request-badge" style="background:#f3e8ff;color:#7c3aed;border:1px solid #e9d5ff;">QRIS ${t.skema}</span></td>
                </tr>
                <tr>
                    <td class="detail-label">Jenis Kartu / Skema</td>
                    <td class="detail-value">${t.domestic}</td>
                </tr>
            </table>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-check-double"></i> Rekonsiliasi & Flagging</h3>
            <table class="modal-detail-table">
                <tr>
                    <td class="detail-label">Status Matching</td>
                    <td class="detail-value">
                        <span class="status-badge status-${t.statusRekon === 'Matched' ? 'sukses' : 'proses'}">${t.statusRekon}</span>
                    </td>
                </tr>
                <tr>
                    <td class="detail-label">Label Detail</td>
                    <td class="detail-value">${t.label}</td>
                </tr>
                <tr>
                     <td class="detail-label">Flagging Ops</td>
                     <td class="detail-value">
                          <span class="status-badge status-${t.flaggingStatus === 'Settled' ? 'sukses' : (t.flaggingStatus === 'On-Hold' ? 'proses' : 'gagal')}">${t.flaggingStatus}</span>
                     </td>
                </tr>
                <tr>
                    <td class="detail-label">Dispute Reference</td>
                    <td class="detail-value">${t.disputeRef ? `<strong style="color:var(--primary);">${t.disputeRef}</strong>` : '-'}</td>
                </tr>
            </table>
        </div>
    `;
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ── Import Dispute Data Simulation ──
let importInterval = null;

function startImportDisputeData() {
    if (!permissions.inputDispute) {
        showToast('Access Denied', 'Anda tidak memiliki izin untuk mengimport dispute.');
        return;
    }
    
    importProgressOverlay.classList.add('show');
    importProgressBarFill.style.width = '0%';
    importProgressStatus.textContent = 'Membaca file (0%)';
    
    let percent = 0;
    if (importInterval) clearInterval(importInterval);
    
    importInterval = setInterval(() => {
        percent += 10;
        importProgressBarFill.style.width = percent + '%';
        importProgressStatus.textContent = `Memproses data dispute (${percent}%)`;
        
        if (percent === 30) {
            importProgressStatus.textContent = 'Menganalisis kolom dan data...';
        } else if (percent === 70) {
            importProgressStatus.textContent = 'Menyimpan entri dispute ke database...';
        }
        
        if (percent >= 100) {
            clearInterval(importInterval);
            setTimeout(() => {
                importProgressOverlay.classList.remove('show');
                
                // Add the 3 new mock disputes if not already added
                const checkExists = disputes.some(d => d.id === 'DISP-003');
                if (!checkExists) {
                    disputes.push(
                        { id: 'DISP-003', refId: 'TX-ACQ-20004', date: '2026-05-28 10:15:00', type: '1st chargeback', switching: 'Alto', nominal: 180000, status: 'Open', desc: 'Chargeback diajukan oleh pemegang kartu (1st chargeback)' },
                        { id: 'DISP-004', refId: 'TX-ACQ-20001', date: '2026-05-28 10:20:00', type: '2nd chargeback', switching: 'Jalin', nominal: 75000, status: 'Open', desc: 'Persetujuan dispute ditolak switching, mengajukan 2nd chargeback' },
                        { id: 'DISP-005', refId: 'TX-ACQ-20002', date: '2026-05-28 10:25:00', type: 'good faith', switching: 'Rintis', nominal: 220000, status: 'Open', desc: 'Penyelesaian secara good faith dengan pihak acquirer' }
                    );
                    saveDisputesToStorage();
                }
                
                writeLog('Import Dispute', 'email : dion@paydia.id\naction : Mengimport data dispute dari CSV. 3 entri baru ditambahkan.');
                showToast('Import Berhasil', '3 data dispute baru berhasil diimport dari file CSV.');
                renderTableData();
            }, 300);
        }
    }, 150);
}

// ── Open Input Dispute Form ──
function openDisputeForm(id = null) {
    if (!permissions.inputDispute) {
        showToast('Access Denied', 'Anda tidak memiliki izin untuk menginput dispute.');
        return;
    }
    disputeForm.reset();
    document.getElementById('disputeRefIdError').classList.remove('show');
    document.getElementById('disputeTypeError').classList.remove('show');
    document.getElementById('disputeNominalError').classList.remove('show');
    document.getElementById('disputeSwitchingError').classList.remove('show');

    if (id) {
        const d = disputes.find(item => item.id === id);
        if (!d) return;

        document.getElementById('disputeModalTitle').textContent = 'Edit Dispute Record';
        document.getElementById('disputeEditIndex').value = d.id;
        document.getElementById('disputeRefId').value = d.refId;
        document.getElementById('disputeType').value = d.type;
        document.getElementById('disputeNominal').value = d.nominal;
        document.getElementById('disputeSwitching').value = d.switching;
        document.getElementById('disputeDesc').value = d.desc;
    } else {
        document.getElementById('disputeModalTitle').textContent = 'Input Dispute Baru';
        document.getElementById('disputeEditIndex').value = '';
    }

    disputeOverlay.classList.add('show');
}

function handleDisputeSubmit(e) {
    e.preventDefault();

    const editId = document.getElementById('disputeEditIndex').value;
    const refId = document.getElementById('disputeRefId').value.trim();
    const type = document.getElementById('disputeType').value;
    const nominal = parseFloat(document.getElementById('disputeNominal').value);
    const switching = document.getElementById('disputeSwitching').value;
    const desc = document.getElementById('disputeDesc').value.trim();

    let valid = true;

    if (!refId) {
        document.getElementById('disputeRefIdError').classList.add('show');
        valid = false;
    }
    if (!type) {
        document.getElementById('disputeTypeError').classList.add('show');
        valid = false;
    }
    if (isNaN(nominal) || nominal <= 0) {
        document.getElementById('disputeNominalError').classList.add('show');
        valid = false;
    }
    if (!switching) {
        document.getElementById('disputeSwitchingError').classList.add('show');
        valid = false;
    }

    if (!valid) return;

    if (editId) {
        const idx = disputes.findIndex(d => d.id === editId);
        if (idx !== -1) {
            disputes[idx].refId = refId;
            disputes[idx].type = type;
            disputes[idx].nominal = nominal;
            disputes[idx].switching = switching;
            disputes[idx].desc = desc;

            writeLog('Edit Dispute', `email : dion@paydia.id\naction : Mengedit dispute record ${editId} (Ref: ${refId})`);
            showToast('Dispute Diupdate', `Dispute ${editId} berhasil diubah.`);
        }
    } else {
        const dispId = 'DISP-' + String(disputes.length + 1).padStart(3, '0');
        const now = new Date();
        const dateStr = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':00';

        const newDisp = {
            id: dispId,
            refId: refId,
            date: dateStr,
            type,
            switching,
            nominal,
            status: 'Open',
            desc
        };
        disputes.unshift(newDisp);

        // Bind reference back to transaction list if found
        const t = transactions.find(trx => trx.id === refId || trx.refNo === refId);
        if (t) {
            t.disputeRef = dispId;
            saveTrxToStorage();
        }

        writeLog('Input Dispute', `email : dion@paydia.id\naction : Memasukkan dispute baru ${dispId} untuk ID ${refId}`);
        showToast('Dispute Disimpan', `Dispute record ${dispId} berhasil dibuat.`);
    }

    saveDisputesToStorage();
    disputeOverlay.classList.remove('show');
    renderTableData();
}

// ── Bind Interactive Events ──
function bindEvents() {
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        filterBtn.classList.toggle('active');
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('filterDate').value = '';
        document.getElementById('filterSwitching').selectedIndex = 0;
        document.getElementById('filterDisputeType').selectedIndex = 0;
        document.getElementById('filterStatus').selectedIndex = 0;
        searchInput.value = '';
        showToast('Filter Direset', 'Semua filter pencarian direset.');
        renderTableData();
    });

    searchBtn.addEventListener('click', () => {
        renderTableData();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') renderTableData();
    });

    document.querySelectorAll('.filter-group select, #filterDate').forEach(el => {
        el.addEventListener('change', () => {
            renderTableData();
        });
    });

    // Export CSV
    exportBtn.addEventListener('click', () => {
        const dateVal = document.getElementById('filterDate').value || '2026-05-28';
        const switchingVal = document.getElementById('filterSwitching').value || 'Semua';
        
        writeLog('Export CSV', `email : dion@paydia.id\naction : Mengeksport data dispute sesi ${dateVal} (Switching: ${switchingVal})`);
        showToast('Export Selesai', `File export QRIS_Disputes_${dateVal}.csv berhasil diunduh.`);
    });

    if (btnImportData) {
        btnImportData.addEventListener('click', () => {
            startImportDisputeData();
        });
    }

    document.getElementById('disputeClose').addEventListener('click', () => {
        disputeOverlay.classList.remove('show');
    });
    document.getElementById('disputeCancelBtn').addEventListener('click', () => {
        disputeOverlay.classList.remove('show');
    });

    disputeForm.addEventListener('submit', handleDisputeSubmit);

    // Permissions toggles
    const permInputs = [permRead, permFlagging, permInputDispute, permExport, permApprove, permRerun, permLog];
    permInputs.forEach(input => {
        if (input) {
            input.addEventListener('change', () => {
                savePermissions();
            });
        }
    });

    // Permission collapse toggle
    const permissionWidgetToggle = document.getElementById('permissionWidgetToggle');
    const permissionWidget = document.getElementById('permissionWidget');
    if (permissionWidgetToggle && permissionWidget) {
        permissionWidgetToggle.addEventListener('click', () => {
            permissionWidget.classList.toggle('collapsed');
        });
    }

    // Drill-down and Edit Dispute handler
    document.addEventListener('click', (e) => {
        const editDispBtn = e.target.closest('.btn-edit-dispute');
        if (editDispBtn) {
            e.preventDefault();
            const id = editDispBtn.dataset.id;
            openDisputeForm(id);
            return;
        }

        const detailLink = e.target.closest('.detail-trx-trigger');
        if (detailLink) {
            e.preventDefault();
            const id = detailLink.dataset.id;
            openDetailModal(id);
            return;
        }
    });

    document.getElementById('modalClose').addEventListener('click', () => {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    });

    // General escape key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalOverlay.classList.remove('show');
            disputeOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Sidebar Mobile Toggle Actions
    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');

    mobileToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('show');
    });

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    });

    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    });

    // Submenu toggles (sidebar)
    document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const group = item.closest('.nav-group');
            if (group) {
                const submenu = group.querySelector('.submenu');
                const arrow = item.querySelector('.submenu-arrow');
                const isOpen = group.classList.contains('open');
                if (isOpen) {
                    group.classList.remove('open');
                    submenu.classList.remove('open');
                    arrow.classList.remove('fa-chevron-up');
                    arrow.classList.add('fa-chevron-down');
                } else {
                    group.classList.add('open');
                    submenu.classList.add('open');
                    arrow.classList.remove('fa-chevron-down');
                    arrow.classList.add('fa-chevron-up');
                }
            }
        });
    });
}

// ── Toast Helper ──
function showToast(title, msg) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <i class="fas fa-info-circle toast-icon"></i>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-msg">${msg}</div>
        </div>
        <button class="toast-close" aria-label="Close"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    setTimeout(() => removeToast(toast), 3500);
}

function removeToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
}

// ── Mock Data Control Actions ──
function initMockDataControl() {
    const btnPopulateMock = document.getElementById('btnPopulateMock');
    const btnClearData = document.getElementById('btnClearData');
    const simulatorWidgetToggle = document.getElementById('simulatorWidgetToggle');
    const simulatorWidget = document.getElementById('simulatorWidget');

    if (simulatorWidgetToggle && simulatorWidget) {
        simulatorWidgetToggle.addEventListener('click', () => {
            simulatorWidget.classList.toggle('collapsed');
            const arrow = simulatorWidgetToggle.querySelector('.widget-arrow');
            if (arrow) {
                if (simulatorWidget.classList.contains('collapsed')) {
                    arrow.classList.remove('fa-chevron-up');
                    arrow.classList.add('fa-chevron-down');
                } else {
                    arrow.classList.remove('fa-chevron-down');
                    arrow.classList.add('fa-chevron-up');
                }
            }
        });
    }

    if (btnPopulateMock) {
        btnPopulateMock.addEventListener('click', () => {
            localStorage.setItem('paydia_mock_populated', 'true');
            localStorage.setItem('paydia_recon_trx', JSON.stringify(rawTransactions));
            localStorage.setItem('paydia_disputes', JSON.stringify([
                { id: 'DISP-001', refId: 'REF-20260527-021', date: '2026-05-28 09:15:00', type: '1st chargeback', switching: 'Rintis', nominal: 220000, status: 'Open', desc: 'Double payment terdeteksi, saldo merchant terpotong dua kali' },
                { id: 'DISP-002', refId: 'TX-ISS-20001', date: '2026-05-28 09:44:00', type: 'good faith', switching: 'Rintis', nominal: 89000, status: 'Open', desc: 'Dana menggantung di switching, merchant belum terima dana' }
            ]));
            localStorage.setItem('paydia_logs', JSON.stringify(seedLogs));
            localStorage.removeItem('paydia_status_overrides');
            localStorage.setItem('paydia_approvals', JSON.stringify([]));

            showToast('Populasi Mock Data', 'Mockup data berhasil di-populate. Menyegarkan halaman...');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }

    if (btnClearData) {
        btnClearData.addEventListener('click', () => {
            localStorage.setItem('paydia_mock_populated', 'false');
            localStorage.removeItem('paydia_recon_trx');
            localStorage.removeItem('paydia_disputes');
            localStorage.removeItem('paydia_logs');
            localStorage.removeItem('paydia_approvals');
            localStorage.removeItem('paydia_status_overrides');
            
            showToast('Hapus Data', 'Semua data telah dikosongkan. Menyegarkan halaman...');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        });
    }
}
