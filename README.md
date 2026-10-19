# Todo App - The Iron Citadel [E04]

## Identitas
- **Nama:** Muhammad Aqsan
- **NRP:** 5025251199
- **Kelas:** Pemrograman Web A

## Deskripsi
Toolis (ToDo List) adalah aplikasi manajemen tugas harian dan organisasi berbasis PHP & MySQL. Pada pembaruan [E04], sistem telah dimigrasikan dari HTML statis menjadi arsitektur PHP modular yang terhubung langsung dengan Database MySQL untuk mendukung fungsionalitas To-Do Personal dan Shared (Organizational).

## Fitur & Implementasi [E04]
1. **Menu Bar / Side Bar:** Menyediakan navigasi utama pemisah antara tugas "Personal" dan "Shared".
2. **Modular Code Architecture:** Penguraian kode PHP menjadi modul-modul terpisah (`config.php`, `menu-bar.php`, `header.php`, `footer.php`, `content.php`, `action.php`).
3. **Database Integration (`data.sql`):** Struktur tabel MySQL `todos` yang menyimpan data tugas, jenis (`personal`/`shared`), deadline, status, dan lokasi foto unggahan.
4. **PHP CRUD System:** Operasi Create, Read, Update, dan Delete data tugas secara langsung melalui server-side script PHP.
5. **PHP File Handling:** Pengolahan unggahan berkas gambar tugas menggunakan fungsi `move_uploaded_file()` dan manajemen hapus berkas fisik via `unlink()`.

## Struktur Berkas Projek
```text
├── config.php      # Konfigurasi koneksi ke database MySQL
├── data.sql        # Script DDL/DML tabel database 'todo_db'
├── header.php      # Komponen header web & toggle tema
├── menu-bar.php    # Komponen navigasi sidebar
├── content.php     # Komponen utama UI (Task List, Detail, & Form CRUD)
├── action.php      # Handler pemrosesan query database & file upload
├── index.php       # Halaman utama (Personal Tasks)
├── shared.php      # Halaman tugas kelompok (Shared Tasks)
├── footer.php      # Komponen footer web
├── style.css       # File penataan gaya (CSS)
├── script.js       # Handler interaksi client-side & kamera
└── uploads/        # Folder tempat penyimpanan fisik berkas gambar

## Tampilan terbaru
