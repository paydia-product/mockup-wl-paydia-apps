/* =============================================
   Partner Dashboard — Shared JavaScript
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
        tenantId = 'TNT-001';
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
    const email = tenant ? tenant.emailPIC : 'partner@app.id';
    const initial = partnerName ? partnerName.charAt(0).toUpperCase() : 'P';
    const mid = tenant ? tenant.mid : '—';

    const navDef = [
        { type: 'link', id: 'beranda', label: 'Beranda', icon: 'fa-house', href: 'index.html', allowClick: true },
        { type: 'link', id: 'whitelabel', label: 'Whitelabel', icon: 'fa-palette', href: 'customize.html', allowClick: true },
        {
            type: 'group', id: 'sub-merchant', label: 'Sub-Merchant', icon: 'fa-store',
            children: [
                { label: 'Import Merchant', href: '#' },
                { label: 'Riwayat Transaksi', href: 'transactions.html' }
            ]
        },
        { type: 'link', id: 'kasbon', label: 'Kasbon', icon: 'fa-file-invoice-dollar', href: '#' },
        {
            type: 'group', id: 'kirim-saldo', label: 'Kirim Saldo', icon: 'fa-paper-plane',
            children: [
                { label: 'E-Wallet (API)', href: '#' },
                { label: 'Payroll', href: '#' }
            ]
        },
        { type: 'link', id: 'konten', label: 'Konten Digital', icon: 'fa-tv', href: 'content.html' },
        {
            type: 'group', id: 'pengaturan', label: 'Pengaturan', icon: 'fa-gear',
            children: [
                { label: 'Profil Saya', href: 'customize.html' },
                { label: 'Manajemen Akun', href: 'members.html' },
                { label: 'Paydia API', href: '#' },
                { label: 'Log Aktivitas', href: '#' }
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
                const onclickAttr = item.id === 'whitelabel' ? ' onclick="handleWhitelabelClick(event)"' : '';
                return `<a href="${item.href}" class="pb-nav-item${activeClass}${allowClickClass}"${onclickAttr}>
                    <i class="fas ${item.icon}"></i> <span>${item.label}</span>
                </a>`;
            }
            return `
                <div class="pb-nav-group-header">
                    <div class="pb-nav-group-left">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.label}</span>
                    </div>
                    <i class="fas fa-chevron-up pb-nav-chevron"></i>
                </div>
                <div class="pb-nav-children">
                    ${item.children.map(c => `<a href="${c.href}" class="pb-nav-item">${c.label}</a>`).join('')}
                </div>
            `;
        }).join('');
    }

    sidebar.innerHTML = `
        <div class="pb-sidebar-top">
            <div class="pb-sidebar-brand">
                <div class="pb-sidebar-logo">${initial}</div>
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
            Paydia &bull; <a href="#">Dokumentasi API</a>
        </div>
    `;
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

    // Inject Paydia Bisnis brand logo dynamically on inner pages next to breadcrumbs
    let topbarLeft = document.querySelector('.topbar-left');
    if (topbarLeft && !topbarLeft.querySelector('.pb-topbar-brand')) {
        const brandHtml = `
            <div class="pb-topbar-brand" style="display: flex; align-items: center; gap: 10px; margin-right: 20px;">
                <div class="pb-topbar-logo" style="width: 30px; height: 30px; border-radius: 50%; background: #1E40AF; color: #fff; font-weight: 900; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-style: italic;"><i>p</i></div>
                <span class="pb-topbar-name" style="font-size: 1rem; font-weight: 700; color: #1E293B; letter-spacing: -0.3px;">Paydia Bisnis</span>
            </div>
            <div style="width: 1px; height: 22px; background: #E2E8F0; margin-right: 16px;"></div>
        `;
        topbarLeft.insertAdjacentHTML('afterbegin', brandHtml);
    }

    if (document.getElementById('btn-whitelabel-app')) return;

    const tenants = PaydiaData.getTenants() || [];
    const currentTenantId = getTenantId();

    const dropdownItemsHtml = tenants.map(t => {
        const isCurrent = t.id === currentTenantId;
        const noWlBadge = t.id === 'TNT-004' ? '<span style="font-size: 0.65rem; background: #fee2e2; color: #ef4444; padding: 2px 6px; border-radius: 4px; font-weight: 600; border: 1px solid #fca5a5; margin-left: auto;">No Whitelabel</span>' : '';
        const checkIcon = isCurrent ? '<i class="fas fa-check" style="margin-left: auto; font-size: 0.7rem; color: #2c37b7;"></i>' : '';
        return `<a href="#" onclick="selectTenantAndReload(event, '${t.id}')" style="display: flex; align-items: center; gap: 8px; padding: 8px 16px; color: ${isCurrent ? '#2c37b7' : '#334155'}; background: ${isCurrent ? '#F1F5F9' : 'transparent'}; text-decoration: none; font-size: 0.8rem; font-weight: ${isCurrent ? '600' : '400'}; transition: background 0.2s; font-family: 'Inter', sans-serif;">
            <i class="fas fa-store" style="font-size: 0.75rem; color: ${isCurrent ? '#2c37b7' : '#94A3B8'};"></i>
            <span>${t.partnerName}</span>
            ${noWlBadge || checkIcon}
        </a>`;
    }).join('');

    // Dynamically inject styles for hover transitions in the dropdown menu
    if (!document.getElementById('partner-dropdown-styles')) {
        const styleTag = document.createElement('style');
        styleTag.id = 'partner-dropdown-styles';
        styleTag.textContent = `
            .partner-dropdown-menu a:hover {
                background: #F1F5F9 !important;
                color: #2c37b7 !important;
            }
            .partner-dropdown-menu a:hover i {
                color: #2c37b7 !important;
            }
        `;
        document.head.appendChild(styleTag);
    }

    const navContainer = document.createElement('div');
    navContainer.style.display = 'flex';
    navContainer.style.alignItems = 'center';
    navContainer.style.gap = '8px';
    navContainer.style.marginRight = '12px';

    const hasWhitelabel = currentTenantId !== 'TNT-004';
    const whitelabelOnclick = hasWhitelabel
        ? "window.open('../app-preview/index.html', '_blank')"
        : "handleWhitelabelClick(event)";

    navContainer.innerHTML = `
        <!-- White Label App Button -->
        <button id="btn-whitelabel-app" class="btn" onclick="${whitelabelOnclick}" style="border: 1px solid #2c37b7; color: #2c37b7; background: #fff; padding: 5px 12px; font-size: 0.78rem; border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: none;">
            <i class="fas fa-mobile-screen-button"></i><span>White Label App</span>
        </button>

        <!-- Dropdown Tenant Lain -->
        <div class="topbar-dropdown-container" style="position: relative; display: inline-block;">
            <button class="btn" id="btn-partner-tenant-dropdown" style="background: #2c37b7; color: #fff; border: none; padding: 5px 12px; font-size: 0.78rem; border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: none;">
                <i class="fas fa-store"></i><span>Switch Tenant</span> <i class="fas fa-chevron-down" style="font-size: 0.7rem; margin-left: 2px;"></i>
            </button>
            <div class="partner-dropdown-menu" id="partner-tenant-dropdown-menu" style="display: none; position: absolute; top: 100%; right: 0; background: #fff; border: 1px solid #CBD5E1; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); z-index: 1000; min-width: 200px; text-align: left; margin-top: 4px; padding: 4px 0;">
                ${dropdownItemsHtml}
            </div>
        </div>

        <!-- Dashboard Internal Button -->
        <button id="btn-internal-dashboard" class="btn" onclick="switchToInternal(event)" style="border: 1px solid #2c37b7; color: #2c37b7; background: #fff; padding: 5px 12px; font-size: 0.78rem; border-radius: 6px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: none;">
            <i class="fas fa-user-shield"></i><span>Dashboard Internal</span>
        </button>
    `;

    topbarRight.insertBefore(navContainer, topbarRight.firstChild);

    const dropdownBtn = document.getElementById('btn-partner-tenant-dropdown');
    const dropdownMenu = document.getElementById('partner-tenant-dropdown-menu');
    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.topbar-dropdown-container')) {
                dropdownMenu.style.display = 'none';
            }
        });
    }
}

function selectTenantAndReload(e, tenantId) {
    if (e) e.preventDefault();
    if (typeof PaydiaData !== 'undefined') {
        PaydiaData.setCurrentTenant(tenantId);
        window.location.reload();
    }
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
}


// ── Status Badge Helper ──
function statusBadge(status) {
    const map = {
        'Berhasil': 'badge-success',
        'Aktif': 'badge-success',
        'Gagal': 'badge-danger',
        'Nonaktif': 'badge-danger',
        'Diproses': 'badge-info',
        'Menunggu Review': 'badge-warning',
        'Sedang Dikerjakan': 'badge-info',
        'Selesai': 'badge-success',
        'Ditolak': 'badge-danger',
    };
    const cls = map[status] || 'badge-neutral';
    return `<span class="badge ${cls}"><span class="badge-dot"></span>${status}</span>`;
}

// ── Transaction Type Label ──
function trxTypeLabel(type) {
    const map = {
        'transfer': 'Transfer',
        'topup': 'Top Up',
        'qris': 'QRIS',
        'biller': 'Biller',
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

// ── Global Helper for GAPay Whitelabel Alert ──
function handleWhitelabelClick(event) {
    const tenantId = getTenantId();
    if (tenantId === 'TNT-004') {
        if (event) event.preventDefault();
        showWhitelabelInfoModal();
    }
}
window.handleWhitelabelClick = handleWhitelabelClick;

// ── Whitelabel Not Registered Info Modal ──
function showWhitelabelInfoModal() {
    let overlay = document.getElementById('whitelabelInfoModal');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.id = 'whitelabelInfoModal';
        overlay.innerHTML = `
            <div class="modal-dialog" style="max-width:400px; text-align:center; padding: 32px 24px; background: #FFFFFF; border: 1px solid #E2E8F0;">
                <div style="font-size: 4rem; color: #2c37b7; margin-bottom: 20px;">
                    <i class="fas fa-circle-info"></i>
                </div>
                <h2 style="font-size: 1.5rem; color: #0F172A; margin-bottom: 12px; font-weight: 700; font-family: 'Inter', sans-serif;">Belum Terdaftar Whitelabel</h2>
                <p style="font-size: 0.9rem; color: #64748B; line-height: 1.6; margin-bottom: 24px; font-family: 'Inter', sans-serif;">
                    Merchant ini belum mendaftar layanan whitelabel. Silakan hubungi tim sales kami untuk mendaftar.
                </p>
                <button onclick="document.getElementById('whitelabelInfoModal').classList.remove('show')" style="background: #2c37b7; color: #FFFFFF; font-weight: 700; border: none; padding: 12px 32px; border-radius: 8px; cursor: pointer; transition: background 0.2s; font-family: 'Inter', sans-serif; display: inline-block; width: auto; font-size: 0.9rem; box-shadow: 0 4px 10px rgba(44, 55, 183, 0.25);">
                    Ok
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.classList.add('show');
}
window.showWhitelabelInfoModal = showWhitelabelInfoModal;

// ── Switch to Internal Dashboard (auth cookies role bypass) ──
async function switchToInternal(event) {
    if (event) event.preventDefault();
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@paydia.id', role: 'internal' })
        });
        if (response.ok) {
            if (typeof PaydiaData !== 'undefined') {
                PaydiaData.setCurrentRole('internal');
            }
            window.location.href = '../internal/tenants.html';
        } else {
            console.error('Failed to switch to internal');
        }
    } catch (err) {
        console.error('Error switching to internal:', err);
    }
}
window.switchToInternal = switchToInternal;
