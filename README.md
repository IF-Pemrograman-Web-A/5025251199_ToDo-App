# Toolis — Todo App [E06: The Endpoint of Portals]

## Identitas
- **Nama:** Muhammad Aqsan
- **NRP:** 5025251199
- **Kelas:** Pemrograman Web A

## Deskripsi
Toolis (ToDo List) adalah aplikasi manajemen tugas harian dan organisasi berbasis PHP & MySQL. Pada pembaruan **[E06]**, arsitektur aplikasi telah dimigrasikan menjadi **RESTful API** (`api/todos.php`) dengan pertukaran data berbasis JSON. Seluruh operasi CRUD kini dikonsumsi secara asinkron di sisi frontend menggunakan JavaScript `fetch()` API tanpa *page reload*, lengkap dengan implementasi HTTP Status Code (`200`, `201`, `400`, `404`) serta dukungan fitur PWA (*Progressive Web App*) dan kamera dari versi sebelumnya.

## Spesifikasi RESTful API (`api/todos.php`)

| HTTP Method | Endpoint | Deskripsi | Success Code | Error Code |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/todos.php?type={type}` | Mengambil daftar tugas (`personal` / `shared`) | `200 OK` | `404 Not Found`, `500 Internal Server Error` |
| **POST** | `/api/todos.php` | Menambahkan tugas baru | `201 Created` | `400 Bad Request`, `500 Internal Server Error` |
| **PUT** | `/api/todos.php?id={id}` | Memperbarui seluruh data tugas | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **PATCH** | `/api/todos.php?id={id}` | Mengubah status tugas (`pending` / `completed`) | `200 OK` | `400 Bad Request`, `404 Not Found` |
| **DELETE** | `/api/todos.php?id={id}` | Menghapus tugas berdasarkan ID | `200 OK` | `400 Bad Request`, `404 Not Found` |

## Struktur Berkas Projek
```text
├── api/
│   └── todos.php     # Endpoint RESTful API (GET, POST, PUT, PATCH, DELETE)
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
├── script.js         # # Handler asynchronous fetch() REST API, kamera, & registrasi PWA
├── manifest.json     # Konfigurasi PWA Manifest & App Icons
├── sw.js             # Service Worker script untuk pengolahan Cache & Offline mode
├── offline.html      # Tampilan fallback saat jaringan offline
├── icon-192.png      # Ikon PWA resolusi 192x192 px
├── icon-512.png      # Ikon PWA resolusi 512x512 px
└── uploads/          # Folder tempat penyimpanan fisik berkas gambar
```

## Bukti Pengujian RESTful API & HTTP Status Codes
*Pengujian seluruh HTTP Method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) beserta penanganan response code sukses (`200`, `201`) dan error (`400`, `404`) melalui Chrome DevTools:*
<img width="959" height="509" alt="Screenshot 2026-11-12 150002" src="https://github.com/user-attachments/assets/a008928d-7b4b-42a7-bee5-b625d3cd990b" /><br><br><img width="959" height="505" alt="Screenshot 2026-11-12 203611" src="https://github.com/user-attachments/assets/2c913ed9-f39e-4335-b9e9-f9fc4d39c79d" />
