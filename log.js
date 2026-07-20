/* ============================================
   Paydia Bisnis – Unified Activity Log Page Logic
   ============================================ */

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
let logs = [];
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
    // 1. Log view permission overlay
    const mainContent = document.querySelector('.main-content');
    const existingOverlay = document.getElementById('permissionErrorOverlay');
    
    if (!permissions.log) {
        if (!existingOverlay && mainContent) {
            const overlay = document.createElement('div');
            overlay.id = 'permissionErrorOverlay';
            overlay.className = 'permission-error-overlay';
            overlay.innerHTML = `
                <div class="permission-error-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h2 class="permission-error-title">Akses Log Trail Dibatasi</h2>
                <p class="permission-error-desc">
                    Akun Anda tidak memiliki izin <strong>View Log Activity</strong>. Hubungi administrator sistem untuk meminta akses audit trail.
                </p>
            `;
            // Hide main contents
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
                    if (child.className !== 'filter-panel') {
                        child.style.display = '';
                    }
                });
            }
        }
    }

    // 2. Export check
    if (exportBtn) {
        exportBtn.style.display = permissions.export ? '' : 'none';
    }
}

// ── Initialize Log Page ──
document.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    loadPermissions();
    applyPermissions();
    bindEvents();
    renderTableData();
    initMockDataControl();
});

function initDatabase() {
    const isPopulated = localStorage.getItem('paydia_mock_populated') === 'true';
    if (isPopulated) {
        const savedLogs = localStorage.getItem('paydia_logs');
        if (savedLogs) {
            logs = JSON.parse(savedLogs);
        } else {
            logs = [...seedLogs];
            localStorage.setItem('paydia_logs', JSON.stringify(logs));
        }
    } else {
        logs = [];
    }
}

// ── Main Rendering ──
function renderTableData() {
    const dateVal = document.getElementById('filterDate').value;
    const containerVal = document.getElementById('filterContainer').value;
    const typeVal = document.getElementById('filterType').value;
    const searchVal = searchInput.value.trim().toLowerCase();

    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = '';

    // Date formatting helper for filter input comparison (YYYY-MM-DD -> DD-MM-YYYY)
    let filterDateStr = '';
    if (dateVal) {
        const parts = dateVal.split('-'); // [YYYY, MM, DD]
        filterDateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }

    let filtered = logs.filter(l => {
        if (filterDateStr && !l.tanggal.startsWith(filterDateStr)) return false;
        if (containerVal && l.container !== containerVal) return false;
        if (typeVal && l.type !== typeVal) return false;
        if (searchVal && 
            !l.id.toString().includes(searchVal) && 
            !l.type.toLowerCase().includes(searchVal) && 
            !l.detail.toLowerCase().includes(searchVal) && 
            !l.ip.toLowerCase().includes(searchVal)) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">Tidak ada data log yang sesuai</td></tr>`;
        updatePaginationInfo(0);
        return;
    }

    // Render entries
    filtered.forEach((l) => {
        const tr = document.createElement('tr');
        
        // Detail lines wrapper
        const detailLines = l.detail.split('\n');
        let detailHtml = '';
        detailLines.forEach(line => {
            detailHtml += `<div class="log-detail-line">${line}</div>`;
        });

        tr.innerHTML = `
            <td>${l.id}</td>
            <td style="font-variant-numeric: tabular-nums;">${l.tanggal}</td>
            <td><strong>${l.container}</strong></td>
            <td><span class="request-badge" style="background:#f1f5f9;color:#475569;border:1px solid #e2e8f0; font-size:0.75rem;">${l.type}</span></td>
            <td class="detail-cell">${detailHtml}</td>
            <td style="font-variant-numeric: tabular-nums;">${l.ip}</td>
        `;
        tbody.appendChild(tr);
    });

    updatePaginationInfo(filtered.length);
}

function updatePaginationInfo(count) {
    document.getElementById('paginationInfo').textContent = `1 - ${count} of ${count}`;
}

// ── Bind Interactive Events ──
function bindEvents() {
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        filterBtn.classList.toggle('active');
    });

    resetBtn.addEventListener('click', () => {
        document.getElementById('filterDate').value = '';
        document.getElementById('filterContainer').selectedIndex = 0;
        document.getElementById('filterType').selectedIndex = 0;
        searchInput.value = '';
        showToast('Filter Direset', 'Semua filter pencarian log direset.');
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

    // Export log activity
    exportBtn.addEventListener('click', () => {
        const dateVal = document.getElementById('filterDate').value || '2026-05-28';
        showToast('Export Selesai', `Audit log file paydia_audit_trail_${dateVal}.csv berhasil diunduh.`);
    });

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
            
            const rawTransactionsSeed = [
                { id: 'TX-ACQ-10001', refNo: 'REF-20260527-010', date: '2026-05-27 08:12:44', nominal: 150000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '00', switching: 'Rintis', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-10002', refNo: 'REF-20260527-011', date: '2026-05-27 08:35:19', nominal: 45000, merchantId: 'MID-88134', merchantName: 'Indomaret', rc: '00', switching: 'Jalin', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-10003', refNo: 'REF-20260527-012', date: '2026-05-27 09:04:11', nominal: 1250000, merchantId: 'MID-88220', merchantName: 'Sushi Tei', rc: '00', switching: 'Artajasa', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-10004', refNo: 'REF-20260527-013', date: '2026-05-27 10:14:02', nominal: 87000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '00', switching: 'Alto', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-10005', refNo: 'REF-20260527-014', date: '2026-05-27 11:22:58', nominal: 32000, merchantId: 'MID-88155', merchantName: 'Alfa Mart', rc: '00', switching: 'Rintis', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-10006', refNo: 'REF-20260527-015', date: '2026-05-27 14:02:11', nominal: 105000, merchantId: 'MID-88301', merchantName: 'Starbucks', rc: '00', switching: 'Jalin', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Crossborder', disputeRef: null },
                { id: 'TX-ACQ-20001', refNo: 'REF-20260527-020', date: '2026-05-27 07:11:02', nominal: 75000, merchantId: 'MID-88134', merchantName: 'Indomaret', rc: '00', switching: 'Jalin', statusRekon: 'Unmatched', label: 'Switching-Only', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-20002', refNo: 'REF-20260527-021', date: '2026-05-27 09:44:32', nominal: 220000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '00', switching: 'Rintis', statusRekon: 'Unmatched', label: 'Paydia-Only', flaggingStatus: 'On-Hold', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: 'DISP-001' },
                { id: 'TX-ACQ-20003', refNo: 'REF-20260527-022', date: '2026-05-27 10:05:14', nominal: 500000, merchantId: 'MID-88220', merchantName: 'Sushi Tei', rc: '68', switching: 'Artajasa', statusRekon: 'Unmatched', label: 'Paydia-Only', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-20004', refNo: 'REF-20260527-023', date: '2026-05-27 15:30:19', nominal: 180000, merchantId: 'MID-88301', merchantName: 'Starbucks', rc: '00', switching: 'Alto', statusRekon: 'Unmatched', label: 'Switching-Only', flaggingStatus: 'Settled', tipe: 'Acquirer', skema: 'MPM', domestic: 'Crossborder', disputeRef: null },
                { id: 'TX-ACQ-30001', refNo: 'REF-20260527-030', date: '2026-05-27 08:02:11', nominal: 11000, merchantId: 'MID-88134', merchantName: 'Indomaret', rc: '51', switching: 'Jalin', statusRekon: 'Declined', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ACQ-30002', refNo: 'REF-20260527-031', date: '2026-05-27 11:45:00', nominal: 95000, merchantId: 'MID-88129', merchantName: 'Kopi Kenangan', rc: '05', switching: 'Rintis', statusRekon: 'Declined', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Acquirer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ISS-10001', refNo: 'REF-20260527-040', date: '2026-05-27 08:05:22', nominal: 24000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '00', switching: 'Jalin', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ISS-10002', refNo: 'REF-20260527-041', date: '2026-05-27 09:12:18', nominal: 155000, merchantId: 'MID-99120', merchantName: 'Solaria Mall', rc: '00', switching: 'Rintis', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ISS-10003', refNo: 'REF-20260527-042', date: '2026-05-27 10:20:11', nominal: 60000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '00', switching: 'Alto', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ISS-10004', refNo: 'REF-20260527-043', date: '2026-05-27 13:14:02', nominal: 320000, merchantId: 'MID-99440', merchantName: 'Shell Gandaria', rc: '00', switching: 'Artajasa', statusRekon: 'Matched', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'CPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ISS-20001', refNo: 'REF-20260527-050', date: '2026-05-27 08:22:19', nominal: 89000, merchantId: 'MID-99120', merchantName: 'Solaria Mall', rc: '00', switching: 'Rintis', statusRekon: 'Unmatched', label: 'Switching-Only', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ISS-20002', refNo: 'REF-20260527-051', date: '2026-05-27 11:05:44', nominal: 45000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '68', switching: 'Jalin', statusRekon: 'Unmatched', label: 'Paydia-Only', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null },
                { id: 'TX-ISS-30001', refNo: 'REF-20260527-060', date: '2026-05-27 07:44:06', nominal: 18000, merchantId: 'MID-99002', merchantName: 'HokBen PIM', rc: '14', switching: 'Jalin', statusRekon: 'Declined', label: 'Match', flaggingStatus: 'Unflagged', tipe: 'Issuer', skema: 'MPM', domestic: 'Domestic', disputeRef: null }
            ];

            const seedLogsSeed = [
                { id: 9145, tanggal: '28-05-2026 15:01:39', container: 'paydia-account', type: 'merchant-login', detail: 'email : incarnata.maria@pt-mfa.com\nuser.type : merchant', ip: '36.75.6.222' },
                { id: 9144, tanggal: '28-05-2026 15:00:31', container: 'paydia-account', type: 'merchant-login', detail: 'email : incarnata.maria@pt-mfa.com\nuser.type : merchant', ip: '36.75.6.222' },
                { id: 9143, tanggal: '28-05-2026 14:57:42', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : kenny@paydia.id\nuser.type : admin', ip: '125.161.77.69' },
                { id: 9142, tanggal: '28-05-2026 14:42:06', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : dion@paydia.id\nuser.type : admin', ip: '125.161.77.69' },
                { id: 9141, tanggal: '28-05-2026 14:28:23', container: 'paydia-account', type: 'merchant-login', detail: 'email : incarnata.maria@pt-mfa.com\nuser.type : merchant', ip: '38.75.8.222' },
                { id: 9140, tanggal: '28-05-2026 11:31:14', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : kenny@paydia.id\nuser.type : admin', ip: '125.161.77.69' },
                { id: 9139, tanggal: '28-05-2026 15:54:41', container: 'paydia-account-admin', type: 'admin-login', detail: 'email : aldy@merchant.id\nuser.type : admin', ip: '103.177.100.34' }
            ];

            localStorage.setItem('paydia_recon_trx', JSON.stringify(rawTransactionsSeed));
            localStorage.setItem('paydia_disputes', JSON.stringify([
                { id: 'DISP-001', refId: 'REF-20260527-021', date: '2026-05-28 09:15:00', type: '1st chargeback', switching: 'Rintis', nominal: 220000, status: 'Open', desc: 'Double payment terdeteksi, saldo merchant terpotong dua kali' },
                { id: 'DISP-002', refId: 'TX-ISS-20001', date: '2026-05-28 09:44:00', type: 'good faith', switching: 'Rintis', nominal: 89000, status: 'Open', desc: 'Dana menggantung di switching, merchant belum terima dana' }
            ]));
            localStorage.setItem('paydia_logs', JSON.stringify(seedLogsSeed));
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
