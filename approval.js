/* ============================================
   Paydia Bisnis – Approval Page
   Application Logic
   ============================================ */

// ── Seed Approval Data (matches mockup) ──
const seedApprovals = [
    {
        id: 'APR-RECON-001',
        tanggal: '28-05-2026 06:30:00',
        account: 'Sesi Rekonsiliasi QRIS: 27-05-2026',
        admin: 'Dion',
        tipeRequest: 'Approval Settlement',
        status: 'Pending',
        refId: 'RECON-20260527',
        alasan: 'Summary settlement QRIS Acquirer & Issuer siap dideploy ke Finance',
        nominal: 245890200000,
        matchedTrx: 1280450,
        unmatchedTrx: 3230
    },
    {
        id: 'APR-SEED-000',
        tanggal: '12-05-2026 22:03:29',
        account: 'jays@xailure.co',
        admin: 'Dion',
        tipeRequest: 'Ubah Status Transaksi Digital Content',
        status: 'Pending',
        refId: '280511000020',
        product: 'Top Up Flazz - Xailure',
        nominal: 200000,
        adminFee: 1500,
        currentStatus: 'Proses',
        alasan: 'Saldo tidak masuk tapi dana sudah terpotong dari rekening',
        buktiUrl: 'sample-bukti.png'
    },
    {
        id: 'APR-SEED-001',
        tanggal: '12-05-2026 08:45:24',
        account: 'christopher.johann@kopnus.com',
        admin: 'Dion',
        tipeRequest: 'Ubah Status Transaksi Pengguna Bisnis',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-002',
        tanggal: '11-05-2026 10:44:06',
        account: 'dion@paydia.id',
        admin: 'Dion',
        tipeRequest: 'Campaign Promo',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-003',
        tanggal: '05-05-2026 14:34:01',
        account: 'asep.saepullah@mailinator.com\nAsep Saepullah\n260031001000000',
        admin: 'Dion',
        tipeRequest: 'Merchant',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-004',
        tanggal: '27-04-2026 11:35:30',
        account: 'ihsan@citabersama.net',
        admin: 'King Kenny 1',
        tipeRequest: 'Ubah Public Key Merchant',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-005',
        tanggal: '28-04-2026 20:44:32',
        account: 'izar.anam23@gmail.com\nIl zul\n251113001000000',
        admin: 'Izar',
        tipeRequest: 'Ubah Data Merchant',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-006',
        tanggal: '23-04-2026 16:12:40',
        account: 'fijar@kirimo.co',
        admin: 'King Kenny 1',
        tipeRequest: 'Ubah Public Key Merchant',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-007',
        tanggal: '23-04-2026 15:54:25',
        account: 'business@linkit360.com',
        admin: 'King Kenny 1',
        tipeRequest: 'Ubah Public Key Merchant',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-008',
        tanggal: '11-03-2026 08:28:01',
        account: 'balong',
        admin: 'Izar',
        tipeRequest: 'Ubah Akses Akun',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-009',
        tanggal: '10-10-2025 15:28:12',
        account: 'SUKAMTO HERMAWAN',
        admin: 'Sukamto',
        tipeRequest: 'Ubah Status Top Up Pengguna',
        status: 'Pending'
    },
    {
        id: 'APR-SEED-010',
        tanggal: '01-10-2025 14:05:42',
        account: 'dormant@gmail.com',
        admin: 'Izar',
        tipeRequest: 'Ubah Detail Pengguna',
        status: 'Pending'
    }
];

// ── Color mapping for Tipe Request badges ──
const requestTypeColors = {
    'Ubah Status Transaksi Pengguna Bisnis': { bg: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
    'Campaign Promo':                        { bg: 'rgba(236, 72, 153, 0.12)', color: '#ec4899', border: 'rgba(236, 72, 153, 0.2)' },
    'Merchant':                              { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
    'Ubah Public Key Merchant':              { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' },
    'Ubah Data Merchant':                    { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.2)' },
    'Ubah Akses Akun':                       { bg: 'rgba(249, 115, 22, 0.12)', color: '#f97316', border: 'rgba(249, 115, 22, 0.2)' },
    'Ubah Status Top Up Pengguna':           { bg: 'rgba(168, 85, 247, 0.12)', color: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
    'Ubah Detail Pengguna':                  { bg: 'rgba(20, 184, 166, 0.12)', color: '#20b2aa', border: 'rgba(20, 184, 166, 0.2)' },
    'Ubah Status Transaksi Digital Content': { bg: 'rgba(100, 116, 139, 0.12)', color: '#94a3b8', border: 'rgba(100, 116, 139, 0.2)' },
    'Approval Settlement':                   { bg: 'rgba(79, 70, 229, 0.12)', color: '#4f46e5', border: 'rgba(79, 70, 229, 0.2)' }
};

// ── State ──
let currentPage = 1;
const perPage = 10;
let activeApprovalItem = null; // the approval item being reviewed

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
const tableBody = document.getElementById('approvalTableBody');
const paginationInfo = document.getElementById('paginationInfo');
const paginationContainer = document.getElementById('pagination');
const filterBtn = document.getElementById('filterBtn');
const filterPanel = document.getElementById('filterPanel');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mobileToggle = document.getElementById('mobileToggle');
const sidebarToggle = document.getElementById('sidebarToggle');

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
    // Re-render table to disable/enable approval button
    renderTable();
}

// ── Get all approvals (localStorage + seed) ──
function getAllApprovals() {
    const isPopulated = localStorage.getItem('paydia_mock_populated') === 'true';
    if (!isPopulated) {
        return [];
    }
    const stored = JSON.parse(localStorage.getItem('paydia_approvals') || '[]');
    return [...stored, ...seedApprovals];
}

// ── Skeleton Loader ──
function renderSkeleton(colsCount) {
    tableBody.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const tr = document.createElement('tr');
        let tds = '';
        for (let j = 0; j < colsCount; j++) {
            let width = '70%';
            if (j === 0) width = '30px';
            else if (j === 4) width = '120px';
            else if (j === 5) width = '80px';
            else width = `${Math.floor(Math.random() * 30) + 60}%`;
            tds += `<td><div class="skeleton" style="height: 18px; width: ${width}; margin: 2px auto;"></div></td>`;
        }
        tr.innerHTML = tds;
        tableBody.appendChild(tr);
    }
}

function renderTableWithLoading() {
    renderSkeleton(6);
    setTimeout(() => {
        renderTable();
    }, 350);
}

// ── Initialize ──
document.addEventListener('DOMContentLoaded', () => {
    createConfirmationModal();
    loadPermissions();
    applyPermissions();
    renderTableWithLoading();
    renderPagination();
    bindEvents();
    initMockDataControl();
});

// ── Create Confirmation Modal ──
function createConfirmationModal() {
    const html = `
    <div class="modal-overlay" id="confirmOverlay">
        <div class="modal" id="confirmModal" style="max-width:620px;">
            <div class="modal-header">
                <h2 class="modal-title" id="confirmModalTitle">Permintaan Ubah Status Transaksi Digital Content</h2>
                <button class="modal-close" id="confirmClose" aria-label="Tutup">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" id="confirmBody">
                <!-- Injected dynamically -->
            </div>
            <div class="modal-footer" id="confirmFooter">
                <button class="btn btn-cancel" id="confirmCancelBtn">Cancel</button>
                <button class="btn btn-reject" id="confirmRejectBtn">Reject</button>
                <button class="btn btn-approve" id="confirmApproveBtn">Approve</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}

// ── Format nominal ──
function formatNominal(amount) {
    return amount.toLocaleString('id-ID');
}

// ── Open Confirmation Modal ──
function openConfirmationModal(item) {
    activeApprovalItem = item;
    const overlay = document.getElementById('confirmOverlay');
    const body = document.getElementById('confirmBody');

    if (item.tipeRequest === 'Approval Settlement') {
        document.getElementById('confirmModalTitle').textContent = 'Permintaan Approval Settlement Sesi Rekonsiliasi';
        
        body.innerHTML = `
            <div class="modal-section">
                <h3 class="modal-section-title"><i class="fas fa-info-circle section-toggle-icon"></i> Summary Rekonsiliasi</h3>
                <table class="modal-detail-table">
                    <tr>
                        <td class="detail-label">Reconcile ID</td>
                        <td class="detail-value">${item.refId}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Target Sesi</td>
                        <td class="detail-value"><strong>${item.account}</strong></td>
                    </tr>
                    <tr>
                        <td class="detail-label">Total Match</td>
                        <td class="detail-value">${(item.matchedTrx || 1280450).toLocaleString('id-ID')} Transaksi</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Unmatch Settled</td>
                        <td class="detail-value">${(item.unmatchedTrx || 3230).toLocaleString('id-ID')} Transaksi</td>
                    </tr>
                    <tr>
                        <td class="detail-label detail-label-total">Total Settlement</td>
                        <td class="detail-value detail-value-total">Rp ${formatNominal(item.nominal)}</td>
                    </tr>
                </table>
            </div>

            <div class="modal-section">
                <h3 class="modal-section-title"><i class="fas fa-comment-alt section-toggle-icon"></i> Catatan Pengajuan</h3>
                <table class="modal-detail-table">
                    <tr>
                        <td class="detail-label">Diajukan Oleh</td>
                        <td class="detail-value">${item.admin}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Catatan Ops</td>
                        <td class="detail-value">${item.alasan || '-'}</td>
                    </tr>
                    <tr>
                        <td class="detail-label">Status Sesi</td>
                        <td class="detail-value"><span class="status-badge status-proses">Pending Approval</span></td>
                    </tr>
                </table>
            </div>
        `;
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        return;
    }

    document.getElementById('confirmModalTitle').textContent = 'Permintaan Ubah Status Transaksi Digital Content';

    const total = (item.nominal || 0) + (item.adminFee || 0);

    // Build bukti komplain section
    let buktiHtml = '';
    if (item.fileData) {
        // User uploaded an image and we have the base64 data
        buktiHtml = `
            <tr>
                <td class="detail-label">Bukti Komplain</td>
                <td class="detail-value">
                    <img src="${item.fileData}" alt="Bukti Komplain" class="bukti-image">
                </td>
            </tr>`;
    } else if (item.fileUrl) {
        // Fallback to file URL (sample image)
        buktiHtml = `
            <tr>
                <td class="detail-label">Bukti Komplain</td>
                <td class="detail-value">
                    <img src="${item.fileUrl}" alt="Bukti Komplain" class="bukti-image">
                </td>
            </tr>`;
    } else if (item.fileName) {
        buktiHtml = `
            <tr>
                <td class="detail-label">Bukti Komplain</td>
                <td class="detail-value"><i class="fas fa-file"></i> ${item.fileName}</td>
            </tr>`;
    }

    body.innerHTML = `
        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-chevron-down section-toggle-icon"></i> Data Sekarang</h3>
            <table class="modal-detail-table">
                <tr>
                    <td class="detail-label">ID Transaksi</td>
                    <td class="detail-value">${item.refId || '-'}</td>
                </tr>
                <tr>
                    <td class="detail-label">Produk</td>
                    <td class="detail-value">${item.product || '-'}</td>
                </tr>
                <tr>
                    <td class="detail-label">Status</td>
                    <td class="detail-value">
                        <span class="status-badge status-proses">Proses</span>
                    </td>
                </tr>
                <tr>
                    <td class="detail-label">Nominal</td>
                    <td class="detail-value">Rp ${formatNominal(total)}</td>
                </tr>
            </table>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-chevron-down section-toggle-icon"></i> Permintaan Data</h3>
            <table class="modal-detail-table">
                <tr>
                    <td class="detail-label">Status</td>
                    <td class="detail-value">
                        <span class="status-badge status-gagal">Gagal</span>
                    </td>
                </tr>
            </table>
        </div>

        <div class="modal-section">
            <h3 class="modal-section-title"><i class="fas fa-chevron-down section-toggle-icon"></i> Request Detail</h3>
            <table class="modal-detail-table">
                <tr>
                    <td class="detail-label">Alasan</td>
                    <td class="detail-value">${item.alasan || '-'}</td>
                </tr>
                ${buktiHtml}
            </table>
        </div>
    `;

    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ── Close Confirmation Modal ──
function closeConfirmationModal() {
    const overlay = document.getElementById('confirmOverlay');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
    activeApprovalItem = null;
}

// ── Remove approval entry from localStorage ──
function removeApprovalFromStorage(itemId) {
    const stored = JSON.parse(localStorage.getItem('paydia_approvals') || '[]');
    const updated = stored.filter(a => a.id !== itemId);
    localStorage.setItem('paydia_approvals', JSON.stringify(updated));
}

// ── Handle Reject ──
function handleReject() {
    if (!activeApprovalItem) return;
    const itemId = activeApprovalItem.id;

    removeApprovalFromStorage(itemId);

    closeConfirmationModal();
    renderTableWithLoading();
    renderPagination();
    showToast('Rejected', `Permintaan ${itemId} telah ditolak. Transaksi tetap berstatus Proses.`);
}

// ── Handle Approve ──
function handleApprove() {
    if (!activeApprovalItem) return;
    const itemId = activeApprovalItem.id;
    const refId = activeApprovalItem.refId;

    // 1. Remove from approval list
    removeApprovalFromStorage(itemId);

    // 2. Save status override so transaksi/recon page can reflect the change
    if (refId) {
        if (activeApprovalItem.tipeRequest === 'Approval Settlement') {
            localStorage.setItem('paydia_recon_approved_' + refId, 'Approved');
        } else {
            const overrides = JSON.parse(localStorage.getItem('paydia_status_overrides') || '{}');
            overrides[refId] = 'Gagal';
            localStorage.setItem('paydia_status_overrides', JSON.stringify(overrides));
        }
    }

    closeConfirmationModal();
    renderTableWithLoading();
    renderPagination();
    if (activeApprovalItem.tipeRequest === 'Approval Settlement') {
        showToast('Approved', `Sesi rekonsiliasi ${refId} telah disetujui untuk settlement.`);
    } else {
        showToast('Approved', `Permintaan ${itemId} telah disetujui. Status transaksi berubah ke Gagal.`);
    }
}

// ── Render Table ──
function renderTable() {
    tableBody.innerHTML = '';
    const allData = getAllApprovals();
    const totalItems = allData.length;
    const start = (currentPage - 1) * perPage;
    const end = Math.min(start + perPage, totalItems);
    const pageData = allData.slice(start, end);

    pageData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        const colors = requestTypeColors[item.tipeRequest] || { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };

        // Account may contain newlines (multi-line)
        const accountHtml = item.account.replace(/\n/g, '<br>');

        tr.innerHTML = `
            <td class="col-no">${start + idx + 1}</td>
            <td>${item.tanggal}</td>
            <td class="account-cell">${accountHtml}</td>
            <td>${item.admin}</td>
            <td>
                <span class="request-badge" style="background:${colors.bg};color:${colors.color};border:1px solid ${colors.border};">
                    ${item.tipeRequest}
                </span>
            </td>
            <td class="col-action-approval">
                <button class="btn-approval" data-id="${item.id}" ${(item.tipeRequest === 'Approval Settlement' && !permissions.approve) ? 'disabled style="opacity: 0.5; cursor: not-allowed;" title="Izin Approve Settlement diperlukan"' : ''}>Approval</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

// ── Render Pagination ──
function renderPagination() {
    const allData = getAllApprovals();
    const totalItems = allData.length;
    const totalPages = Math.ceil(totalItems / perPage);

    const existingBtns = paginationContainer.querySelectorAll('.page-btn:not(#prevPage):not(#nextPage), .page-dots');
    existingBtns.forEach(btn => btn.remove());

    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    const startItem = (currentPage - 1) * perPage + 1;
    const endItem = Math.min(currentPage * perPage, totalItems);
    paginationInfo.textContent = `${startItem} - ${endItem} of ${totalItems}`;

    const pages = getPageNumbers(currentPage, totalPages);
    const frag = document.createDocumentFragment();

    pages.forEach(p => {
        if (p === '...') {
            const dots = document.createElement('span');
            dots.className = 'page-dots';
            dots.textContent = '...';
            frag.appendChild(dots);
        } else {
            const btn = document.createElement('button');
            btn.className = `page-btn${p === currentPage ? ' active' : ''}`;
            btn.textContent = p;
            btn.addEventListener('click', () => {
                currentPage = p;
                renderTableWithLoading();
                renderPagination();
            });
            frag.appendChild(btn);
        }
    });

    nextBtn.before(frag);
}

function getPageNumbers(current, total) {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

// ── Toast ──
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
    setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
    if (!toast.parentNode) return;
    toast.classList.add('leaving');
    toast.addEventListener('animationend', () => toast.remove());
}

// ── Bind Events ──
function bindEvents() {
    // Filter toggle
    filterBtn.addEventListener('click', () => {
        filterPanel.classList.toggle('open');
        filterBtn.classList.toggle('active');
    });

    // Approval button clicks
    tableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-approval');
        if (btn) {
            const itemId = btn.dataset.id;
            const allData = getAllApprovals();
            const item = allData.find(a => a.id === itemId);
            if (!item) return;

            // If it's a Digital Content type or Approval Settlement, show the confirmation modal
            if ((item.tipeRequest === 'Ubah Status Transaksi Digital Content' && item.refId) || item.tipeRequest === 'Approval Settlement') {
                openConfirmationModal(item);
            } else {
                showToast('Approval', `Membuka detail approval ${itemId}`);
            }
        }
    });

    // Confirmation modal buttons
    document.getElementById('confirmClose').addEventListener('click', closeConfirmationModal);
    document.getElementById('confirmCancelBtn').addEventListener('click', closeConfirmationModal);
    document.getElementById('confirmRejectBtn').addEventListener('click', handleReject);
    document.getElementById('confirmApproveBtn').addEventListener('click', handleApprove);
    document.getElementById('confirmOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeConfirmationModal();
    });

    // Escape closes modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeConfirmationModal();
    });

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTableWithLoading();
            renderPagination();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const totalPages = Math.ceil(getAllApprovals().length / perPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTableWithLoading();
            renderPagination();
        }
    });

    // Sidebar mobile toggle
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

    // Submenu toggle
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
