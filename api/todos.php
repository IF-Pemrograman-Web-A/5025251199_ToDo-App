<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config.php';

function sendResponse($statusCode, $status, $message, $data = null) {
    http_response_code($statusCode);
    echo json_encode([
        "status" => $status,
        "message" => $message,
        "data" => $data
    ]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        if ($id) {
            $stmt = $conn->prepare("SELECT * FROM todos WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 0) {
                sendResponse(404, "error", "Task with ID $id not found.");
            }
            sendResponse(200, "success", "Task detail retrieved.", $result->fetch_assoc());
        } else {
            $type = isset($_GET['type']) ? $_GET['type'] : null;
            if ($type) {
                $stmt = $conn->prepare("SELECT * FROM todos WHERE type = ? ORDER BY created_at DESC");
                $stmt->bind_param("s", $type);
            } else {
                $stmt = $conn->prepare("SELECT * FROM todos ORDER BY created_at DESC");
            }
            
            $stmt->execute();
            $result = $stmt->get_result();
            $todos = [];
            while ($row = $result->fetch_assoc()) {
                $todos[] = $row;
            }
            sendResponse(200, "success", "Tasks retrieved successfully.", $todos);
        }
        break;

    case 'POST':
        if (!$input || empty(trim($input['title'] ?? ''))) {
            sendResponse(400, "error", "Bad Request: 'title' field is required.");
        }

        $title = trim($input['title']);
        $description = trim($input['description'] ?? '');
        $deadline = !empty($input['deadline']) ? $input['deadline'] : null;
        $type = in_array($input['type'] ?? '', ['personal', 'shared']) ? $input['type'] : 'personal';

        $stmt = $conn->prepare("INSERT INTO todos (title, description, deadline, type) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $title, $description, $deadline, $type);

        if ($stmt->execute()) {
            $newId = $stmt->insert_id;
            $newData = [
                "id" => $newId,
                "title" => $title,
                "description" => $description,
                "deadline" => $deadline,
                "status" => "pending",
                "type" => $type
            ];
            sendResponse(201, "success", "Task created successfully.", $newData);
        } else {
            sendResponse(500, "error", "Internal Server Error: Failed to create task.");
        }
        break;

    case 'PUT':
    case 'PATCH':
        if (!$id) {
            sendResponse(400, "error", "Bad Request: Task 'id' parameter in URL is required.");
        }

        $check = $conn->prepare("SELECT * FROM todos WHERE id = ?");
        $check->bind_param("i", $id);
        $check->execute();
        $existing = $check->get_result()->fetch_assoc();

        if (!$existing) {
            sendResponse(404, "error", "Not Found: Task with ID $id does not exist.");
        }

        if ($method === 'PATCH') {
            if (empty($input['status']) || !in_array($input['status'], ['pending', 'completed'])) {
                sendResponse(400, "error", "Bad Request: Valid 'status' ('pending' or 'completed') is required.");
            }
            $status = $input['status'];
            $stmt = $conn->prepare("UPDATE todos SET status = ? WHERE id = ?");
            $stmt->bind_param("si", $status, $id);
        } else {
            if (empty(trim($input['title'] ?? ''))) {
                sendResponse(400, "error", "Bad Request: 'title' is required for full update.");
            }
            $title = trim($input['title']);
            $description = trim($input['description'] ?? $existing['description']);
            $deadline = !empty($input['deadline']) ? $input['deadline'] : $existing['deadline'];
            $status = in_array($input['status'] ?? '', ['pending', 'completed']) ? $input['status'] : $existing['status'];

            $stmt = $conn->prepare("UPDATE todos SET title = ?, description = ?, deadline = ?, status = ? WHERE id = ?");
            $stmt->bind_param("ssssi", $title, $description, $deadline, $status, $id);
        }

        if ($stmt->execute()) {
            sendResponse(200, "success", "Task updated successfully.", ["id" => $id]);
        } else {
            sendResponse(500, "error", "Internal Server Error: Failed to update task.");
        }
        break;

    case 'DELETE':
        if (!$id) {
            sendResponse(400, "error", "Bad Request: Task 'id' parameter in URL is required.");
        }

        $check = $conn->prepare("SELECT id FROM todos WHERE id = ?");
        $check->bind_param("i", $id);
        $check->execute();
        if ($check->get_result()->num_rows === 0) {
            sendResponse(404, "error", "Not Found: Task with ID $id does not exist.");
        }

        $stmt = $conn->prepare("DELETE FROM todos WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            sendResponse(200, "success", "Task deleted successfully.", ["deleted_id" => $id]);
        } else {
            sendResponse(500, "error", "Internal Server Error: Failed to delete task.");
        }
        break;

    default:
        sendResponse(405, "error", "Method Not Allowed.");
        break;
}
?>