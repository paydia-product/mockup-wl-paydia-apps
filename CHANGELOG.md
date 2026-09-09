# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di sini. Format mengikuti
[Keep a Changelog](https://keepachangelog.com/). Versi dipisah per surface —
**Admin** (Dashboard Internal), **Partner** (Paydia Bisnis), dan **Aplikasi** (White Label).
Registry versi in-app (yang tampil di UI) ada di `shared/versions.js`; nomor di bawah
(`1.1.0`) adalah versi repo keseluruhan.

## [1.8.1] - 2026-09-09

Mockup BPR Nusumma dinonaktifkan sementara di production.

### Changed
- Seluruh path **`/nusumma`** dimatikan: setiap permintaan (portal, dashboard
  merchant, aplikasi whitelabel, aset, dan berkas data) dijawab **404** sebelum
  pemeriksaan gerbang, sehingga tidak bisa diakses sama sekali.
- Berkasnya **tidak dihapus**. Untuk menyalakan kembali, ubah satu sakelar di
  `middleware.js`: `const NUSUMMA_ENABLED = false;` menjadi `true`, lalu deploy.
- Mockup utama (Dashboard Internal, Dashboard Partner, Aplikasi White Label)
  tidak terpengaruh.

## [1.8.0] - 2026-09-09

Dashboard merchant BPR Nusumma kembali bertema biru. Versi surface: **Nusumma v1.3.0**.

### Changed
- **Dashboard merchant Nusumma** dan **portal** kini memakai tema **biru** yang
  sama dengan dashboard merchant utama: topbar, menu aktif, kartu, banner promo,
  tombol, dan cincin fokus.
- Warna khas BPR Nusumma (oranye) kini **hanya** dipakai pada **tampilan aplikasi
  whitelabel** (`/nusumma/app-preview/`) — bagian itu tidak diubah.
- Logo BPR Nusumma tetap dipakai di portal, dashboard, dan aplikasi.
- Nilai default pemilih warna di halaman Kustomisasi tetap oranye, karena itu
  warna brand aplikasi whitelabel yang sedang dikonfigurasi, bukan warna dashboard.

## [1.7.1] - 2026-09-08

Perbaikan logo yang hilang bagi pengguna lama. Versi surface: **Nusumma v1.2.0**.

### Fixed
- Logo pada splash dan header aplikasi whitelabel sempat hilang bagi pengguna
  yang sudah pernah membuka mockup: konfigurasi tersimpan di browser masih
  menunjuk berkas logo lama yang sudah dihapus. Versi data dinaikkan agar
  konfigurasi ikut diperbarui.
- Sisa data merchant cabang lama (mis. NUS-006) kini dibersihkan otomatis,
  tanpa menyentuh data mockup utama.
- Logo yang gagal dimuat kini jatuh ke berkas logo resmi, tidak lagi hilang diam-diam.

## [1.7.0] - 2026-09-08

Memakai berkas logo resmi BPR Nusumma. Versi surface: **Nusumma v1.2.0**.

### Changed
- Seluruh logo di portal, dashboard merchant, dan aplikasi whitelabel memakai
  berkas resmi `nusumma/assets/logo-nusummadark.png`.
- Slot berbentuk kotak (tile sidebar, ikon aplikasi & splash) memakai berkas yang
  sama, dipotong lewat CSS ke bagian mark "V".
- Pada latar oranye, logo dirender putih agar tetap terbaca.

### Removed
- Berkas logo sementara (SVG) dan dua halaman duplikat yang sudah tidak tertaut
  (Manajemen Akun, Riwayat Transaksi) dihapus.

## [1.6.0] - 2026-09-08

BPR Nusumma diperlakukan sebagai satu institusi + pembersihan menyeluruh. Versi surface: **Nusumma v1.1.0**.

### Changed
- Mockup Nusumma tidak lagi terbagi per cabang. Seluruh nama daerah (Jombang,
  Kediri, Tulungagung, Malang, Sidoarjo, Gresik) dihapus; kini hanya ada satu
  merchant: **PT BPR Nusumma** (24 pengguna & 40 transaksi contoh).
- Opsi **Switch Tenant** dihapus dari dashboard merchant dan dari preview
  aplikasi whitelabel, karena merchant-nya hanya satu.
- Logo dirujuk dari **satu berkas** yang sama di portal, dashboard, dan aplikasi,
  sehingga mengganti berkasnya otomatis mengganti logo di semua tempat.

### Fixed
- Menu ganda dirapikan: "Manajemen Akun" dan "Riwayat Transaksi" dihapus dari
  sidebar (isinya sama dengan App Users & Transaction); "Profil Saya" yang salah
  membuka editor tema dihapus; **Request Kustomisasi** kini punya menu sendiri.
- Tombol yang belum berfungsi (Panduan, Top Up, Kasbon, E-Wallet API, Payroll,
  Nusumma API, Log Aktivitas, Import Merchant, tombol unduh aplikasi) kini
  memberi notifikasi "Belum tersedia", tidak lagi diam saja.
- Tab Profil aplikasi dan menu bawah aplikasi kini berbahasa Indonesia dan
  memiliki label teks.
- Empat kartu ringkasan tidak lagi menampilkan angka yang sama persis; banner
  pemeliharaan diterjemahkan dan tanggalnya konsisten; banner promo mengikuti
  warna Nusumma; watermark dibuat terbaca dan tidak menutupi isi tabel.
- Kolom penerima yang kosong pada detail transaksi kini menampilkan "-".
- Menekan **Enter** pada kolom kata sandi di halaman gerbang kini mengirim form
  (sebelumnya harus klik tombol). Tampilan gerbang tidak diubah.

## [1.5.1] - 2026-09-08

Perbaikan hasil uji coba mockup BPR Nusumma di production. Versi surface: **Nusumma v1.0.1**.

### Fixed
- Cabang yang dipilih lewat "Switch Tenant" tidak lagi dikembalikan paksa ke
  Jombang ketika masuk kembali lewat portal.
- Sesi merchant Nusumma tidak lagi bisa membuka dashboard Paydia (dan sebaliknya)
  — pemeriksaan dilakukan di middleware berdasarkan tenant pada token.
- Ikon fitur di aplikasi whitelabel Nusumma kini oranye Nusumma; sebelumnya masih
  memakai ikon ungu milik mockup Paydia.
- Mark logo diperbaiki menjadi bentuk **"V"** sesuai logo resmi (sebelumnya terbalik).
- Judul "Transaksi Terakhir" pada modal detail user sebelumnya putih di atas putih.
- Menu sidebar kini menandai halaman aktif juga pada submenu.
- Data tiap cabang dibuat berbeda (sebelumnya keenam cabang identik).
- Versi pada aplikasi tidak lagi menampilkan angka warisan Paydia.
- Placeholder gambar dari CDN pihak ketiga diganti aset lokal; tombol portal
  diperbaiki agar kontrasnya memenuhi standar.

## [1.5.0] - 2026-09-08

Mockup khusus **BPR Nusumma** di prefix `/nusumma`. Versi surface: **Nusumma v1.0.0**.

### Added
- **Mockup BPR Nusumma** pada URL yang sama dengan prefix `/nusumma`, berisi
  **Dashboard Merchant** (`/nusumma/partner/`) dan **Aplikasi Whitelabel**
  (`/nusumma/app-preview/`) — fungsionalitas sama dengan mockup utama. Tidak ada
  dashboard internal di sisi Nusumma.
- Portal `/nusumma/login.html` dengan dua tujuan (Dashboard Merchant & Aplikasi
  Whitelabel). Akses tetap lewat gerbang kata sandi yang sama (`!Paydia1`) dan
  tampilan gerbangnya tidak diubah.
- Tema warna BPR Nusumma: oranye **#FF9800** (primer), **#E07E00**/#EF6C00 untuk
  status aktif, aksen hijau **#006838** — diverifikasi dari situs resmi nusumma.co.id.
- Logo BPR Nusumma (lockup & mark) di `nusumma/assets/`.
- 6 merchant cabang Nusumma (Jombang, Kediri, Tulungagung, Malang, Sidoarjo,
  Gresik), masing-masing 12 pengguna & 12 transaksi contoh.
- Registry versi surface baru `nusumma` pada widget riwayat versi.

### Catatan
- Data Nusumma **terisolasi** dengan prefix penyimpanan `nusumma_wl_` sehingga
  mockup utama tidak pernah menampilkan merchant Nusumma, dan sebaliknya.

## [1.4.0] - 2026-07-21

Dashboard Partner: modal detail dibuat terang. Versi surface: **Partner v2.6.0**.

### Changed
- Modal **Detail Transaksi** dan **Detail User** berubah dari gelap menjadi
  **putih** sesuai tema dashboard, dengan teks yang jelas terbaca (label, nilai,
  tombol tutup, dan sub-tabel "Transaksi Terakhir"). Berlaku di seluruh Dashboard
  Partner — halaman baru (App Users, Transaction) maupun lama (Manajemen Akun,
  Riwayat Transaksi).

## [1.3.0] - 2026-07-21

Dashboard Partner: tabel App Users & Transaction dibuat terang + data contoh untuk semua tenant. Versi surface: **Partner v2.5.0**.

### Changed
- Tabel di halaman **App Users** & **Transaction** berubah dari gelap menjadi
  **putih** mengikuti tema dashboard, dengan warna teks yang jelas terbaca
  (nama hampir hitam, header & kolom sekunder tetap legible). Halaman lain
  (Manajemen Akun, Riwayat Transaksi) sengaja dibiarkan seperti semula.

### Added
- **Data contoh (seed)** pengguna & transaksi untuk **setiap tenant** —
  masing-masing kini punya 12 pengguna dan 12 transaksi, sehingga halaman
  tidak lagi kosong (mis. tenant yang sebelumnya "0 user / 0 transaksi").
  Referensi antar-data konsisten (tiap transaksi menunjuk pengguna yang ada).

### Fixed
- Judul halaman di Dashboard Partner (mis. "App Users", "Transaction") yang
  sebelumnya nyaris tak terbaca (teks terang di atas latar terang) kini gelap
  dan kontras.
- Data contoh lama yang tidak konsisten (nama transaksi TNT-003 tidak cocok
  dengan penggunanya) diperbaiki.

### Catatan
- Versi SEED (`currentVersion`) dinaikkan ke `19` karena data contoh berubah —
  data lokal akan ter-refresh dengan data baru. Pengguna disarankan hard-refresh
  (Cmd+Shift+R) setelah rilis ini.

## [1.2.0] - 2026-07-21

Dashboard Partner: dua menu baru untuk memantau aplikasi whitelabel. Versi surface: **Partner v2.4.0**.

### Added
- Menu sidebar **App Users** (`partner/app-users.html`) — daftar pengguna aplikasi
  whitelabel milik partner: nama, no HP, email, status, saldo, total transaksi,
  tanggal daftar; dengan pencarian, filter status, pagination, dan detail per user.
- Menu sidebar **Transaction** (`partner/app-transactions.html`) — transaksi yang
  terjadi di aplikasi partner: ID, nama user, jenis, nominal, status, tanggal;
  dengan pencarian, filter jenis & status, pagination, dan detail per transaksi.
- Kedua filter (status & jenis) diisi otomatis dari nilai yang benar-benar ada di
  data, sehingga selalu cocok dengan isi tabel.

### Fixed
- `statusBadge`/`trxTypeLabel` (dipakai bersama halaman lama) kini mengenali nilai
  data `Active` → "Aktif" (badge hijau), `payment` → "Pembayaran", dan `Buat` —
  sebelumnya tampil mentah/abu-abu dan tak bisa difilter.
- Judul empty-state membedakan "belum ada data" vs "tidak ada hasil" pencarian/filter.
- Field kosong pada detail transaksi (mis. no HP penerima) menampilkan "-".

## [1.1.0] - 2026-07-21

Rilis batch: sistem versioning in-app + splash screen per-vendor.
Versi surface setelah rilis ini: **Admin v1.5.0 · Partner v2.3.0 · Aplikasi v5.4.0** (semua `deployed`).

### Added
- **Widget riwayat versi** di ketiga surface — pill versi + panel changelog dengan
  pencarian ("Cari versi…"), badge `Latest`/`🌐 Deployed`, ringkasan + waktu relatif,
  dan daftar perubahan. Registry **terpisah per surface** di `shared/versions.js`
  (tepat satu entri `deployed` per surface).
- **Splash screen per-vendor** di Aplikasi White Label — layar pembuka full-screen
  bertema **warna** (`primaryColor`), **logo** (`appLogoUrl`), dan **nama** (`appName`)
  tiap vendor. Tampil saat aplikasi dibuka dan setiap ganti tenant, lalu auto-fade ~1.6 detik.

### Changed
- Cache-buster `?v=` ditambahkan pada `internal.js`, `partner.js`, `app-preview.js`,
  dan `versions.js` di seluruh halaman agar browser mengambil kode terbaru (bukan cache lama).

### Fixed
- Splash kini menutup **seluruh** konten aplikasi termasuk bottom-nav, sementara
  status bar & notch tetap terlihat di atasnya (perbaikan z-index).
- Panel versi dibatasi tinggi + scroll agar semua entri terjangkau di layar pendek.
- Pencarian versi kini cocok untuk karakter khusus (`" ' & < >`).

### Catatan
- Versi SEED/DATA (`currentVersion` di `shared/data.js`) **tidak** diubah — struktur data
  tidak berubah, sehingga data lokal pengguna existing tidak ter-reset.
