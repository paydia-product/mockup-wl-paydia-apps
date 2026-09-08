/* =============================================
   Nusumma Partner Dashboard — Shared JavaScript
   ============================================= */

// ── Toast Helper ──
function showToast(title, message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const iconMap = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle' };
    toast.innerHTML = `
        <i class="fas ${iconMap[type] || iconMap.success} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'toastOut 0.3s ease-in forwards'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// ── Tenant Helpers ──
function getTenantId() {
    let tenantId = PaydiaData.getCurrentTenant();
    if (!tenantId) {
        tenantId = 'NUS-001';
        PaydiaData.setCurrentTenant(tenantId);
    }
    return tenantId;
}

function getConfig() {
    return PaydiaData.getConfig(getTenantId());
}

function getTenantInfo() {
    return PaydiaData.getTenant(getTenantId());
}

// ── Sidebar Renderer ──
function renderSidebar(activePage) {
    const config = getConfig();
    const tenant = getTenantInfo();
    const appName = config ? config.appName : (tenant ? tenant.appName : 'Partner');
    const partnerName = tenant ? tenant.partnerName : appName;
    const email = tenant ? tenant.emailPIC : 'partner@nusumma.id';
    const mid = tenant ? tenant.mid : '—';

    const navDef = [
        { type: 'link', id: 'beranda', label: 'Beranda', icon: 'fa-house', href: 'index.html', allowClick: true },
        { type: 'link', id: 'whitelabel', label: 'Whitelabel', icon: 'fa-palette', href: 'customize.html', allowClick: true },
        { type: 'link', id: 'requests', label: 'Request Kustomisasi', icon: 'fa-file-pen', href: 'requests.html', allowClick: true },
        { type: 'link', id: 'app-users', label: 'App Users', icon: 'fa-user-group', href: 'app-users.html', allowClick: true },
        { type: 'link', id: 'app-transactions', label: 'Transaction', icon: 'fa-receipt', href: 'app-transactions.html', allowClick: true },
        {
            type: 'group', id: 'sub-merchant', label: 'Sub-Merchant', icon: 'fa-store',
            children: [
                { id: 'import-merchant', label: 'Import Merchant', href: '#', toast: true }
            ]
        },
        { type: 'link', id: 'kasbon', label: 'Kasbon', icon: 'fa-file-invoice-dollar', href: '#', toast: true },
        {
            type: 'group', id: 'kirim-saldo', label: 'Kirim Saldo', icon: 'fa-paper-plane',
            children: [
                { id: 'e-wallet', label: 'E-Wallet (API)', href: '#', toast: true },
                { id: 'payroll', label: 'Payroll', href: '#', toast: true }
            ]
        },
        { type: 'link', id: 'konten', label: 'Konten Digital', icon: 'fa-tv', href: 'content.html' },
        {
            type: 'group', id: 'pengaturan', label: 'Pengaturan', icon: 'fa-gear',
            children: [
                { id: 'nusumma-api', label: 'Nusumma API', href: '#', toast: true },
                { id: 'log-aktivitas', label: 'Log Aktivitas', href: '#', toast: true }
            ]
        }
    ];

    const sidebar = document.querySelector('.sidebar') || document.getElementById('pbSidebar');
    if (!sidebar) return;

    function renderNav(items) {
        return items.map(item => {
            if (item.type === 'link') {
                const allowClickClass = item.allowClick ? ' allow-click' : '';
                const activeClass = activePage === item.id ? ' active' : '';
                const onclickAttr = item.toast ? ' onclick="return notAvailable(event)"' : '';
                return `<a href="${item.href}" class="pb-nav-item${activeClass}${allowClickClass}"${onclickAttr}>
                    <i class="fas ${item.icon}"></i> <span>${item.label}</span>
                </a>`;
            }
            const groupHasActiveChild = item.children.some(c => c.id === activePage);
            const groupHeaderClass = groupHasActiveChild ? ' pb-nav-group-header-active' : '';
            return `
                <div class="pb-nav-group-header${groupHeaderClass}">
                    <div class="pb-nav-group-left">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.label}</span>
                    </div>
                    <i class="fas fa-chevron-up pb-nav-chevron"></i>
                </div>
                <div class="pb-nav-children">
                    ${item.children.map(c => `<a href="${c.href}" class="pb-nav-item${c.id === activePage ? ' active' : ''}"${c.toast ? ' onclick="return notAvailable(event)"' : ''}>${c.label}</a>`).join('')}
                </div>
            `;
        }).join('');
    }

    sidebar.innerHTML = `
        <div class="pb-sidebar-top">
            <div class="pb-sidebar-brand">
                <div class="pb-sidebar-logo nus-mark" role="img" aria-label="Nusumma"></div>
                <div>
                    <div class="pb-sidebar-name">${partnerName}</div>
                    <div class="pb-sidebar-mid">MID: ${mid}</div>
                </div>
            </div>
        </div>
        <nav class="pb-nav">
            ${renderNav(navDef)}
            <div style="padding: 8px 16px;">
                <div style="height: 1px; background: #E2E8F0; margin: 8px 0;"></div>
            </div>
            <a href="#" class="pb-nav-item allow-click" onclick="handleLogout(event)" style="color: #ef4444 !important; font-weight: 600;">
                <i class="fas fa-right-from-bracket" style="color: #ef4444 !important;"></i> <span>Keluar</span>
            </a>
        </nav>
        <div class="pb-sidebar-footer">
            Nusumma &bull; <a href="#" onclick="return notAvailable(event)">Dokumentasi API</a>
        </div>
    `;
}

// ── "Not available in mockup" toast handler ──
function notAvailable(e) {
    if (e) e.preventDefault();
    showToast('Belum tersedia', 'Menu ini belum tersedia di mockup.', 'warning');
    return false;
}

// ── Logout Handler ──
function handleLogout(e) {
    if (e) e.preventDefault();
    PaydiaData.setCurrentTenant('');
    PaydiaData.setCurrentRole('');
    window.location.href = '../login.html';
}

// ── Format Helpers ──
function fmtCurrency(amount) {
    return PaydiaData.formatCurrency(amount);
}

function fmtDate(date) {
    return PaydiaData.formatDate(date);
}

// ── Topbar Navigation Injector ──
function renderTopbarNavigation() {
    let topbarRight = document.querySelector('.pb-topbar-right') || document.querySelector('.topbar-right');
    if (!topbarRight) return;

    // Inject Nusumma Bisnis brand logo dynamically on inner pages next to breadcrumbs
    let topbarLeft = document.querySelector('.topbar-left');
    if (topbarLeft && !topbarLeft.querySelector('.pb-topbar-brand')) {
        const brandHtml = `
            <div class="pb-topbar-brand" style="display: flex; align-items: center; gap: 10px; margin-right: 20px;">
                <img src="/nusumma/assets/logo-nusummadark.png" alt="Nusumma" style="height: 30px; width: auto; display: block;">
                <span class="pb-topbar-name" style="font-size: 1rem; font-weight: 700; color: #1E293B; letter-spacing: -0.3px;">Nusumma Bisnis</span>
            </div>
            <div style="width: 1px; height: 22px; background: #E2E8F0; margin-right: 16px;"></div>
        `;
        topbarLeft.insertAdjacentHTML('afterbegin', brandHtml);
    }

    if (document.getElementById('btn-whitelabel-app')) return;

    const navContainer = document.createElement('div');
    navContainer.style.display = 'flex';
    navContainer.style.alignItems = 'center';
    navContainer.style.gap = '8px';
    navContainer.style.marginRight = '12px';

    navContainer.innerHTML = `
        <!-- White Label App Button -->
        <button id="btn-whitelabel-app" class="btn" onclick="window.open('/nusumma/app-preview/', '_blank')" style="border: 1px solid #E07B00; color: #E07B00; background: #fff; padding: 5px 12px; font-size: 0.78rem; border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: none;">
            <i class="fas fa-mobile-screen-button"></i><span>White Label App</span>
        </button>
    `;

    topbarRight.insertBefore(navContainer, topbarRight.firstChild);
}

// ── Initialize ──
function initPartner() {
    PaydiaData.initialize();
    const tenantId = getTenantId();
    const config = getConfig();
    if (!config) {
        console.warn('No config found for tenant:', tenantId);
    }
    renderTopbarNavigation();

    // Version history widget (top-right of header)
    if (typeof mountVersionWidget === 'function') mountVersionWidget('nusumma');
}


// ── Status Badge Helper ──
// ponytail: normalized display labels kept separate from color map so raw
// English seed values (e.g. 'Active') still render Indonesian text.
const STATUS_DISPLAY_LABELS = {
    'Active': 'Aktif',
    'Inactive': 'Nonaktif',
};

function statusLabel(status) {
    return STATUS_DISPLAY_LABELS[status] || status;
}

function statusBadge(status) {
    const map = {
        'Berhasil': 'badge-success',
        'Aktif': 'badge-success',
        'Active': 'badge-success',
        'Gagal': 'badge-danger',
        'Nonaktif': 'badge-danger',
        'Inactive': 'badge-danger',
        'Diproses': 'badge-info',
        'Menunggu Review': 'badge-warning',
        'Sedang Dikerjakan': 'badge-info',
        'Selesai': 'badge-success',
        'Ditolak': 'badge-danger',
        'Buat': 'badge-info',
    };
    const cls = map[status] || 'badge-neutral';
    return `<span class="badge ${cls}"><span class="badge-dot"></span>${statusLabel(status)}</span>`;
}

// ── Transaction Type Label ──
function trxTypeLabel(type) {
    const map = {
        'transfer': 'Transfer',
        'topup': 'Top Up',
        'qris': 'QRIS',
        'biller': 'Biller',
        'payment': 'Pembayaran',
    };
    return map[type] || type;
}

// ── Modal Helper ──
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('show');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('show');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('show');
    }
});

// ── URL Validation ──
function isValidUrl(str) {
    if (!str) return false;
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}
