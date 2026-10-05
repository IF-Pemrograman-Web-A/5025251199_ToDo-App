# Todo App - The Lost Cavern

## Identitas
- **Nama:** Muhammad Aqsan
- **NRP:** 5025251199
- **Kelas:** Pemrograman Web A

## Deskripsi
Toolis (ToDo List) adalah aplikasi manajemen tugas harian berbasis Progressive Web App (PWA) yang dibangun menggunakan Native HTML5, CSS3, dan Vanilla JavaScript. Web ini dirancang dengan struktur *semantic HTML* dan *responsive layouting* (Flexbox & Grid), serta dilengkapi dengan kemampuan offline, penyimpanan lokal persisten, dan integrasi fitur media capture.

## Fitur Tambahan [E03]
1. **Web Storage:**
   - **IndexedDB:** Menyimpan data tugas (todo list), lampiran gambar, dan jadwal pengingat secara permanen di database lokal browser.
   - **localStorage:** Menyimpan preferensi tema (*Light/Dark Mode*) pengguna agar tetap bertahan saat halaman dimuat ulang.
2. **Media Capture API:**
   - Fitur unggah gambar/foto lampiran todo melalui *file chooser* atau langsung menggunakan kamera perangkat (*live camera stream* via `navigator.mediaDevices.getUserMedia`).
3. **Service Worker & Notification API:**
   - **Service Worker (`sw.js`):** Mendukung pengalaman *offline-first* dengan melakukan *caching* aset statis web.
   - **Web Notifications:** Pengingat otomatis (*reminder notification*) yang terintegrasi dengan field `datetime-local` pada form tugas.
4. **Accessibility (a11y) & Best Practices:**
   - Penerapan atribut ARIA (`aria-label`), *semantic landmark*, *keyboard navigation support*, dan standar kontras warna ramah pembaca layar (*screen reader*).

## Deployed Link
https://huspy8108.github.io/PWEB-E03/

## Desktop Preview
<img width="959" height="505" alt="Screenshot 2026-10-05 174633" src="https://github.com/user-attachments/assets/f2e7f8c9-9b22-4347-b472-af23dbecd267" />

## Mobile Preview
<img width="194" height="380" alt="Screenshot 2026-10-05 174322" src="https://github.com/user-attachments/assets/bb57ca5d-f810-4fe2-a35f-b7491a1da269" />
