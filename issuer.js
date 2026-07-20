/* ============================================
   Paydia Bisnis – QRIS Auto Reconcile Dashboard
   QRIS Issuer Page Logic
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
let activeSubtab = 'iss-match';
let transactions = [];
let disputes = [];
let currentPage = 1;
const perPage = 10;

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
const btnRerun = document.getElementById('btnRerun');
const btnApproveSettlement = document.getElementById('btnApproveSettlement');
const progressOverlay = document.getElementById('progressOverlay');
const progressBarFill = document.getElementById('progressBarFill');
const progressStatus = document.getElementById('progressStatus');
const settlementOverlay = document.getElementById('settlementOverlay');
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

// Telegram Alert and Rerun config refs
const rerunConfigOverlay = document.getElementById('rerunConfigOverlay');
const chkSimulateSlow = document.getElementById('chkSimulateSlow');
const telegramAlertCard = document.getElementById('telegramAlertCard');
const telegramAlertClose = document.getElementById('telegramAlertClose');
const telegramAlertBypass = document.getElementById('telegramAlertBypass');
const telegramAlertTime = document.getElementById('telegramAlertTime');

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
            // Keep header but hide children except overlay
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
                    if (child.className !== 'filter-panel' && child.id !== 'progressOverlay' && child.id !== 'settlementOverlay' && child.id !== 'modalOverlay' && child.id !== 'rerunConfigOverlay') {
                        child.style.display = '';
                    }
                });
            }
        }
    }

    // 2. Flagging check is applied dynamically in renderTableData logic

    // 3. Export
    if (exportBtn) {
        exportBtn.style.display = permissions.export ? '' : 'none';
    }
    
    // 4. Approve
    if (btnApproveSettlement) {
        btnApproveSettlement.style.display = permissions.approve ? '' : 'none';
    }
    
    // 5. Rerun
    if (btnRerun) {
        btnRerun.style.display = permissions.rerun ? '' : 'none';
    }
}

// ── Initialize Dashboard ──
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    loadPermissions();
    applyPermissions();
    bindEvents();
    renderSummary();
    renderActiveTableWithLoading();
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
    // Apply local filters dynamically on data subset to display aggregate values
    const dateVal = document.getElementById('filterDate').value;
    const switchingVal = document.getElementById('filterSwitching').value;

    let filtered = transactions.filter(t => {
        if (t.tipe !== 'Issuer') return false;
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
        // Check if related transaction is Issuer
        const t = transactions.find(trx => trx.id === d.refId || trx.refNo === d.refId);
        if (!t || t.tipe !== 'Issuer') return false;
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

// ── Main Routing & Loading Rendering ──
function renderActiveTableWithLoading() {
    let tbody;
    let colCount = 12;

    if (activeSubtab === 'iss-match') { tbody = document.getElementById('issMatchTableBody'); colCount = 12; }
    else if (activeSubtab === 'iss-unmatch') { tbody = document.getElementById('issUnmatchTableBody'); colCount = 11; }

    if (!tbody) return;

    // Show skeleton
    tbody.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const tr = document.createElement('tr');
        let tds = '';
        for (let j = 0; j < colCount; j++) {
            let width = '75%';
            if (j === 0) width = '30px';
            tds += `<td><div class="skeleton" style="height: 18px; width: ${width}; margin: 2px 0;"></div></td>`;
        }
        tr.innerHTML = tds;
        tbody.appendChild(tr);
    }

    setTimeout(() => {
        renderTableData();
    }, 300);
}

function renderTableData() {
    renderSummary();

    // Filters
    const dateVal = document.getElementById('filterDate').value;
    const switchingVal = document.getElementById('filterSwitching').value;
    const rcVal = document.getElementById('filterRC').value;
    const flaggingVal = document.getElementById('filterFlagging').value;
    const disputeVal = document.getElementById('filterDispute').value;
    const searchVal = searchInput.value.trim().toLowerCase();

    // Reconcile Tables (Issuer)
    let tbody;
    let category = 'Issuer';
    let sub = activeSubtab;

    // Filter transaction list
    let filtered = transactions.filter(t => {
        if (t.tipe !== category) return false;
        
        // Sub-tabs filters
        if (sub === 'iss-match' && t.statusRekon !== 'Matched') return false;
        if (sub === 'iss-unmatch' && t.statusRekon !== 'Unmatched') return false;

        // Global toolbar filters
        if (dateVal && !t.date.startsWith(dateVal)) return false;
        if (switchingVal && t.switching !== switchingVal) return false;
        if (flaggingVal && flaggingVal !== 'Semua' && t.flaggingStatus !== flaggingVal) return false;
        if (disputeVal) {
            const isDisputed = t.disputeRef !== null;
            if (disputeVal === 'disputed' && !isDisputed) return false;
            if (disputeVal === 'normal' && isDisputed) return false;
        }
        if (rcVal) {
            if (rcVal === '00' && t.rc !== '00') return false;
            if (rcVal === '68' && t.rc !== '68') return false;
            if (rcVal === 'Decline' && (t.rc === '00' || t.rc === '68')) return false;
        }

        // Search text
        if (searchVal && !t.id.toLowerCase().includes(searchVal) && !t.refNo.toLowerCase().includes(searchVal) && !t.merchantName.toLowerCase().includes(searchVal)) return false;

        return true;
    });

    if (sub === 'iss-match') {
        tbody = document.getElementById('issMatchTableBody');
        renderMatchRows(filtered, tbody);
    } else if (sub === 'iss-unmatch') {
        tbody = document.getElementById('issUnmatchTableBody');
        renderUnmatchRows(filtered, tbody);
    }
}

function renderMatchRows(list, tbody) {
    tbody.innerHTML = '';
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align:center; padding: 40px 16px;">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px 0;">
                        <span style="color: var(--text-muted); font-size: 0.9rem;">Tidak ada transaksi match (Data Kosong)</span>
                        <button class="btn-populate-empty-state" style="background: var(--success); color: white; padding: 8px 16px; font-size: 0.8rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);">
                            <i class="fas fa-seedling"></i> Populate Mock Data
                        </button>
                    </div>
                </td>
            </tr>
        `;
        const btn = tbody.querySelector('.btn-populate-empty-state');
        if (btn) {
            btn.addEventListener('click', () => {
                const btnPop = document.getElementById('btnPopulateMock');
                if (btnPop) btnPop.click();
            });
        }
        updatePaginationInfo(0);
        return;
    }

    list.forEach((t, idx) => {
        const tr = document.createElement('tr');
        
        let flagClass = '';
        if (t.flaggingStatus === 'On-Hold') flagClass = 'status-proses';
        else flagClass = 'status-sukses'; // default is green "Settled"

        let displayStatus = t.flaggingStatus;
        if (displayStatus === 'Unflagged') displayStatus = 'Settled';

        let btnText = t.flaggingStatus === 'On-Hold' ? 'Settle' : 'On-Hold';
        let btnClass = t.flaggingStatus === 'On-Hold' ? 'settle' : 'onhold';

        tr.innerHTML = `
            <td class="col-no">${idx + 1}</td>
            <td><a href="#" class="ref-link detail-trx-trigger" data-id="${t.id}">${t.id}</a></td>
            <td>${t.refNo}</td>
            <td style="font-variant-numeric: tabular-nums;">${t.date}</td>
            <td><strong>Rp${t.nominal.toLocaleString('id-ID')}</strong></td>
            <td>${t.merchantId || '-'}</td>
            <td>${t.merchantName}</td>
            <td><span class="status-badge status-sukses">${t.rc}</span></td>
            <td>${t.switching}</td>
            <td><span class="badge-unmatch paydia">${t.label || 'Match'}</span></td>
            <td><span class="status-badge ${flagClass}">${displayStatus}</span></td>
            <td class="col-action">
                <button class="flag-btn ${btnClass} ${permissions.flagging ? 'btn-toggle-flag' : ''}" data-id="${t.id}" data-action="${btnText}" ${permissions.flagging ? '' : 'disabled style="opacity: 0.5; cursor: not-allowed;" title="Izin Flagging diperlukan"'}>
                    ${btnText}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updatePaginationInfo(list.length);
}

function renderUnmatchRows(list, tbody) {
    tbody.innerHTML = '';
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="11" style="text-align:center; padding: 40px 16px;">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 20px 0;">
                        <span style="color: var(--text-muted); font-size: 0.9rem;">Tidak ada transaksi unmatch (Data Kosong)</span>
                        <button class="btn-populate-empty-state" style="background: var(--success); color: white; padding: 8px 16px; font-size: 0.8rem; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-family: 'Inter', sans-serif; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);">
                            <i class="fas fa-seedling"></i> Populate Mock Data
                        </button>
                    </div>
                </td>
            </tr>
        `;
        const btn = tbody.querySelector('.btn-populate-empty-state');
        if (btn) {
            btn.addEventListener('click', () => {
                const btnPop = document.getElementById('btnPopulateMock');
                if (btnPop) btnPop.click();
            });
        }
        updatePaginationInfo(0);
        return;
    }

    list.forEach((t, idx) => {
        const tr = document.createElement('tr');
        
        let labelClass = t.label === 'Paydia-Only' ? 'paydia' : 'switching';
        
        let flagClass = '';
        if (t.flaggingStatus === 'On-Hold') flagClass = 'status-proses';
        else if (t.flaggingStatus === 'Settled') flagClass = 'status-sukses';
        else flagClass = 'status-gagal'; // unflagged

        let btnText = t.flaggingStatus === 'On-Hold' ? 'Settle' : 'On-Hold';
        let btnClass = t.flaggingStatus === 'On-Hold' ? 'settle' : 'onhold';

        tr.innerHTML = `
            <td class="col-no">${idx + 1}</td>
            <td><a href="#" class="ref-link detail-trx-trigger" data-id="${t.id}">${t.id}</a></td>
            <td>${t.refNo}</td>
            <td style="font-variant-numeric: tabular-nums;">${t.date}</td>
            <td><strong>Rp${t.nominal.toLocaleString('id-ID')}</strong></td>
            <td>${t.merchantName}</td>
            <td><span class="status-badge status-${t.rc === '00' ? 'sukses' : 'proses'}">${t.rc}</span></td>
            <td>${t.switching}</td>
            <td><span class="badge-unmatch ${labelClass}">${t.label}</span></td>
            <td><span class="status-badge ${flagClass}">${t.flaggingStatus}</span></td>
            <td class="col-action">
                <button class="flag-btn ${btnClass} ${permissions.flagging ? 'btn-toggle-flag' : ''}" data-id="${t.id}" data-action="${btnText}" ${permissions.flagging ? '' : 'disabled style="opacity: 0.5; cursor: not-allowed;" title="Izin Flagging diperlukan"'}>
                    ${btnText}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updatePaginationInfo(list.length);
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

// ── Re-run Matching Control ──
function openRerunConfigModal() {
    if (!permissions.rerun) {
        showToast('Access Denied', 'Anda tidak memiliki izin untuk melakukan Re-run Reconcile.');
        return;
    }
    if (rerunConfigOverlay) {
        if (chkSimulateSlow) chkSimulateSlow.checked = false;
        rerunConfigOverlay.classList.add('show');
    }
}

let rerunInterval = null;

function startRerunMatching() {
    const simulateSlow = chkSimulateSlow ? chkSimulateSlow.checked : false;
    
    if (rerunConfigOverlay) rerunConfigOverlay.classList.remove('show');
    progressOverlay.classList.add('show');
    progressBarFill.style.width = '0%';
    progressStatus.textContent = 'Menghubungkan ke server Switchings...';
    
    let percent = 0;
    if (rerunInterval) clearInterval(rerunInterval);
    
    rerunInterval = setInterval(() => {
        percent += 5;
        progressBarFill.style.width = percent + '%';
        progressStatus.textContent = `Memproses data matching (${percent}%)`;

        if (percent === 15) {
            progressStatus.textContent = 'Mendownload file unmatch Jalin...';
        } else if (percent === 35) {
            progressStatus.textContent = 'Mendownload file unmatch Rintis...';
        } else if (percent === 50 && simulateSlow) {
            clearInterval(rerunInterval);
            progressStatus.innerHTML = `<span style="color:var(--danger);font-weight:700;"><i class="fas fa-exclamation-triangle"></i> WARNING: Engine berjalan lambat (> 3 menit). Mengirim alert Telegram...</span>`;
            
            writeLog('Telegram Alert', 'email : dion@paydia.id\naction : SLA warning matching engine berjalan lambat (> 3 menit). Alert dikirim via telegram bot.');
            
            setTimeout(() => {
                percent = 50;
                rerunInterval = setInterval(() => {
                    percent += 5;
                    progressBarFill.style.width = percent + '%';
                    if (percent === 55) {
                        progressStatus.textContent = 'Engine berjalan kembali...';
                    } else if (percent === 70) {
                        progressStatus.textContent = 'Menjalankan engine pencocokan QRIS...';
                    } else if (percent === 90) {
                        progressStatus.textContent = 'Menulis log rekonsiliasi database...';
                    } else {
                        progressStatus.textContent = `Memproses data matching (${percent}%)`;
                    }
                    if (percent >= 100) {
                        clearInterval(rerunInterval);
                        finishRerunMatching(false);
                    }
                }, 150);
            }, 2000);
            return;
        } else if (percent === 70) {
            progressStatus.textContent = 'Menjalankan engine pencocokan QRIS...';
        } else if (percent === 90) {
            progressStatus.textContent = 'Menulis log rekonsiliasi database...';
        }

        if (percent >= 100) {
            clearInterval(rerunInterval);
            finishRerunMatching(false);
        }
    }, 150);
}

function finishRerunMatching(wasBypassed = false) {
    setTimeout(() => {
        progressOverlay.classList.remove('show');
        
        const logMsg = wasBypassed 
            ? 'email : dion@paydia.id\naction : Re-run matching QRIS (dengan Manual Bypass lambat)'
            : 'email : dion@paydia.id\naction : Re-run matching QRIS Issuer';
        
        writeLog('Re-run Reconcile', logMsg);
        showToast('Re-run Berhasil', 'Matching engine selesai diproses ulang. Sesi hari ini terupdate!');
        renderActiveTableWithLoading();
    }, 300);
}

// ── Approve Settlement Trigger ──
function triggerApproveSettlement() {
    const dateVal = document.getElementById('filterDate').value;
    const switchingVal = document.getElementById('filterSwitching').value;

    let filtered = transactions.filter(t => {
        if (t.tipe !== 'Issuer') return false;
        if (dateVal && !t.date.startsWith(dateVal)) return false;
        if (switchingVal && t.switching !== switchingVal) return false;
        return true;
    });

    const matched = filtered.filter(t => t.statusRekon === 'Matched' && t.flaggingStatus !== 'On-Hold').length;
    const unmatchRel = filtered.filter(t => t.statusRekon === 'Unmatched' && t.flaggingStatus === 'Settled').length;
    const settleTrx = filtered.filter(t => {
        if (t.statusRekon === 'Matched' && t.flaggingStatus !== 'On-Hold') return true;
        if (t.statusRekon === 'Unmatched' && t.flaggingStatus === 'Settled') return true;
        return false;
    });
    const nominalSettle = settleTrx.reduce((sum, t) => sum + t.nominal, 0);

    document.getElementById('settleConfirmMatch').textContent = matched + ' Transaksi';
    document.getElementById('settleConfirmUnmatchRel').textContent = unmatchRel + ' Transaksi';
    document.getElementById('settleConfirmNominal').textContent = 'Rp' + nominalSettle.toLocaleString('id-ID');

    settlementOverlay.classList.add('show');
}

function submitSettlementRequest() {
    const approvals = JSON.parse(localStorage.getItem('paydia_approvals') || '[]');
    
    const dateVal = document.getElementById('filterDate').value || 'Hari Ini';
    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB');

    const appEntry = {
        id: 'APR-RECON-' + Date.now(),
        tanggal: timeStr,
        account: `Sesi Rekonsiliasi QRIS Issuer: ${dateVal}`,
        admin: 'Dion',
        tipeRequest: 'Approval Settlement',
        status: 'Pending',
        refId: 'RECON-ISS-' + now.getFullYear() + String(now.getMonth()+1).padStart(2,'0') + String(now.getDate()).padStart(2,'0'),
        alasan: 'Summary settlement siap diproses',
        nominal: 245890000,
        statusRekon: 'Pending'
    };

    approvals.unshift(appEntry);
    localStorage.setItem('paydia_approvals', JSON.stringify(approvals));

    writeLog('Approve Settlement', `email : dion@paydia.id\naction : Mengajukan approval settlement Issuer sesi ${dateVal}`);
    settlementOverlay.classList.remove('show');
    showToast('Request Terkirim', 'Request approval settlement dikirim ke Management.');
}

// ── Bind Interactive Events ──
function bindEvents() {
    // Sub-tab switching
    document.querySelectorAll('.sub-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const pane = btn.closest('.tab-pane');
            pane.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
            pane.querySelectorAll('.sub-tab-pane').forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetSub = btn.dataset.subtab;
            document.getElementById(targetSub).classList.add('active');
            activeSubtab = targetSub;

            renderActiveTableWithLoading();
        });
    });

    // Filters and toolbar events
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        filterBtn.classList.toggle('active');
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('filterDate').value = '';
        document.getElementById('filterSwitching').selectedIndex = 0;
        document.getElementById('filterRC').selectedIndex = 0;
        document.getElementById('filterFlagging').selectedIndex = 0;
        document.getElementById('filterDispute').selectedIndex = 0;
        searchInput.value = '';
        showToast('Filter Direset', 'Semua filter pencarian direset.');
        renderActiveTableWithLoading();
    });

    searchBtn.addEventListener('click', () => {
        renderActiveTableWithLoading();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') renderActiveTableWithLoading();
    });

    // Handle instant filter updates on select changes
    document.querySelectorAll('.filter-group select, #filterDate').forEach(el => {
        el.addEventListener('change', () => {
            renderActiveTableWithLoading();
        });
    });

    // Export CSV
    exportBtn.addEventListener('click', () => {
        const dateVal = document.getElementById('filterDate').value || '2026-05-28';
        const switchingVal = document.getElementById('filterSwitching').value || 'Semua';
        
        writeLog('Export CSV', `email : dion@paydia.id\naction : Mengeksport data rekonsiliasi Issuer sesi ${dateVal} (Switching: ${switchingVal})`);
        showToast('Export Selesai', `File export QRIS_Issuer_Reconciliation_${dateVal}.csv berhasil diunduh.`);
    });

    // Re-run matching
    if (btnRerun) {
        btnRerun.addEventListener('click', () => {
            openRerunConfigModal();
        });
    }

    const rerunConfigClose = document.getElementById('rerunConfigClose');
    if (rerunConfigClose) {
        rerunConfigClose.addEventListener('click', () => {
            rerunConfigOverlay.classList.remove('show');
        });
    }

    const btnCancelRerun = document.getElementById('btnCancelRerun');
    if (btnCancelRerun) {
        btnCancelRerun.addEventListener('click', () => {
            rerunConfigOverlay.classList.remove('show');
        });
    }

    const btnConfirmRerun = document.getElementById('btnConfirmRerun');
    if (btnConfirmRerun) {
        btnConfirmRerun.addEventListener('click', () => {
            startRerunMatching();
        });
    }

    // Telegram Alert Card controls
    if (telegramAlertClose) {
        telegramAlertClose.addEventListener('click', () => {
            telegramAlertCard.classList.remove('show');
        });
    }

    if (telegramAlertBypass) {
        telegramAlertBypass.addEventListener('click', () => {
            telegramAlertCard.classList.remove('show');
            progressStatus.textContent = 'Menyelesaikan matching engine (Bypass)...';
            progressBarFill.style.width = '100%';
            finishRerunMatching(true);
        });
    }

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

    // Settlement confirmation
    btnApproveSettlement.addEventListener('click', () => {
        triggerApproveSettlement();
    });

    document.getElementById('btnSubmitSettlement').addEventListener('click', () => {
        submitSettlementRequest();
    });

    document.getElementById('btnCancelSettlement').addEventListener('click', () => {
        settlementOverlay.classList.remove('show');
    });
    document.getElementById('settlementClose').addEventListener('click', () => {
        settlementOverlay.classList.remove('show');
    });

    // Flagging control click inside table body using event delegation
    document.addEventListener('click', (e) => {
        // Toggle flagging button
        const flagBtn = e.target.closest('.btn-toggle-flag');
        if (flagBtn) {
            e.preventDefault();
            const id = flagBtn.dataset.id;
            const act = flagBtn.dataset.action; // "On-Hold" or "Settle"

            const t = transactions.find(item => item.id === id);
            if (t) {
                t.flaggingStatus = act === 'On-Hold' ? 'On-Hold' : 'Settled';
                saveTrxToStorage();
                
                writeLog('Flagging Control', `email : dion@paydia.id\naction : Mengubah status flagging ${id} menjadi ${t.flaggingStatus}`);
                showToast('Status Diupdate', `Transaksi ${id} status berubah ke ${t.flaggingStatus}.`);
                renderActiveTableWithLoading();
            }
            return;
        }

        // Drill-down link detail trigger
        const detailLink = e.target.closest('.detail-trx-trigger');
        if (detailLink) {
            e.preventDefault();
            const id = detailLink.dataset.id;
            openDetailModal(id);
            return;
        }
    });

    // Close details modal
    document.getElementById('modalClose').addEventListener('click', () => {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    });

    // General escape key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalOverlay.classList.remove('show');
            settlementOverlay.classList.remove('show');
            if (rerunConfigOverlay) rerunConfigOverlay.classList.remove('show');
            if (telegramAlertCard) telegramAlertCard.classList.remove('show');
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
