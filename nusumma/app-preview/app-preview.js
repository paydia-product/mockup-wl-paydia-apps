/* =============================================
   Nusumma White Label — App Preview Logic
   =============================================
   Renders a mobile app preview from tenant config
   stored in localStorage. Supports real-time
   cross-tab sync via StorageEvent.
   ============================================= */

(function () {
    'use strict';

    // ── State ──
    let currentTenantId = '';
    let currentBannerIndex = 0;
    let bannerInterval = null;
    let balanceVisible = true;

    // ── Path Resolver ──
    // Nusumma reuses the existing /app-preview/icons/TNT-00X/... assets
    // (no nusumma-specific icon folders exist), so this is a no-op passthrough.
    function resolvePath(path) {
        return path;
    }

    // ── Toast Helper ──
    window.showToast = function (title, message, type = 'success') {
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
    };

    // ── Tab Switching ──
    window.switchTab = function (screenName) {
        const screens = document.querySelectorAll('.app-screen');
        screens.forEach(s => s.classList.remove('active'));

        const navItems = document.querySelectorAll('.bottom-nav-item');
        navItems.forEach(n => n.classList.remove('active'));

        const screenMap = {
            home: 'screenHome',
            riwayat: 'screenRiwayat',
            qris: 'screenQris',
            notifikasi: 'screenNotifikasi',
            profil: 'screenProfil',
            detailPromo: 'screenDetailPromo',
            blogDetail: 'screenBlogDetail',
            transaksiFavorit: 'screenTransaksiFavorit',
            support: 'screenSupport'
        };

        const target = document.getElementById(screenMap[screenName]);
        if (target) {
            target.classList.add('active');
        }

        // Highlight navigation item if it is a main tab
        const mainTabs = ['home', 'transaksiFavorit', 'qris', 'riwayat', 'profil'];
        if (mainTabs.includes(screenName)) {
            navItems.forEach(n => {
                if (n.dataset.screen === screenName) {
                    n.classList.add('active');
                }
            });
        }

        // Scroll content to top
        const appContent = document.querySelector('.app-content');
        if (appContent) appContent.scrollTop = 0;
    };

    // ── Populate Tenant Dropdown ──
    function populateTenantSelector() {
        const menu = document.getElementById('previewTenantMenu');
        const tenants = PaydiaData.getTenants();
        if (!menu) return;
        menu.innerHTML = tenants.map(t => {
            const isCurrent = t.id === currentTenantId;
            const checkIcon = isCurrent ? '<i class="fas fa-check" style="margin-left:auto;font-size:0.7rem;color:#E07B00;"></i>' : '';
            return `<a href="#" data-tenant-id="${t.id}" class="${isCurrent ? 'active' : ''}">
                <i class="fas fa-store" style="font-size:0.75rem;color:${isCurrent ? '#E07B00' : '#94A3B8'};"></i>
                <span>${t.partnerName}</span>
                ${checkIcon}
            </a>`;
        }).join('');

        // Attach click handlers
        menu.querySelectorAll('a[data-tenant-id]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const tenantId = this.dataset.tenantId;
                currentTenantId = tenantId;
                PaydiaData.setCurrentTenant(tenantId);
                renderApp(tenantId);
                switchTab('home');
                menu.style.display = 'none';
                populateTenantSelector();
                showToast('Tenant Diubah', `Preview sekarang menampilkan ${PaydiaData.getTenant(tenantId)?.partnerName || tenantId}`, 'success');
            });
        });
    }

    // ── Lighten / Darken Color Helper ──
    function adjustColor(hex, percent) {
        hex = hex.replace('#', '');
        if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        const num = parseInt(hex, 16);
        let r = (num >> 16) + Math.round(255 * percent / 100);
        let g = ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100);
        let b = (num & 0x0000FF) + Math.round(255 * percent / 100);
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));
        return '#' + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
    }

    // ── Per-Vendor Splash Screen ──
    let splashHideTimer = null;
    function showSplash(config) {
        if (!config) return;
        const splash = document.getElementById('appSplashScreen');
        const logoEl = document.getElementById('appSplashLogo');
        const logoWrapEl = document.getElementById('appSplashLogoWrap');
        const nameEl = document.getElementById('appSplashName');
        if (!splash) return;

        const primary = config.primaryColor || '#FF9800';
        const primaryDark = adjustColor(primary, -18);

        splash.style.background = `linear-gradient(160deg, ${primary} 0%, ${primaryDark} 100%)`;

        if (logoEl) {
            logoEl.style.display = '';
            if (logoWrapEl) logoWrapEl.style.display = '';
            logoEl.src = resolvePath(config.appLogoUrl || '');
        }
        if (nameEl) nameEl.textContent = config.appName || '';

        clearTimeout(splashHideTimer);
        splash.classList.add('app-splash-active');
        splashHideTimer = setTimeout(function () {
            splash.classList.remove('app-splash-active');
        }, 1600);
    }

    // ── Apply Theme Colors ──
    function applyColors(config) {
        const primary = config.primaryColor || '#FF9800';
        const secondary = config.secondaryColor || '#FFCC80';
        const primaryLight = adjustColor(primary, 15);

        document.documentElement.style.setProperty('--app-primary', primary);
        document.documentElement.style.setProperty('--app-secondary', secondary);
        document.documentElement.style.setProperty('--app-primary-light', primaryLight);
        document.documentElement.style.setProperty('--app-primary-transparent', primary + '1A');

        // Feature icons dynamic color
        document.querySelectorAll('.feature-icon').forEach(el => {
            el.style.color = primary;
            el.style.background = `linear-gradient(135deg, ${primary}14, ${primary}0A)`;
        });
    }

    // ── Render White Header ──
    function renderWhiteHeader(tenantId, config) {
        const logoEl = document.getElementById('appBarLogo');
        const nameEl = document.getElementById('appBarName');
        const usernameEl = document.getElementById('headerUsername');
        
        // App name
        if (nameEl) nameEl.textContent = config.appName || 'App';
        
        // App Logo
        if (logoEl) {
            if (config.logoUrl) {
                logoEl.innerHTML = `<img src="${resolvePath(config.logoUrl)}" alt="Logo">`;
            } else if (config.appLogoUrl) {
                logoEl.innerHTML = `<img src="${resolvePath(config.appLogoUrl)}" alt="Logo">`;
            } else {
                logoEl.textContent = (config.appName || 'A').charAt(0).toUpperCase();
            }
        }
        
        // Fetch user info
        const users = PaydiaData.getUsers(tenantId);
        const user = users[0] || { name: 'Dion', balance: 999990 };
        if (usernameEl) {
            const firstName = user.name ? user.name.split(' ')[0] : 'User';
            usernameEl.textContent = firstName;
        }
        
        // Render balance with toggle
        renderBalanceAmount(user.balance);
    }

    function renderBalanceAmount(balanceValue) {
        const balanceAmountEl = document.getElementById('balanceAmount');
        const toggleIcon = document.querySelector('#balanceToggle i');
        if (!balanceAmountEl || !toggleIcon) return;
        
        // Attach click handler to toggle if not already done
        const toggleBtn = document.getElementById('balanceToggle');
        if (toggleBtn && !toggleBtn.dataset.listenerAttached) {
            toggleBtn.dataset.listenerAttached = 'true';
            toggleBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                balanceVisible = !balanceVisible;
                const activeUser = (PaydiaData.getUsers(currentTenantId) || [])[0] || { balance: 999990 };
                renderBalanceAmount(activeUser.balance);
            });
        }
        
        if (balanceVisible) {
            balanceAmountEl.textContent = PaydiaData.formatCurrency(balanceValue);
            balanceAmountEl.classList.remove('censored');
            toggleIcon.className = 'fas fa-eye';
        } else {
            balanceAmountEl.textContent = '******';
            balanceAmountEl.classList.add('censored');
            toggleIcon.className = 'fas fa-eye-slash';
        }
    }

    // ── Render Service Bar ──
    function renderServiceBar(config) {
        const container = document.getElementById('serviceBar');
        if (!container) return;
        
        const features = config.features || {};
        const names = config.featureNames || {};
        const icons = config.featureIcons || {};
        
        const shortcutKeys = [
            { key: 'topUp', elId: 'serviceBar_topUp', iconId: 'serviceBarIcon_topUp', labelId: 'serviceBarLabel_topUp', defaultName: 'Top Up', defaultIcon: 'fa-circle-plus' },
            { key: 'kirimUang', elId: 'serviceBar_kirimUang', iconId: 'serviceBarIcon_kirimUang', labelId: 'serviceBarLabel_kirimUang', defaultName: 'Kirim Uang', defaultIcon: 'fa-paper-plane' },
            { key: 'mintaDana', elId: 'serviceBar_mintaDana', iconId: 'serviceBarIcon_mintaDana', labelId: 'serviceBarLabel_mintaDana', defaultName: 'Minta Dana', defaultIcon: 'fa-circle-down' }
        ];
        
        let visibleCount = 0;
        
        shortcutKeys.forEach(s => {
            const itemEl = document.getElementById(s.elId);
            const iconEl = document.getElementById(s.iconId);
            const labelEl = document.getElementById(s.labelId);
            
            if (features[s.key] !== false) {
                itemEl.style.display = 'flex';
                visibleCount++;
                
                // Label
                labelEl.textContent = names[s.key] || s.defaultName;
                
                // Icon
                if (icons[s.key]) {
                    iconEl.innerHTML = `<img src="${resolvePath(icons[s.key])}" alt="${s.key}" style="width:20px;height:20px;object-fit:contain;">`;
                } else {
                    iconEl.innerHTML = `<i class="fas ${s.defaultIcon}"></i>`;
                }
            } else {
                itemEl.style.display = 'none';
            }
        });
        
        if (visibleCount === 0) {
            container.style.display = 'none';
        } else {
            container.style.display = 'block';
        }
    }

    // ── Render Favorite card & Promo Banner ──
    let verticalBannerInterval = null;
    let currentVerticalPromoIndex = 0;

    function renderFavAndPromo(config) {
        const row = document.getElementById('favPromoRow');
        const favCard = document.getElementById('favCard');
        const promoContainer = document.getElementById('promoBannerContainer');
        const track = document.getElementById('promoBannerTrack');
        
        if (!row || !favCard || !promoContainer || !track) return;
        
        const favActive = config.features?.transaksiFavorit !== false;
        const promos = config.promos || [];
        
        if (favActive) {
            favCard.style.display = 'flex';
            const customFavName = config.featureNames?.transaksiFavorit || 'Transaksi Favorit';
            document.getElementById('favCardTitle').textContent = customFavName;
        } else {
            favCard.style.display = 'none';
        }
        
        if (promos.length > 0) {
            promoContainer.style.display = 'block';
            track.innerHTML = promos.map((p, idx) => `
                <div class="promo-slide-vertical" onclick="openPromoDetail(${idx})" style="cursor: pointer;">
                    <img src="${p.imageUrl}" alt="Promo" onerror="this.src='https://placehold.co/600x250/FF9800/white?text=Promo+Image';">
                </div>
            `).join('');
            
            currentVerticalPromoIndex = 0;
            track.scrollTop = 0;
            if (verticalBannerInterval) clearInterval(verticalBannerInterval);
            
            if (promos.length > 1) {
                verticalBannerInterval = setInterval(() => {
                    if (track.children.length === 0) return;
                    currentVerticalPromoIndex = (currentVerticalPromoIndex + 1) % promos.length;
                    const slideHeight = track.clientHeight || 115;
                    track.scrollTo({
                        top: currentVerticalPromoIndex * slideHeight,
                        behavior: 'smooth'
                    });
                }, 4000);
            }
        } else {
            promoContainer.style.display = 'none';
            track.innerHTML = '';
            if (verticalBannerInterval) clearInterval(verticalBannerInterval);
        }
        
        if (favActive && promos.length > 0) {
            row.style.display = 'flex';
            favCard.style.width = '50%';
            promoContainer.style.width = '50%';
            promoContainer.style.aspectRatio = '162/115';
        } else if (favActive) {
            row.style.display = 'flex';
            favCard.style.width = '100%';
            promoContainer.style.width = '0%';
        } else if (promos.length > 0) {
            row.style.display = 'flex';
            favCard.style.width = '0%';
            promoContainer.style.width = '100%';
            promoContainer.style.aspectRatio = '336/115';
        } else {
            row.style.display = 'none';
        }
    }

    // Modal promo opener
    window.openPromoDetail = function(index) {
        const config = PaydiaData.getConfig(currentTenantId);
        const promo = config.promos?.[index];
        if (!promo) return;
        
        const contentEl = document.getElementById('detailPromoContent');
        if (contentEl) {
            contentEl.innerHTML = `
                <img class="detail-promo-image" src="${promo.imageUrl}" alt="${promo.title}" onerror="this.src='https://placehold.co/600x250/FF9800/white?text=Promo+Image';">
                <div class="detail-promo-card" style="background: linear-gradient(135deg, ${config.primaryColor || '#FF9800'} 0%, ${config.secondaryColor || '#FFCC80'} 100%);">
                    <div class="detail-promo-title">${promo.title}</div>
                </div>
                <div class="detail-promo-body">${promo.content}</div>
            `;
        }
        switchTab('detailPromo');
    };

    // ── Render Service Grid ──
    function renderServiceGrid(config) {
        const section = document.getElementById('serviceGridSection');
        const scrollContainer = document.getElementById('serviceGridScroll');
        const indicators = document.getElementById('serviceGridIndicators');
        
        if (!section || !scrollContainer || !indicators) return;
        
        const features = config.features || {};
        const names = config.featureNames || {};
        const icons = config.featureIcons || {};
        const primary = config.primaryColor || '#FF9800';
        
        const gridCandidates = [
            { key: 'komunitas', label: 'Komunitas', icon: 'fa-users' },
            { key: 'pulsaPaket', label: 'Pulsa & Paket Data', icon: 'fa-mobile-screen' },
            { key: 'pln', label: 'PLN', icon: 'fa-bolt' },
            { key: 'pdam', label: 'PDAM', icon: 'fa-droplet' },
            { key: 'bpjs', label: 'BPJS Kesehatan', icon: 'fa-heart-pulse' },
            { key: 'tagihan', label: 'Tagihan', icon: 'fa-receipt' },
            { key: 'kasbon', label: 'Kasbon', icon: 'fa-hand-holding-dollar' },
            { key: 'internet', label: 'Internet', icon: 'fa-wifi' },
            { key: 'telkom', label: 'Telkom', icon: 'fa-phone' }
        ];
        
        const activeCandidates = gridCandidates.filter(c => features[c.key] !== false);
        
        if (activeCandidates.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        scrollContainer.innerHTML = '';
        indicators.innerHTML = '';
        
        const pageSize = 8;
        const pagesCount = Math.ceil(activeCandidates.length / pageSize);
        
        for (let i = 0; i < pagesCount; i++) {
            const pageEl = document.createElement('div');
            pageEl.className = 'service-grid-page';
            
            const pageItems = activeCandidates.slice(i * pageSize, (i + 1) * pageSize);
            pageItems.forEach(c => {
                const item = document.createElement('div');
                item.className = 'feature-item';
                
                const customName = names[c.key] || c.label;
                const customIcon = icons[c.key];
                
                let iconHtml = `<i class="fas ${c.icon}"></i>`;
                if (customIcon) {
                    iconHtml = `<img src="${resolvePath(customIcon)}" style="width: 22px; height: 22px; object-fit: contain;">`;
                }
                
                item.innerHTML = `
                    <div class="feature-icon" style="color:${primary}; background:linear-gradient(135deg, ${primary}14, ${primary}0A); display: flex; align-items: center; justify-content: center;">
                        ${iconHtml}
                    </div>
                    <span class="feature-label">${customName}</span>
                `;
                
                item.onclick = () => {
                    showToast(customName, `Membuka fitur ${customName}`, 'success');
                };
                
                pageEl.appendChild(item);
            });
            
            scrollContainer.appendChild(pageEl);
            
            const dot = document.createElement('span');
            dot.className = 'grid-dot' + (i === 0 ? ' active' : '');
            indicators.appendChild(dot);
        }
        
        if (pagesCount <= 1) {
            indicators.style.display = 'none';
        } else {
            indicators.style.display = 'flex';
        }
        
        scrollContainer.onscroll = () => {
            const width = scrollContainer.clientWidth;
            if (width === 0) return;
            const activeIndex = Math.round(scrollContainer.scrollLeft / width);
            const dots = indicators.querySelectorAll('.grid-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIndex);
            });
        };
    }

    // ── Render Blog Banner ──
    let blogBannerInterval = null;
    let currentBlogSlideIdx = 0;

    function renderBlogBanner(config) {
        const blogSection = document.getElementById('blogBannerSection');
        const track = document.getElementById('blogBannerTrack');
        const indicators = document.getElementById('blogBannerIndicators');
        
        if (!blogSection || !track || !indicators) return;
        
        const blogs = config.blogs || [];
        
        if (blogs.length > 0) {
            blogSection.style.display = 'block';
            track.innerHTML = blogs.map((b, idx) => `
                <div class="blog-slide-horizontal" onclick="showToast('Blog Link', 'Redirect to ${b.blogUrl || '#'}', 'success')">
                    <img src="${b.imageUrl}" alt="Blog ${idx + 1}" onerror="this.src='https://placehold.co/600x250/FF9800/white?text=Blog+Image';">
                </div>
            `).join('');
            
            // Render dots
            indicators.innerHTML = '';
            blogs.forEach((_, idx) => {
                const dot = document.createElement('span');
                dot.className = 'blog-dot' + (idx === 0 ? ' active' : '');
                dot.onclick = (e) => {
                    e.stopPropagation();
                    scrollToBlogSlide(idx);
                };
                indicators.appendChild(dot);
            });
            
            if (blogs.length <= 1) {
                indicators.style.display = 'none';
            } else {
                indicators.style.display = 'flex';
            }
            
            currentBlogSlideIdx = 0;
            track.scrollLeft = 0;
            
            function scrollToBlogSlide(index) {
                currentBlogSlideIdx = index;
                const slideWidth = track.clientWidth || 328;
                track.scrollTo({
                    left: currentBlogSlideIdx * slideWidth,
                    behavior: 'smooth'
                });
                resetBlogAutoScroll();
            }
            
            function resetBlogAutoScroll() {
                if (blogBannerInterval) clearInterval(blogBannerInterval);
                if (blogs.length > 1) {
                    blogBannerInterval = setInterval(() => {
                        if (track.children.length === 0) return;
                        currentBlogSlideIdx = (currentBlogSlideIdx + 1) % blogs.length;
                        const slideWidth = track.clientWidth || 328;
                        track.scrollTo({
                            left: currentBlogSlideIdx * slideWidth,
                            behavior: 'smooth'
                        });
                    }, 3000);
                }
            }
            
            resetBlogAutoScroll();
            
            track.onscroll = () => {
                const width = track.clientWidth;
                if (width === 0) return;
                const activeIndex = Math.round(track.scrollLeft / width);
                currentBlogSlideIdx = activeIndex;
                const dots = indicators.querySelectorAll('.blog-dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === activeIndex);
                });
            };
        } else {
            blogSection.style.display = 'none';
            track.innerHTML = '';
            indicators.innerHTML = '';
            if (blogBannerInterval) clearInterval(blogBannerInterval);
        }
    }

    // ── Render Bottom Navigation Bar Custom Icons ──
    function renderBottomNav(config) {
        const bottomNav = document.getElementById('bottomNav');
        if (!bottomNav) return;
        
        const qrisBtn = bottomNav.querySelector('.bottom-nav-item.qris-btn');
        if (qrisBtn) {
            const isQrisActive = config.features && config.features.qris !== false;
            qrisBtn.style.display = isQrisActive ? 'flex' : 'none';
        }

        const navbar = config.navbar || [];
        const items = bottomNav.querySelectorAll('.bottom-nav-item');
        if (items.length >= 5 && navbar.length >= 4) {
            // Mapping array of bottom-nav index to config navbar index:
            // index 0 (Beranda) -> config 0 (Home)
            // index 1 (Favorit) -> config 1 (Transaksi Favorit)
            // index 2 (QRIS) -> fixed Scan QRIS button, logo not customizable (skipped)
            // index 3 (Riwayat) -> config 2 (Riwayat Transaksi)
            // index 4 (Profil) -> config 3 (Profil)
            const mapping = [0, 1, -1, 2, 3];

            items.forEach((item, idx) => {
                // QRIS center button logo is fixed (qris.png) — never overridden
                if (idx === 2) return;
                const confIdx = mapping[idx];
                const confItem = navbar[confIdx] || {};
                
                // Update label text
                const span = item.querySelector('span');
                if (span) {
                    span.textContent = confItem.name || span.textContent;
                }
                
                // Update icon
                const iconContainer = item.querySelector('.qris-center-icon') || item;
                const oldIcon = iconContainer.querySelector('i');
                const oldImg = iconContainer.querySelector('img');
                const oldMask = iconContainer.querySelector('.nav-icon-mask');
                
                if (confItem.icon) {
                    // Remove old icon/image/mask if any
                    if (oldIcon) oldIcon.style.display = 'none';
                    if (oldImg) oldImg.remove();
                    if (oldMask) oldMask.remove();
                    
                    const resolvedIcon = resolvePath(confItem.icon);
                    if (resolvedIcon.endsWith('.svg')) {
                        // Use CSS mask so it dynamically inherits currentColor (active vs inactive text color)
                        const maskDiv = document.createElement('div');
                        maskDiv.className = 'nav-icon-mask';
                        maskDiv.style.width = '20px';
                        maskDiv.style.height = '20px';
                        maskDiv.style.backgroundColor = 'currentColor';
                        maskDiv.style.webkitMaskImage = `url(${resolvedIcon})`;
                        maskDiv.style.webkitMaskSize = 'contain';
                        maskDiv.style.webkitMaskRepeat = 'no-repeat';
                        maskDiv.style.webkitMaskPosition = 'center';
                        maskDiv.style.maskImage = `url(${resolvedIcon})`;
                        maskDiv.style.maskSize = 'contain';
                        maskDiv.style.maskRepeat = 'no-repeat';
                        maskDiv.style.maskPosition = 'center';
                        maskDiv.style.display = 'block';
                        maskDiv.style.margin = '0 auto 2px';
                        iconContainer.appendChild(maskDiv);
                    } else {
                        // Standard img tag for custom non-vector images
                        const img = document.createElement('img');
                        img.src = resolvedIcon;
                        img.style.width = '20px';
                        img.style.height = '20px';
                        img.style.objectFit = 'contain';
                        img.style.display = 'block';
                        img.style.margin = '0 auto 2px';
                        iconContainer.appendChild(img);
                    }
                } else {
                    // Fallback to default Font Awesome icon
                    if (oldIcon) oldIcon.style.display = 'inline-block';
                    if (oldImg) oldImg.remove();
                    if (oldMask) oldMask.remove();
                }
            });
        }
    }

    // ── Render Balance ──
    function renderBalance() {
        const amountEl = document.getElementById('balanceAmount');
        const toggleIcon = document.querySelector('#balanceToggle i');
        if (balanceVisible) {
            amountEl.textContent = 'Rp 1.500.000';
            amountEl.className = 'balance-amount';
            toggleIcon.className = 'fas fa-eye';
        } else {
            amountEl.textContent = '••••••••';
            amountEl.className = 'balance-hidden';
            toggleIcon.className = 'fas fa-eye-slash';
        }
    }

    // ── Transaction Helpers ──
    function getTrxIcon(type) {
        const map = {
            transfer: { icon: 'fa-arrow-right-arrow-left', cls: 'transfer' },
            topup: { icon: 'fa-plus-circle', cls: 'topup' },
            qris: { icon: 'fa-qrcode', cls: 'qris' },
            biller: { icon: 'fa-file-invoice-dollar', cls: 'biller' }
        };
        return map[type] || map.transfer;
    }

    function getTrxLabel(type) {
        const map = {
            transfer: 'Transfer',
            topup: 'Top Up',
            qris: 'QRIS Payment',
            biller: 'Pembayaran'
        };
        return map[type] || type;
    }

    function formatTrxDate(dateStr) {
        const d = new Date(dateStr.replace(' ', 'T'));
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    function formatTrxDateGroup(dateStr) {
        const d = new Date(dateStr.replace(' ', 'T'));
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) return 'Hari Ini';
        if (d.toDateString() === yesterday.toDateString()) return 'Kemarin';

        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }

    function renderTrxItem(trx) {
        const iconInfo = getTrxIcon(trx.type);
        const isCredit = trx.type === 'topup';
        const amountClass = isCredit ? 'credit' : 'debit';
        const amountPrefix = isCredit ? '+' : '-';

        let statusCls = 'success';
        let statusText = trx.status;
        if (trx.status === 'Gagal') { statusCls = 'failed'; }
        else if (trx.status === 'Diproses') { statusCls = 'pending'; }

        return `
            <div class="trx-item">
                <div class="trx-icon ${iconInfo.cls}">
                    <i class="fas ${iconInfo.icon}"></i>
                </div>
                <div class="trx-info">
                    <div class="trx-name">${trx.recipientName !== '-' ? trx.recipientName : getTrxLabel(trx.type)}</div>
                    <div class="trx-meta">
                        <span>${getTrxLabel(trx.type)}</span>
                        <span>•</span>
                        <span class="trx-status-mini ${statusCls}">${statusText}</span>
                    </div>
                </div>
                <div class="trx-amount ${amountClass}">${amountPrefix} ${PaydiaData.formatCurrency(trx.nominal)}</div>
            </div>
        `;
    }

    // Helper to format date like: 29 May 2026, 10:41 WIB
    function formatTrxDateNew(dateStr) {
        const d = new Date(dateStr.replace(' ', 'T'));
        const monthsMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const dayStr = String(d.getDate()).padStart(2, '0');
        return `${dayStr} ${monthsMap[d.getMonth()]} ${d.getFullYear()}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
    }

    // ── Render Home Transactions ──
    function renderHomeTransactions(tenantId) {
        const list = document.getElementById('historyListNew');
        if (!list) return;

        let trx = PaydiaData.getTransactions(tenantId);
        // Fallback mock if data is sparse to match Reference Image 3 perfectly
        if (trx.length < 3) {
            trx = [
                {
                    type: 'topup',
                    title: 'Top Up Transfer Business',
                    desc: '-',
                    nominal: 1000000,
                    status: 'Berhasil',
                    date: '2026-05-29 10:41:00'
                },
                {
                    type: 'topup',
                    title: 'Top Up Retail',
                    desc: 'Alfamart, Alfamidi, Dan+Dan',
                    nominal: 995000,
                    status: 'Gagal',
                    date: '2026-05-22 11:34:00'
                },
                {
                    type: 'biller',
                    title: 'Payment',
                    desc: 'Musholla Al-Ikhlas',
                    nominal: 1,
                    status: 'Berhasil',
                    date: '2026-05-08 13:56:00'
                }
            ];
        }

        const sorted = [...trx].sort((a, b) => new Date(b.date.replace(' ', 'T')) - new Date(a.date.replace(' ', 'T')));
        const recent = sorted.slice(0, 3);

        list.innerHTML = recent.map(t => {
            const isCredit = t.type === 'topup' || t.nominal > 0 && t.type !== 'biller' && t.type !== 'qris';
            
            let displayTitle = t.title;
            let displayDesc = t.desc || '-';
            
            if (!t.title) {
                // Determine details from real transaction schema fields
                if (t.type === 'topup') {
                    displayTitle = t.category || 'Top Up';
                    displayDesc = t.recipientName && t.recipientName !== '-' ? t.recipientName : '-';
                } else if (t.type === 'transfer') {
                    displayTitle = 'Transfer';
                    displayDesc = t.recipientName || '-';
                } else {
                    displayTitle = 'Payment';
                    displayDesc = t.recipientName || t.category || '-';
                }
            }

            const isSuccess = t.status === 'Berhasil' || t.status === 'Sukses';
            const isFailed = t.status === 'Gagal';

            let iconHtml = '';
            if (isSuccess) {
                iconHtml = `<div class="trx-status-circle success"><i class="fas fa-check"></i></div>`;
            } else if (isFailed) {
                iconHtml = `<div class="trx-status-circle failed"><i class="fas fa-times"></i></div>`;
            } else {
                iconHtml = `<div class="trx-status-circle pending"><i class="fas fa-ellipsis-h"></i></div>`;
            }

            const amountClass = isCredit ? 'credit' : 'debit';
            const amountPrefix = isCredit ? '+' : '-';
            const formattedNominal = PaydiaData.formatCurrency(t.nominal);
            const dateStr = formatTrxDateNew(t.date);

            return `
                <div class="history-item-new">
                    ${iconHtml}
                    <div class="history-item-info">
                        <div class="history-item-title">${displayTitle}</div>
                        <div class="history-item-desc">${displayDesc}</div>
                    </div>
                    <div class="history-item-amount-wrapper">
                        <div class="history-item-amount ${amountClass}">${amountPrefix}${formattedNominal}</div>
                        <div class="history-item-date">${dateStr}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ── Render History Screen ──
    function renderHistory(tenantId) {
        const container = document.getElementById('historyList');
        if (!container) return;

        const trx = PaydiaData.getTransactions(tenantId);
        const sorted = [...trx].sort((a, b) => new Date(b.date.replace(' ', 'T')) - new Date(a.date.replace(' ', 'T')));

        if (sorted.length === 0) {
            container.innerHTML = '<div class="app-empty" style="padding:60px 20px"><i class="fas fa-receipt"></i><span class="app-empty-text">Belum ada riwayat transaksi</span></div>';
            return;
        }

        // Group by Month & Year
        const groups = {};
        const groupOrder = [];
        sorted.forEach(t => {
            const dateObj = new Date(t.date.replace(' ', 'T'));
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const monthYearKey = `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
            if (!groups[monthYearKey]) {
                groups[monthYearKey] = [];
                groupOrder.push(monthYearKey);
            }
            groups[monthYearKey].push(t);
        });

        let html = '';
        groupOrder.forEach(monthYearKey => {
            html += `<div style="font-size: 0.8rem; font-weight: 700; color: #64748B; margin: 16px 16px 8px; font-family: 'Plus Jakarta Sans', sans-serif;">${monthYearKey}</div>`;
            html += `<div style="background: #FFFFFF; border-radius: 16px; border: 1px solid #F1F5F9; box-shadow: 0 1px 3px rgba(0,0,0,0.02); padding: 0 16px; margin: 0 16px 16px;">`;
            
            const items = groups[monthYearKey];
            items.forEach((t, idx) => {
                const isCredit = t.type === 'topup';
                const amountPrefix = isCredit ? '+' : '-';
                const amountColor = isCredit ? '#10B981' : '#EF4444';
                const formattedNominal = PaydiaData.formatCurrency(t.nominal);
                const timestamp = formatTrxDateNew(t.date);

                const isSuccess = t.status === 'Berhasil' || t.status === 'Sukses';
                const isFailed = t.status === 'Gagal';
                let iconHtml = '';
                if (isSuccess) {
                    iconHtml = `<div class="trx-status-circle success" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; background: #10B981; color: #FFFFFF;"><i class="fas fa-check"></i></div>`;
                } else if (isFailed) {
                    iconHtml = `<div class="trx-status-circle failed" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; background: #EF4444; color: #FFFFFF;"><i class="fas fa-times"></i></div>`;
                } else {
                    iconHtml = `<div class="trx-status-circle pending" style="width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; background: #F59E0B; color: #FFFFFF;"><i class="fas fa-ellipsis-h"></i></div>`;
                }

                const displayTitle = t.category || (t.type === 'topup' ? 'Top Up' : t.type === 'transfer' ? 'Transfer' : 'Payment');
                const displayDesc = t.recipientName && t.recipientName !== '-' ? t.recipientName : '-';
                const isLast = idx === items.length - 1;
                const borderStyle = isLast ? '' : 'border-bottom: 1px solid #F1F5F9;';

                html += `
                    <div style="display: flex; align-items: center; gap: 12px; padding: 14px 0; ${borderStyle}">
                        ${iconHtml}
                        <div style="flex: 1; min-width: 0;">
                            <div style="font-size: 13px; font-weight: 700; color: #1E293B; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${displayTitle}</div>
                            <div style="font-size: 11px; color: #64748B; margin-top: 2px; font-family: 'Plus Jakarta Sans', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${displayDesc}</div>
                        </div>
                        <div style="display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0;">
                            <div style="font-size: 13px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif; color: ${amountColor};">${amountPrefix}${formattedNominal}</div>
                            <div style="font-size: 9px; color: #94A3B8; margin-top: 4px; font-family: 'Plus Jakarta Sans', sans-serif;">${timestamp}</div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        });

        container.innerHTML = html;
    }

    // ── Render Notifications (Mock) ──
    function renderNotifications(config) {
        const list = document.getElementById('notifList');
        const appName = config.appName || 'App';

        list.innerHTML = `
            <div class="notif-item">
                <div class="notif-icon promo"><i class="fas fa-gift"></i></div>
                <div class="notif-body">
                    <div class="notif-body-title">Promo Cashback 50%!</div>
                    <div class="notif-body-text">Dapatkan cashback hingga Rp 25.000 untuk transaksi pertama kamu di ${appName}.</div>
                    <div class="notif-body-time">2 jam lalu</div>
                </div>
            </div>
            <div class="notif-item">
                <div class="notif-icon trx"><i class="fas fa-check-circle"></i></div>
                <div class="notif-body">
                    <div class="notif-body-title">Transfer Berhasil</div>
                    <div class="notif-body-text">Transfer sebesar Rp 500.000 ke Siti Rahayu telah berhasil.</div>
                    <div class="notif-body-time">5 jam lalu</div>
                </div>
            </div>
            <div class="notif-item">
                <div class="notif-icon info"><i class="fas fa-info-circle"></i></div>
                <div class="notif-body">
                    <div class="notif-body-title">Update Aplikasi</div>
                    <div class="notif-body-text">Versi terbaru ${appName} sudah tersedia. Update sekarang untuk fitur baru!</div>
                    <div class="notif-body-time">1 hari lalu</div>
                </div>
            </div>
            <div class="notif-item">
                <div class="notif-icon security"><i class="fas fa-shield-alt"></i></div>
                <div class="notif-body">
                    <div class="notif-body-title">Login Berhasil</div>
                    <div class="notif-body-text">Akun kamu baru saja login dari perangkat baru. Jika bukan kamu, segera hubungi CS.</div>
                    <div class="notif-body-time">2 hari lalu</div>
                </div>
            </div>
        `;
    }

    // ── Render Profile Screen ──
    function renderProfile(config) {
        // Fetch current active user details
        const users = PaydiaData.getUsers(currentTenantId) || [];
        const user = users[0] || { name: 'Dion', phone: '087885900280', email: 'dion.scholus@gmail.com' };

        // Set Full Name
        const nameEl = document.getElementById('profileFullNameVal');
        if (nameEl) nameEl.textContent = user.name || '-';

        // Set Phone Number
        const phoneEl = document.getElementById('profilePhoneVal');
        if (phoneEl) {
            // Format phone if needed
            phoneEl.textContent = PaydiaData.formatPhone(user.phone) || '-';
        }

        // Set Email
        const emailEl = document.getElementById('profileEmailVal');
        if (emailEl) emailEl.textContent = user.email || '-';

        // Handle Terms & Conditions click
        const btnTerms = document.getElementById('btnTermsAndConditions');
        if (btnTerms) {
            btnTerms.onclick = function() {
                const text = config.tosText || 'Syarat & Ketentuan Penggunaan Aplikasi Whitelabel BPR Nusumma ini diatur oleh BPR Nusumma. Dengan menggunakan aplikasi ini, Anda setuju untuk mematuhi seluruh hukum yang berlaku di Republik Indonesia serta batasan limit transaksi harian yang ditetapkan.';
                alert(text);
            };
        }

        // Set dynamic Copyright
        const copyrightEl = document.getElementById('profileCopyrightVal');
        if (copyrightEl) {
            const tenant = PaydiaData.getTenant(currentTenantId);
            const merchantName = tenant ? tenant.partnerName : 'PT. Datacell Infomedia';
            copyrightEl.textContent = `Copyright © 2026 ${merchantName}. All right Reserved.`;
        }

        // Render customer support dynamic data
        renderSupportScreen(config);
    }

    // ── Render Customer Support Screen ──
    function renderSupportScreen(config) {
        const container = document.getElementById('supportContent');
        if (!container) return;

        const appName = config.appName || 'Nusumma';
        const primaryColor = config.primaryColor || '#FF9800';

        // Check if buttons are filled in partner config
        const hasCallCenter = !!config.callCenter;
        const hasEmail = !!config.supportEmail;
        const hasWhatsapp = !!config.whatsapp;

        // Check if social media is filled
        const social = config.socialMedia || {};
        const hasFacebook = !!social.facebook;
        const hasTiktok = !!social.tiktok;
        const hasInstagram = !!social.instagram;
        const hasTwitter = !!social.twitter || !!social.facebook || !!social.tiktok || !!social.instagram; // checking for any of social fields to display section

        // Start building HTML
        let html = `
            <!-- Illustration -->
            <div style="margin-top: 10px; display: flex; justify-content: center; width: 100%;">
                <img src="/shared/support_illustration.png" alt="Customer Support" style="width: 180px; height: 180px; object-fit: contain;">
            </div>
            
            <!-- Support Badge -->
            <div style="background: ${primaryColor}; color: #FFFFFF; font-weight: 700; padding: 10px 24px; border-radius: 6px; font-size: 0.95rem; margin-top: 20px; font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                ${appName} Support
            </div>
            
            <!-- Headers -->
            <div style="font-size: 1.1rem; font-weight: 700; margin: 24px 0 6px; color: #1E293B; font-family: 'Plus Jakarta Sans', sans-serif; text-align: center;">Need Help?</div>
            <div style="font-size: 0.85rem; color: #64748B; text-align: center; max-width: 90%; line-height: 1.5; font-family: 'Plus Jakarta Sans', sans-serif;">
                Feel free to reach out to us. Our customer service is happy to assist you.
            </div>
            <div style="font-size: 0.8rem; color: #64748B; text-align: center; margin-top: 4px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;">
                Operating Hours (08.00–17.00)
            </div>
            
            <!-- Contact buttons -->
            <div style="width: 100%; display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
        `;

        // Render Call Center Button
        if (hasCallCenter) {
            html += `
                <button onclick="showToast('Call Center', 'Redirect to ${config.callCenter}', 'success')" style="width: 100%; height: 46px; background: ${primaryColor}; color: #FFFFFF; font-weight: 600; border: none; border-radius: 10px; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: opacity 0.2s;">
                    <i class="fas fa-headset" style="font-size: 1rem;"></i>
                    Call Center
                </button>
            `;
        }

        // Render Email Button
        if (hasEmail) {
            html += `
                <button onclick="showToast('Email', 'Redirect to ${config.supportEmail}', 'success')" style="width: 100%; height: 46px; background: ${primaryColor}; color: #FFFFFF; font-weight: 600; border: none; border-radius: 10px; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: opacity 0.2s;">
                    <i class="far fa-envelope" style="font-size: 1rem;"></i>
                    Email
                </button>
            `;
        }

        // Render Whatsapp Button
        if (hasWhatsapp) {
            html += `
                <button onclick="showToast('Whatsapp', 'Redirect to ${config.whatsapp}', 'success')" style="width: 100%; height: 46px; background: ${primaryColor}; color: #FFFFFF; font-weight: 600; border: none; border-radius: 10px; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Plus Jakarta Sans', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.04); transition: opacity 0.2s;">
                    <i class="fab fa-whatsapp" style="font-size: 1.1rem;"></i>
                    Whatsapp
                </button>
            `;
        }

        html += `</div>`;

        // HIDDEN: social media icons disabled for this phase
        // Social media rendering skipped

        container.innerHTML = html;
    }

    // ── Master Render ──
    function renderApp(tenantId) {
        const config = PaydiaData.getConfig(tenantId);
        if (!config) {
            showToast('Error', 'Konfigurasi tenant tidak ditemukan', 'error');
            return;
        }

        currentTenantId = tenantId;
        const primary = config.primaryColor || '#FF9800';
        const primaryLight = adjustColor(primary, 15);

        // Per-vendor themed splash (initial load + every tenant switch)
        showSplash(config);

        // Update active tenant display info
        const activeTenantInfo = document.getElementById('activeTenantInfo');
        if (activeTenantInfo) {
            const tenant = PaydiaData.getTenant(tenantId);
            activeTenantInfo.innerHTML = `Melihat Simulasi: <strong>${tenant ? tenant.partnerName : tenantId}</strong>`;
        }

        // Apply colors
        applyColors(config);

        // New layout renderers
        renderWhiteHeader(tenantId, config);
        renderServiceBar(config);
        renderFavAndPromo(config);
        renderServiceGrid(config);
        renderBlogBanner(config);

        // Transactions
        renderHomeTransactions(tenantId);
        renderHistory(tenantId);

        // Notifications
        renderNotifications(config);

        // Profile
        renderProfile(config);

        // QRIS center icon gradient
        const qrisCenterIcon = document.querySelector('.qris-center-icon');
        if (qrisCenterIcon) {
            qrisCenterIcon.style.background = `linear-gradient(135deg, ${primary}, ${primaryLight})`;
        }

        // Bottom Navigation Custom Icons
        renderBottomNav(config);
    }

    // ── Balance Toggle ──


    // ── Switch Tenant Dropdown Toggle ──
    const btnSwitch = document.getElementById('btnSwitchTenant');
    const tenantMenu = document.getElementById('previewTenantMenu');
    if (btnSwitch && tenantMenu) {
        btnSwitch.addEventListener('click', function (e) {
            e.stopPropagation();
            tenantMenu.style.display = tenantMenu.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.preview-dropdown-container')) {
                tenantMenu.style.display = 'none';
            }
        });
    }

    // ── Cross-Tab Sync ──
    PaydiaData.onStorageChange(function (key, newValue, oldValue) {
        // If it's a config change for the current tenant, re-render
        if (key === 'nusumma_wl_config_' + currentTenantId) {
            renderApp(currentTenantId);
            showToast('Live Update', 'Konfigurasi berhasil diperbarui dari Dashboard Partner', 'success');
        }
        // If it's the tenant list, re-populate the dropdown
        if (key === 'nusumma_wl_tenants') {
            populateTenantSelector();
        }
        // If it's transaction data for the current tenant
        if (key === 'nusumma_wl_trx_' + currentTenantId) {
            renderHomeTransactions(currentTenantId);
            renderHistory(currentTenantId);
        }
    });

    // ── Dashboard Internal Navigation Bypassing Login ──
    async function generateMockToken(email, role, tenantId) {
        const TOKEN_SECRET = 'pyd_s3cR3t_k3y_r3c0n_2026!xZ9';
        const payload = JSON.stringify({
            email,
            role,
            tenantId: tenantId || '',
            ts: Date.now()
        });
        const encoded = btoa(payload);
        
        // sha256 in browser
        const encoder = new TextEncoder();
        const data = encoder.encode(encoded + ':' + TOKEN_SECRET);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return encoded + '.' + signature;
    }

    function setupPartnerNav() {
        const btnPartner = document.getElementById('btnDashboardPartner');
        if (btnPartner) {
            btnPartner.addEventListener('click', async function (e) {
                e.preventDefault();
                try {
                    const activeTenant = PaydiaData.getTenant(currentTenantId);
                    const email = activeTenant ? activeTenant.emailPIC : 'partner@nusumma-jombang.id';
                    const token = await generateMockToken(email, 'partner', currentTenantId);
                    document.cookie = `dsh_auth=${token}; Path=/; Max-Age=86400; SameSite=Strict`;
                    document.cookie = `dsh_role=partner; Path=/; Max-Age=86400; SameSite=Strict`;
                    document.cookie = `dsh_tenant=${currentTenantId}; Path=/; Max-Age=86400; SameSite=Strict`;
                    window.location.href = '/nusumma/partner/index.html';
                } catch (err) {
                    console.error('Failed to set mock partner auth:', err);
                    window.location.href = '/nusumma/partner/index.html';
                }
            });
        }
    }

    // ── Initialize ──
    function init() {
        PaydiaData.initialize();

        // Determine initial tenant
        currentTenantId = PaydiaData.getCurrentTenant() || 'NUS-001';
        const tenants = PaydiaData.getTenants();
        if (tenants.length > 0 && !tenants.find(t => t.id === currentTenantId)) {
            currentTenantId = tenants[0].id;
        }

        populateTenantSelector();
        renderApp(currentTenantId);

        // Setup partner dashboard mock navigation handler
        setupPartnerNav();

        // Ensure home tab is active on load
        switchTab('home');

        // Version history widget (preview toolbar)
        if (typeof mountVersionWidget === 'function') mountVersionWidget('nusumma');
    }

    // Run
    init();

})();
