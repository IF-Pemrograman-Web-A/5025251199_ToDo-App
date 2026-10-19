<?php
$stmt = $conn->prepare("SELECT * FROM todos WHERE type = ? ORDER BY id DESC");
$stmt->bind_param("s", $page_type);
$stmt->execute();
$result = $stmt->get_result();

$todos = [];
while ($row = $result->fetch_assoc()) {
    $todos[] = $row;
}

$selected_todo = null;
if (!empty($todos)) {
    if (isset($_GET['detail_id'])) {
        foreach ($todos as $t) {
            if ($t['id'] == $_GET['detail_id']) {
                $selected_todo = $t;
                break;
            }
        }
    }
    if (!$selected_todo) {
        $selected_todo = $todos[0];
    }
}
?>

<main class="content-section">
    <section class="section-card" aria-label="Daftar Tugas">
        <h2 class="section-title"><?php echo ucfirst($page_type); ?> Task List</h2>
        <ul id="task-list" class="task-list">
            <?php if (empty($todos)): ?>
                <p style="color: #888; font-size: 0.9rem;">Belum ada tugas di kategori ini.</p>
            <?php else: ?>
                <?php foreach ($todos as $todo): ?>
                    <li class="task-item-container" data-id="<?php echo $todo['id']; ?>">
                        <div class="task-item" style="display: flex; align-items: center; gap: 10px; flex: 1;">
                            <a href="action.php?action=toggle&id=<?php echo $todo['id']; ?>&type=<?php echo $page_type; ?>" 
                               style="display: inline-flex; align-items: center; text-decoration: none;">
                                <label style="cursor: pointer; display: inline-flex; align-items: center;">
                                    <input type="checkbox" <?php echo $todo['status'] === 'completed' ? 'checked' : ''; ?> 
                                           onclick="window.location.href=this.closest('a').href;">
                                    <span class="custom-checkbox"></span>
                                </label>
                            </a>
                            <a href="<?php echo $page_type === 'shared' ? 'shared.php' : 'index.php'; ?>?detail_id=<?php echo $todo['id']; ?>" 
                               style="text-decoration: none; color: inherit; flex: 1;">
                                <span class="task-text <?php echo $todo['status'] === 'completed' ? 'completed-text' : ''; ?>" 
                                      style="cursor: pointer; display: block; user-select: none;">
                                    <?php echo htmlspecialchars($todo['title']); ?>
                                </span>
                            </a>
                        </div>
                        <div class="task-actions">
                            <button type="button" class="btn-act btn-edit" onclick="editTask(<?php echo htmlspecialchars(json_encode($todo), ENT_QUOTES, 'UTF-8'); ?>)">Edit</button>
                            <a href="action.php?action=delete&id=<?php echo $todo['id']; ?>&type=<?php echo $page_type; ?>" 
                               class="btn-act btn-delete" 
                               onclick="return confirm('Apakah Anda yakin ingin menghapus tugas ini?')"
                               style="text-decoration: none; display: inline-block; line-height: normal;">Delete</a>
                        </div>
                    </li>
                <?php endforeach; ?>
            <?php endif; ?>
        </ul>
    </section>

    <section class="section-card task-detail" aria-label="Detail Tugas">
        <h2 class="section-title">Task Detail</h2>
        <div class="detail-container">
            <p><strong>Title:</strong> <span id="detail-title"><?php echo htmlspecialchars($selected_todo['title'] ?? '-'); ?></span></p>
            <p><strong>Status:</strong> 
                <span id="detail-status" class="status-badge <?php echo ($selected_todo && $selected_todo['status'] === 'completed') ? 'status-completed' : 'on-progress'; ?>">
                    <?php echo $selected_todo ? ($selected_todo['status'] === 'completed' ? 'Completed' : 'On Progress') : '-'; ?>
                </span>
            </p>
            <p><strong>Deadline:</strong> <span id="detail-deadline"><?php echo htmlspecialchars($selected_todo['deadline'] ?? '-'); ?></span></p>
            <div class="description-group">
                <strong>Description:</strong>
                <p id="detail-desc" class="description-text"><?php echo htmlspecialchars($selected_todo['description'] ?? '-'); ?></p>
            </div>
            
            <div class="description-group" style="margin-top: 12px;">
                <strong>Image Attachment:</strong>
                <div style="margin-top: 6px;">
                    <?php if (!empty($selected_todo['image_path'])): ?>
                        <img id="detail-image" src="<?php echo htmlspecialchars($selected_todo['image_path']); ?>" alt="Todo Image" style="max-width: 100%; max-height: 200px; border-radius: 8px;" />
                    <?php else: ?>
                        <p id="no-image-text" style="color: #888; font-size: 0.9rem;">No Image Available</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <section class="section-card add-task" aria-label="Form Tambah Tugas">
        <h2 id="form-title" class="section-title">Add <?php echo ucfirst($page_type); ?> Task</h2>
        <form id="task-form" action="action.php?action=save" method="POST" enctype="multipart/form-data">
            <input type="hidden" name="id" id="task-id">
            <input type="hidden" name="type" value="<?php echo $page_type; ?>">
            <input type="hidden" name="existing_image" id="existing-image">
            <input type="hidden" name="camera_base64" id="camera-base64">

            <div class="form-group">
                <label for="task-title">Title</label>
                <input type="text" name="title" id="task-title" placeholder="Enter Title" required>
            </div>
            
            <div class="form-group">
                <label for="task-desc">Description</label>
                <textarea name="description" id="task-desc" placeholder="Enter Description" rows="2"></textarea>
            </div>
            
            <div class="form-group">
                <label for="task-deadline">Deadline</label>
                <input type="date" name="deadline" id="task-deadline">
            </div>

            <div class="form-group">
                <label>To Do Image (Optional)</label>
                
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                    <input type="file" name="image" id="task-image" accept="image/*" style="display: none;">
                    <button type="button" id="btn-upload-file" class="btn-act">📷 Choose File</button>
                    <button type="button" id="btn-start-camera" class="btn-act">🎥 Open Camera</button>
                </div>

                <div id="camera-container" style="display: none; margin-bottom: 8px; text-align: center; background: #000; padding: 8px; border-radius: 8px;">
                    <video id="webcam-video" autoplay playsinline style="width: 100%; max-height: 200px; border-radius: 6px;"></video>
                    <div style="margin-top: 8px; display: flex; gap: 8px; justify-content: center;">
                        <button type="button" id="btn-capture" class="btn-act" style="background: #10b981; color: white;">📸 Take Photo</button>
                        <button type="button" id="btn-stop-camera" class="btn-act" style="background: #ef4444; color: white;">❌ Close</button>
                    </div>
                    <canvas id="webcam-canvas" style="display: none;"></canvas>
                </div>

                <div id="image-preview-container" style="margin-top: 8px; display: none;">
                    <p style="font-size: 0.8rem; color: #888; margin-bottom: 4px;">Photo Preview:</p>
                    <img id="image-preview" src="" alt="Preview Foto Todo" style="max-width: 120px; border-radius: 6px;">
                </div>
            </div>

            <button type="submit" id="btn-submit" class="btn-save">Save Task</button>
            <button type="button" id="btn-cancel" class="btn-act" style="background: #718096; margin-top: 6px; display: none;" onclick="resetForm()">Cancel Edit</button>
        </form>
    </section>
</main>