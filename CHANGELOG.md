# Changelog

Semua perubahan penting pada proyek ini didokumentasikan di sini. Format mengikuti
[Keep a Changelog](https://keepachangelog.com/). Versi dipisah per surface —
**Admin** (Dashboard Internal), **Partner** (Paydia Bisnis), dan **Aplikasi** (White Label).
Registry versi in-app (yang tampil di UI) ada di `shared/versions.js`; nomor di bawah
(`1.1.0`) adalah versi repo keseluruhan.

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
