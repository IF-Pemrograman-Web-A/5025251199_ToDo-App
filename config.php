<?php
$host = "localhost";
$user = "root";
$pass = "admin808";
$dbname = "todo_db";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Koneksi Database Gagal: " . $conn->connect_error);
}
?>