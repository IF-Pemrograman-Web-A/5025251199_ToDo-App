CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

DROP TABLE IF EXISTS todos;

CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline DATE,
    status ENUM('pending', 'completed') DEFAULT 'pending',
    type ENUM('personal', 'shared') DEFAULT 'personal',
    image_path VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todos (title, description, deadline, status, type, image_path) VALUES
('Menyelesaikan 4 css games', 'Selesai mengerjakan CSS games', '2026-09-10', 'completed', 'personal', NULL),
('Membuat Webpage To-Do List', 'Belajar cara membuat Webpage To-Do List.', '2026-09-14', 'pending', 'personal', NULL),
('Mengerjakan Pre-Praktikum Jarkom', 'Tugas modul 1 Jarkom bersama tim', '2026-09-20', 'pending', 'shared', NULL),
('Persiapan LBE RPL', 'Persiapan dan kerja kelompok LBE RPL', '2026-09-25', 'pending', 'shared', NULL);