# Todo App - The Offline Abyss [E05]

## Identitas
- **Nama:** Muhammad Aqsan
- **NRP:** 5025251199
- **Kelas:** Pemrograman Web A

## Deskripsi
Toolis (ToDo List) adalah aplikasi manajemen tugas harian dan organisasi berbasis PHP & MySQL. Pada pembaruan **[E05]**, sistem telah ditingkatkan menjadi **Progressive Web App (PWA)** dengan dukungan *offline-first*. Aplikasi kini dapat diinstal di perangkat desktop maupun mobile, serta tetap dapat diakses meskipun pengguna tidak memiliki koneksi internet melalui mekanisme Service Worker dan Cache Storage.

## Fitur & Implementasi [E05]
1. **Menu Bar / Side Bar:** Menyediakan navigasi utama pemisah antara tugas "Personal" dan "Shared".
2. **Modular Code Architecture:** Penguraian kode PHP menjadi modul-modul terpisah (`config.php`, `menu-bar.php`, `header.php`, `footer.php`, `content.php`, `action.php`).
3. **Database Integration (`data.sql`):** Struktur tabel MySQL `todos` yang menyimpan data tugas, jenis (`personal`/`shared`), deadline, status, dan lokasi foto unggahan.
4. **PHP CRUD System:** Operasi Create, Read, Update, dan Delete data tugas secara langsung melalui server-side script PHP.
5. **PHP File Handling:** Pengolahan unggahan berkas gambar tugas menggunakan fungsi `move_uploaded_file()` dan manajemen hapus berkas fisik via `unlink()`.
6. **Web App Manifest (`manifest.json`):** Metadata PWA yang memungkinkan aplikasi diinstal (installable), mengonfigurasi nama aplikasi, warna tema, serta ikon aplikasi (192x192 px dan 512x512 px).
7. **Service Worker (`sw.js`):** Script background yang menangani *precaching* berkas utama *App Shell* dan menyajikan *cache fallback* secara otomatis saat terjadi kegagalan jaringan.
8. **Offline Fallback Page (`offline.html`):** Halaman penampung khusus berbasis tampilan ungu khas Toolis yang dirender saat aplikasi diakses dalam kondisi offline tanpa koneksi server.

## Struktur Berkas Projek
```text
├── config.php        # Konfigurasi koneksi ke database MySQL
├── data.sql          # Script DDL/DML tabel database 'todo_db'
├── header.php        # Komponen header web & toggle tema
├── menu-bar.php      # Komponen navigasi sidebar
├── content.php       # Komponen utama UI (Task List, Detail, & Form CRUD)
├── action.php        # Handler pemrosesan query database & file upload
├── index.php         # Halaman utama (Personal Tasks)
├── shared.php        # Halaman tugas kelompok (Shared Tasks)
├── footer.php        # Komponen footer web
├── style.css         # File penataan gaya (CSS)
├── script.js         # Handler interaksi client-side, kamera, & registrasi PWA
├── manifest.json     # Konfigurasi PWA Manifest & App Icons
├── sw.js             # Service Worker script untuk pengolahan Cache & Offline mode
├── offline.html      # Tampilan fallback saat jaringan offline
├── icon-192.png      # Ikon PWA resolusi 192x192 px
├── icon-512.png      # Ikon PWA resolusi 512x512 px
└── uploads/          # Folder tempat penyimpanan fisik berkas gambar

## Bukti Pengujian (DevTools & Offline Mode)

### 1. Web App Manifest
*Tampilan konfigurasi Manifest yang terdeteksi di Chrome DevTools:*
![Web App Manifest](readme%20image/Screenshot%202026-11-01%20125626.png)

### 2. Service Worker Status
*Status Service Worker yang sudah terdaftar, terinstal, dan aktif (`Activated and is running`):*
![Service Worker Status](readme%20image/Screenshot%202026-11-01%20132650.png)

### 3. Cache Storage (App Shell Cached)
*Aset-aset utama aplikasi yang tersimpan di Cache Storage (`toolis-pwa-v1`):*
![Cache Storage](readme%20image/Screenshot%202026-11-01%20133427.png)

### 4. Pengujian Mode Offline (Network Test)
*Simulasi mode offline menggunakan tab Network DevTools saat memuat halaman:*
![Offline Mode Test](readme%20image/Screenshot%202026-11-01%20133935.png)