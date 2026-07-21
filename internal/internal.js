/* =============================================
   Paydia Internal Dashboard — Shared JS
   =============================================
   Toast helper, logout handler, modal helpers,
   whitelabel options preview overlays, and detailed
   merchant modal rendering.
   ============================================= */

// ── Initialize PaydiaData ──
PaydiaData.initialize();

// ── Toast Notification Helper ──
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
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.3s ease-in forwards';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ── Logout Handler ──
function handleLogout() {
    PaydiaData.writeAuditLog({
        actor: 'admin@paydia.id',
        actorRole: 'Admin Internal',
        action: 'logout',
        objectType: 'session',
        objectId: '-',
        tenantId: '-',
        description: 'Logout dari Dashboard Internal',
        before: null,
        after: null
    });
    showToast('Logout', 'Anda telah berhasil logout.', 'success');
    setTimeout(() => {
        window.location.href = '../login.html';
    }, 800);
}

// ── Modal Helpers ──
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('show')) {
        e.target.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal-overlay.show');
        modals.forEach(m => {
            m.classList.remove('show');
            document.body.style.overflow = '';
        });
        closeWhitelabelPreview();
    }
});

// ── CSV Export Helper ──
function exportCSV(headers, rows, filename) {
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => {
            const str = String(cell).replace(/"/g, '""');
            return `"${str}"`;
        }).join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Export CSV', `File ${filename} berhasil diunduh.`, 'success');
}

// ── Format Helpers ──
function formatRupiah(amount) {
    return PaydiaData.formatCurrency(amount);
}

function formatTanggal(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr.replace(' ', 'T'));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatWaktu(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr.replace(' ', 'T'));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const pad = n => String(n).padStart(2, '0');
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ── Status Badge Helper ──
function getStatusBadge(status) {
    const map = {
        'Aktif': 'badge-success',
        'Nonaktif': 'badge-danger',
        'Berhasil': 'badge-success',
        'Diproses': 'badge-warning',
        'Gagal': 'badge-danger',
        'Menunggu Review': 'badge-warning',
        'Sedang Dikerjakan': 'badge-info',
        'Selesai': 'badge-success',
        'Ditolak': 'badge-danger'
    };
    const cls = map[status] || 'badge-neutral';
    return `<span class="badge ${cls}"><span class="badge-dot"></span>${status}</span>`;
}

// ── Notification Bell Count ──
function updateNotificationBell() {
    const requests = PaydiaData.getRequests();
    const pending = requests.filter(r => r.status === 'Menunggu Review').length;
    const dot = document.getElementById('notif-dot');
    if (dot) {
        dot.style.display = pending > 0 ? 'block' : 'none';
    }
}

// ── Accordion Toggles ──
function toggleAccordion(id) {
    const item = document.getElementById(id);
    if (item) {
        item.classList.toggle('open');
    }
}

// ── Whitelabel Preview Overlay Handlers ──
function showWhitelabelPreview(title, type, value) {
    // If the overlay doesn't exist, inject it at body root
    let overlay = document.getElementById('previewOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'previewOverlay';
        overlay.className = 'preview-overlay';
        overlay.innerHTML = `
            <div class="preview-card">
                <div class="preview-header">
                    <span class="preview-title" id="previewTitle"></span>
                    <button class="preview-close" onclick="closeWhitelabelPreview()"><i class="fas fa-times"></i></button>
                </div>
                <div class="preview-body" id="previewBody"></div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    const titleEl = document.getElementById('previewTitle');
    const borderBodyEl = document.getElementById('previewBody');
    if (titleEl && borderBodyEl) {
        titleEl.textContent = title;
        if (type === 'image') {
            let resolvedUrl = value;
            if (window.location.protocol === 'file:' && typeof value === 'string' && value.startsWith('/app-preview/')) {
                resolvedUrl = '..' + value;
            }
            borderBodyEl.innerHTML = `<img src="${resolvedUrl}" alt="${title}" style="max-height: 400px; display: block; margin: 0 auto; max-width: 100%; border-radius: 8px; border: 1px solid #E2E8F0; padding: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">`;
        } else if (type === 'text') {
            borderBodyEl.innerHTML = `<div class="preview-text">${value}</div>`;
        }
        overlay.classList.add('show');
    }
}

function closeWhitelabelPreview() {
    const overlay = document.getElementById('previewOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

// ── Populator: Merchant Details Modal ──
function showMerchantDetail(id) {
    const tenant = PaydiaData.getTenant(id);
    if (!tenant) return;

    const config = PaydiaData.getConfig(id) || {};
    const users = PaydiaData.getUsers(id) || [];
    const logs = PaydiaData.getAuditLog().filter(l => l.tenantId === id) || [];

    const body = document.getElementById('detail-tenant-body');
    if (!body) return;

    // Build the popup modal HTML markup exactly as requested
    body.innerHTML = `
        <!-- Merchant Users Section -->
        <div class="user-list-section">
            <div class="user-list-title">List User</div>
            <div class="table-scroll">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.length === 0 ? `
                            <tr><td colspan="2" class="text-muted text-center" style="font-size:0.8rem">Tidak ada user terdaftar</td></tr>
                        ` : users.map(u => `
                            <tr>
                                <td><strong>${u.name}</strong></td>
                                <td><span class="badge badge-active">${u.status || 'Active'}</span></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Accordion Settings List -->
        <div class="accordion-list">
            
            <!-- Accordion 1: Merchant -->
            <div class="accordion-item" id="acc-merchant">
                <div class="accordion-header">
                    <span>Merchant</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Nama Partner</dt><dd>${tenant.partnerName}</dd>
                        <dt>Kategori</dt><dd>${tenant.kategori || 'Merchant'}</dd>
                        <dt>MID</dt><dd><code>${tenant.mid || '-'}</code></dd>
                        <dt>PIC Email</dt><dd>${tenant.emailPIC}</dd>
                        <dt>PIC Phone</dt><dd>${tenant.phonePIC || '-'}</dd>
                        <dt>Status Merchant</dt><dd>${getStatusBadge(tenant.status)}</dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 2: Kasbon -->
            <div class="accordion-item" id="acc-kasbon">
                <div class="accordion-header">
                    <span>Kasbon</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Status Fitur</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>Maksimal Kasbon</dt><dd>${formatRupiah(5000000)}</dd>
                        <dt>Tenor Kasbon</dt><dd>30 hari</dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 3: Auth Payment -->
            <div class="accordion-item" id="acc-auth">
                <div class="accordion-header">
                    <span>Auth Payment</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>PIN Auth</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>OTP SMS</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>Biometric Auth</dt><dd><span class="badge badge-success">Active</span></dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 4: Disbursement E-money -->
            <div class="accordion-item" id="acc-disburse">
                <div class="accordion-header">
                    <span>Disbursement E-money</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Status Fitur</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>Maksimal Transfer</dt><dd>${formatRupiah(10000000)}</dd>
                        <dt>Pilihan E-money</dt><dd>Gopay, OVO, Dana, LinkAja</dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 5: Merchant Topup -->
            <div class="accordion-item" id="acc-topup">
                <div class="accordion-header">
                    <span>Merchant Topup</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Topup Virtual Account</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>Topup QRIS</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>Minimal Topup</dt><dd>${formatRupiah(10000)}</dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 6: Account Linkage -->
            <div class="accordion-item" id="acc-linkage">
                <div class="accordion-header">
                    <span>Account Linkage</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Linkage Bank Mandiri</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>Linkage Bank BCA</dt><dd><span class="badge badge-danger">Inactive</span></dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 7: Soundbox -->
            <div class="accordion-item" id="acc-soundbox">
                <div class="accordion-header">
                    <span>Soundbox</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Status Layanan</dt><dd><span class="badge badge-danger">Inactive</span></dd>
                        <dt>Nomor Serial Device</dt><dd>-</dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 8: Callback QRIS Static -->
            <div class="accordion-item" id="acc-callback">
                <div class="accordion-header">
                    <span>Callback QRIS Static</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Status Trigger</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>URL Endpoint</dt><dd><code>${config.baseUrl || 'https://api.merchant.id'}/callback/qris</code></dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 9: FDS -->
            <div class="accordion-item" id="acc-fds">
                <div class="accordion-header">
                    <span>FDS (Fraud Detection System)</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Status FDS</dt><dd><span class="badge badge-success">Active</span></dd>
                        <dt>Maksimal Percobaan PIN</dt><dd>3 kali</dd>
                        <dt>Limit Alert Harian</dt><dd>${formatRupiah(20000000)}</dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 10: Payroll -->
            <div class="accordion-item" id="acc-payroll">
                <div class="accordion-header">
                    <span>Payroll</span>
                </div>
                <div class="accordion-body">
                    <dl class="detail-grid">
                        <dt>Status Fitur</dt><dd><span class="badge badge-danger">Inactive</span></dd>
                        <dt>Batch Limit</dt><dd>100 transaksi/batch</dd>
                    </dl>
                </div>
            </div>

            <!-- Accordion 11: Whitelabel (CUSTOM DETAILED CONFIGURATION) -->
            <div class="accordion-item open" id="acc-whitelabel">
                <div class="accordion-header" onclick="toggleAccordion('acc-whitelabel')">
                    <span style="color:#2c37b7; font-weight:700;">Whitelabel <i class="fas fa-triangle-exclamation" style="color:#D97706; margin-left: 4px;" title="Pengerjaan Tambahan"></i> <span style="font-size: 0.65rem; background: #FEF3C7; color: #D97706; padding: 1px 4px; border-radius: 3px; border: 1px solid #FCD34D; font-weight: 600; margin-left: 4px; vertical-align: middle;">WIP</span></span>
                    <i class="fas fa-chevron-right chevron-icon"></i>
                </div>
                <div class="accordion-body">
                    ${config.isWhitelabelActive === false ? `
                        <div class="text-muted text-center" style="font-size:0.9rem; padding: 24px 0; color: #64748B; font-family: 'Inter', sans-serif;">Merchant belum memiliki Whitelabel</div>
                    ` : `
                        <div class="whitelabel-groups">
                        
                        <!-- Grup 1: Tampilan -->
                        <div class="whitelabel-group">
                            <div class="whitelabel-group-title">Tampilan</div>
                            <div class="whitelabel-field-grid">
                                <div class="whitelabel-field">
                                    <label>Tema Warna</label>
                                    <div class="whitelabel-field-val">
                                        <code>${config.primaryColor || '#2c37b7'}</code>
                                    </div>
                                </div>
                                <div class="whitelabel-field">
                                    <label>Logo di Dalam Aplikasi</label>
                                    <div class="whitelabel-field-val">
                                        <button class="btn-lihat" onclick="showWhitelabelPreview('Logo Aplikasi','image','${config.appLogoUrl || 'https://placehold.co/150x150/20298B/white?text=Logo'}')">Lihat</button>
                                    </div>
                                </div>
                                <div class="whitelabel-field" style="grid-column: span 2;">
                                    <label>Produk (Aktif / Inaktif)</label>
                                    <div class="whitelabel-field-val" style="display:block; width: 100%;">
                                        <ul class="whitelabel-list">
                                            <li class="whitelabel-list-item"><span>Kirim Uang</span> <span class="whitelabel-badge ${config.features?.kirimUang ? 'active' : 'inactive'}">${config.features?.kirimUang ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Minta Dana</span> <span class="whitelabel-badge ${config.features?.mintaDana ? 'active' : 'inactive'}">${config.features?.mintaDana ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Top Up</span> <span class="whitelabel-badge ${config.features?.topUp ? 'active' : 'inactive'}">${config.features?.topUp ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>QRIS</span> <span class="whitelabel-badge ${config.features?.qris ? 'active' : 'inactive'}">${config.features?.qris ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Komunitas</span> <span class="whitelabel-badge ${config.features?.komunitas ? 'active' : 'inactive'}">${config.features?.komunitas ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Pulsa &amp; Paket Data</span> <span class="whitelabel-badge ${config.features?.pulsaPaket ? 'active' : 'inactive'}">${config.features?.pulsaPaket ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>PLN</span> <span class="whitelabel-badge ${config.features?.pln ? 'active' : 'inactive'}">${config.features?.pln ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>PDAM</span> <span class="whitelabel-badge ${config.features?.pdam ? 'active' : 'inactive'}">${config.features?.pdam ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>BPJS Kesehatan</span> <span class="whitelabel-badge ${config.features?.bpjs ? 'active' : 'inactive'}">${config.features?.bpjs ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Tagihan</span> <span class="whitelabel-badge ${config.features?.tagihan ? 'active' : 'inactive'}">${config.features?.tagihan ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Kasbon</span> <span class="whitelabel-badge ${config.features?.kasbon ? 'active' : 'inactive'}">${config.features?.kasbon ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Internet</span> <span class="whitelabel-badge ${config.features?.internet ? 'active' : 'inactive'}">${config.features?.internet ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Telkom</span> <span class="whitelabel-badge ${config.features?.telkom ? 'active' : 'inactive'}">${config.features?.telkom ? 'Active' : 'Inactive'}</span></li>
                                            <li class="whitelabel-list-item"><span>Transaksi Favorit</span> <span class="whitelabel-badge ${config.features?.transaksiFavorit ? 'active' : 'inactive'}">${config.features?.transaksiFavorit ? 'Active' : 'Inactive'}</span></li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="whitelabel-field" style="grid-column: span 2;">
                                     <label>Icon dan Nama Fitur</label>
                                     <div class="whitelabel-field-val" style="display:block; width:100%">
                                         <ul class="whitelabel-list">
                                             ${Object.entries(config.features || {}).filter(([k]) => k !== 'qris').map(([k, v]) => {
                                                 const featureLabels = {
                                                     kirimUang: 'Kirim Uang',
                                                     mintaDana: 'Minta Dana',
                                                     topUp: 'Top Up',
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
                                                 };
                                                 const label = featureLabels[k] || k;
                                                 const iconUrl = config.featureIcons?.[k] || 'https://placehold.co/100x100/20298B/white?text=' + k;
                                                 return `
                                                     <li class="whitelabel-list-item">
                                                         <span>${label} (${config.featureNames?.[k] || label})</span>
                                                         <button class="btn-lihat" style="display: none;" onclick="showWhitelabelPreview('Icon Fitur - ${label}','image','${iconUrl}')">Lihat</button>
                                                     </li>
                                                 `;
                                             }).join('')}
                                         </ul>
                                     </div>
                                 </div>
                                 <div class="whitelabel-field" style="grid-column: span 2;">
                                     <label>Banner Promo</label>
                                     <div class="whitelabel-field-val" style="display:block; width:100%">
                                         <ul class="whitelabel-list">
                                             ${(config.promos || []).map((p, idx) => `
                                                 <li class="whitelabel-list-item" style="flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 0; border-bottom: 1px dashed #E2E8F0;">
                                                     <div style="font-weight:700;">Promo ${idx + 1}${p.title ? ': ' + p.title : ''}</div>
                                                     ${p.content ? `<div style="font-size:0.75rem; color:#64748B; line-height:1.4;">${p.content}</div>` : ''}
                                                     <button class="btn-lihat" style="margin-top:4px;" onclick="showWhitelabelPreview('Promo Banner ${idx + 1}','image','${p.imageUrl}')">Lihat Banner</button>
                                                 </li>
                                             `).join('')}
                                         </ul>
                                     </div>
                                 </div>
                                 <div class="whitelabel-field">
                                     <label>Splash Screen</label>
                                     <div class="whitelabel-field-val">
                                         <button class="btn-lihat" onclick="showWhitelabelPreview('Splash Screen','image','${config.splashScreenUrl || 'https://placehold.co/360x640/20298B/white?text=Splash'}')">Lihat</button>
                                     </div>
                                 </div>
                                 <div class="whitelabel-field" style="grid-column: span 2;">
                                     <label>Navigation Bar</label>
                                     <div class="whitelabel-field-val" style="display:block; width:100%">
                                         <ul class="whitelabel-list">
                                             ${(config.navbar || []).filter(nav => nav.name !== 'Scan QRIS').map(nav => `
                                                 <li class="whitelabel-list-item">
                                                     <span>${nav.name}</span>
                                                     <button class="btn-lihat" style="display: none;" onclick="showWhitelabelPreview('Navbar Icon - ${nav.name}','image','${nav.icon}')">Lihat</button>
                                                 </li>
                                             `).join('')}
                                         </ul>
                                     </div>
                                 </div>

                                <!-- HIDDEN: custom onboarding screen disabled for this phase -->
                               <div class="whitelabel-field" style="grid-column: span 2; display: none;">
                                    <label>Layar Onboarding</label>
                                    <div class="whitelabel-field-val" style="display:block; width:100%">
                                        <ul class="whitelabel-list">
                                            ${(config.onboarding || []).map(ob => `
                                                <li class="whitelabel-list-item">
                                                    <span>${ob.name}</span>
                                                    <button class="btn-lihat" onclick="showWhitelabelPreview('Onboarding - ${ob.name}','image','${ob.image}')">Lihat</button>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Grup 2: Core -->
                        <div class="whitelabel-group">
                            <div class="whitelabel-group-title">Core</div>
                            <div class="whitelabel-field-grid">
                                <div class="whitelabel-field">
                                    <label>Nama Aplikasi</label>
                                    <div class="whitelabel-field-val"><strong>${config.appName || tenant.appName}</strong></div>
                                </div>
                                <div class="whitelabel-field">
                                    <label>ID Aplikasi</label>
                                    <div class="whitelabel-field-val"><code>${config.appId || 'APP-001'}</code></div>
                                </div>
                                <div class="whitelabel-field">
                                    <label>Package Name</label>
                                    <div class="whitelabel-field-val"><code>${config.packageName || 'com.paydia'}</code></div>
                                </div>
                                <div class="whitelabel-field">
                                    <label>Logo Aplikasi (Icon)</label>
                                    <div class="whitelabel-field-val">
                                        <button class="btn-lihat" onclick="showWhitelabelPreview('Logo Aplikasi (App Icon)','image','${config.appLogoUrl}')">Lihat</button>
                                    </div>
                                </div>
                                <div class="whitelabel-field" style="grid-column: span 2;">
                                    <label>Base URL API</label>
                                    <div class="whitelabel-field-val"><code>${config.baseUrl || 'https://api.paydia.id'}</code></div>
                                </div>
                            </div>
                        </div>

                        <!-- Grup 3: Konten -->
                        <div class="whitelabel-group">
                            <div class="whitelabel-group-title">Konten</div>
                            <div class="whitelabel-field-grid">
                                <div class="whitelabel-field" style="grid-column: span 2;">
                                    <label>Terms & Conditions</label>
                                    <div class="whitelabel-field-val">
                                        <button class="btn-lihat" onclick="showWhitelabelPreview('Terms & Conditions','text','${config.tosText?.replace(/'/g, "\\'") || 'S&K Whitelabel Paydia'}')">Lihat</button>
                                    </div>
                                </div>
                                <!-- HIDDEN: social media links disabled for this phase -->
                                <div class="whitelabel-field" style="grid-column: span 2; display: none;">
                                    <label>Link Social Media</label>
                                    <div class="whitelabel-field-val" style="display:block; width:100%">
                                        <ul class="whitelabel-list">
                                            <li class="whitelabel-list-item"><span>Facebook</span> <span><code>${config.socialMedia?.facebook || '-'}</code></span></li>
                                            <li class="whitelabel-list-item"><span>TikTok</span> <span><code>${config.socialMedia?.tiktok || '-'}</code></span></li>
                                            <li class="whitelabel-list-item"><span>Instagram</span> <span><code>${config.socialMedia?.instagram || '-'}</code></span></li>
                                            <li class="whitelabel-list-item"><span>Twitter (X)</span> <span><code>${config.socialMedia?.twitter || '-'}</code></span></li>
                                        </ul>
                                    </div>
                                </div>

                                 <div class="whitelabel-field" style="grid-column: span 2;">
                                      <label>Blog</label>
                                      <div class="whitelabel-field-val" style="display:block; width:100%">
                                          <ul class="whitelabel-list">
                                             ${(config.blogs || []).map((b, idx) => `
                                                 <li class="whitelabel-list-item" style="flex-direction: column; align-items: flex-start; gap: 4px; padding: 8px 0; border-bottom: 1px dashed #E2E8F0;">
                                                     <div style="font-weight:700;">Blog ${idx + 1}</div>
                                                     <div style="font-size:0.75rem; word-break:break-all; color:#64748B;">Redirect URL: <a href="${b.blogUrl || '#'}" target="_blank" style="color:#2c37b7; text-decoration:underline;">${b.blogUrl || '-'}</a></div>
                                                     <button class="btn-lihat" style="margin-top:4px;" onclick="showWhitelabelPreview('Blog Banner ${idx + 1}','image','${b.imageUrl}')">Lihat Banner</button>
                                                 </li>
                                             `).join('')}
                                          </ul>
                                      </div>
                                  </div>

                                <div class="whitelabel-field">
                                    <label>Email Support</label>
                                    <div class="whitelabel-field-val">${config.supportEmail || '-'}</div>
                                </div>
                                <div class="whitelabel-field">
                                    <label>Call Center</label>
                                    <div class="whitelabel-field-val">${config.callCenter || '-'}</div>
                                </div>
                                <div class="whitelabel-field">
                                    <label>Nomor WhatsApp</label>
                                    <div class="whitelabel-field-val">${config.whatsapp || '-'}</div>
                                </div>
                            </div>
                        </div>

                        </div>
                    `}
                </div>
            </div>

        </div>

        <!-- Merchant Change Logs Section -->
        <div class="changes-log-section">
            <div class="changes-log-title"><i class="fas fa-history"></i> Log Perubahan</div>
            <div class="text-muted text-center" style="font-size:0.8rem; padding: 10px 0;">Belum ada log perubahan tercatat untuk merchant ini</div>
        </div>
    `;

    openModal('detailTenantModal');
}

function toggleSidebarDropdown(id) {
    const parent = document.getElementById(id).parentElement;
    parent.classList.toggle('open');
}

function selectTenantAndNavigate(tenantId) {
    if (typeof PaydiaData !== 'undefined') {
        PaydiaData.setCurrentTenant(tenantId);
        window.location.href = '../partner/index.html';
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', function() {
    updateNotificationBell();

    // Version history widget (top-right of header)
    if (typeof mountVersionWidget === 'function') mountVersionWidget('admin');

    // Partner Dashboard Dropdown Handler
    const partnerBtn = document.getElementById('btn-partner-dashboard');
    const partnerMenu = document.getElementById('partner-dropdown-menu');
    if (partnerBtn && partnerMenu && typeof PaydiaData !== 'undefined') {
        const tenants = PaydiaData.getTenants() || [];
        partnerMenu.innerHTML = tenants.map(t => {
            const noWlBadge = t.id === 'TNT-004' ? '<span style="font-size: 0.65rem; background: #fee2e2; color: #ef4444; padding: 2px 6px; border-radius: 4px; font-weight: 600; border: 1px solid #fca5a5; margin-left: 8px;">No Whitelabel</span>' : '';
            return `<a href="#" onclick="selectTenantAndNavigate('${t.id}')" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 16px; color: #334155; text-decoration: none; font-size: 0.8rem; transition: background 0.2s; font-family: 'Inter', sans-serif;">
                <span style="display: flex; align-items: center; gap: 8px;"><i class="fas fa-store" style="font-size: 0.75rem; color: #94A3B8;"></i>${t.partnerName}</span>
                ${noWlBadge}
            </a>`;
        }).join('');

        partnerBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            partnerMenu.style.display = partnerMenu.style.display === 'none' ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.topbar-dropdown-container')) {
                partnerMenu.style.display = 'none';
            }
        });
    }
});

