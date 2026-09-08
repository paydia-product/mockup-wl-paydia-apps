# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di sini. Format mengikuti
[Keep a Changelog](https://keepachangelog.com/). Versi dipisah per surface —
**Admin** (Dashboard Internal), **Partner** (Paydia Bisnis), dan **Aplikasi** (White Label).
Registry versi in-app (yang tampil di UI) ada di `shared/versions.js`; nomor di bawah
(`1.1.0`) adalah versi repo keseluruhan.

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
