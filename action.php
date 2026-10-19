<?php
include 'config.php';

$action = $_GET['action'] ?? '';

if ($action === 'save' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? '';
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $deadline = $_POST['deadline'] ? $_POST['deadline'] : NULL;
    $type = $_POST['type'] ?? 'personal';
    $image_path = $_POST['existing_image'] ?? NULL;

    $target_dir = "uploads/";
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $file_extension = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
        $new_filename = time() . '_' . uniqid() . '.' . $file_extension;
        $target_file = $target_dir . $new_filename;

        if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) {
            if ($image_path && file_exists($image_path)) {
                unlink($image_path);
            }
            $image_path = $target_file;
        }
    } 
    elseif (!empty($_POST['camera_base64'])) {
        $base64_data = $_POST['camera_base64'];
        list($type_str, $data) = explode(';', $base64_data);
        list(, $data) = explode(',', $data);
        $decoded_data = base64_decode($data);

        $new_filename = time() . '_' . uniqid() . '.jpg';
        $target_file = $target_dir . $new_filename;

        if (file_put_contents($target_file, $decoded_data)) {
            if ($image_path && file_exists($image_path)) {
                unlink($image_path);
            }
            $image_path = $target_file;
        }
    }

    if (!empty($id)) {
        $stmt = $conn->prepare("UPDATE todos SET title=?, description=?, deadline=?, type=?, image_path=? WHERE id=?");
        $stmt->bind_param("sssssi", $title, $description, $deadline, $type, $image_path, $id);
        $stmt->execute();
    } else {
        $stmt = $conn->prepare("INSERT INTO todos (title, description, deadline, type, image_path) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $title, $description, $deadline, $type, $image_path);
        $stmt->execute();
    }

    header("Location: " . ($type === 'shared' ? 'shared.php' : 'index.php'));
    exit;
}

if ($action === 'toggle' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $type = $_GET['type'] ?? 'personal';

    $stmt = $conn->prepare("UPDATE todos SET status = IF(status='completed', 'pending', 'completed') WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();

    header("Location: " . ($type === 'shared' ? 'shared.php' : 'index.php'));
    exit;
}

if ($action === 'delete' && isset($_GET['id'])) {
    $id = (int)$_GET['id'];
    $type = $_GET['type'] ?? 'personal';

    $stmt = $conn->prepare("SELECT image_path FROM todos WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($row = $res->fetch_assoc()) {
        if ($row['image_path'] && file_exists($row['image_path'])) {
            unlink($row['image_path']);
        }
    }

    $stmt_del = $conn->prepare("DELETE FROM todos WHERE id=?");
    $stmt_del->bind_param("i", $id);
    $stmt_del->execute();

    header("Location: " . ($type === 'shared' ? 'shared.php' : 'index.php'));
    exit;
}
?>