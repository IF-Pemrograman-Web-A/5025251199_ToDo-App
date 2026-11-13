<main class="content-section">
    <section class="section-card" aria-label="Daftar Tugas">
        <h2 class="section-title"><?php echo ucfirst($page_type); ?> Task List</h2>
        <ul id="task-list" class="task-list">
            <p style="color: #888; font-size: 0.9rem;">Loading tasks...</p>
        </ul>
    </section>

    <section class="section-card task-detail" aria-label="Detail Tugas">
        <h2 class="section-title">Task Detail</h2>
        <div class="detail-container">
            <p><strong>Title:</strong> <span id="detail-title">-</span></p>
            <p><strong>Status:</strong> 
                <span id="detail-status" class="status-badge on-progress">-</span>
            </p>
            <p><strong>Deadline:</strong> <span id="detail-deadline">-</span></p>
            <div class="description-group">
                <strong>Description:</strong>
                <p id="detail-desc" class="description-text">-</p>
            </div>
            
            <div class="description-group" style="margin-top: 12px;">
                <strong>Image Attachment:</strong>
                <div id="detail-image-wrapper" style="margin-top: 6px;">
                    <p id="no-image-text" style="color: #888; font-size: 0.9rem;">No Image Available</p>
                </div>
            </div>
        </div>
    </section>

    <section class="section-card add-task" aria-label="Form Tambah Tugas">
        <h2 id="form-title" class="section-title">Add <?php echo ucfirst($page_type); ?> Task</h2>
        <form id="task-form">
            <input type="hidden" name="id" id="task-id">
            <input type="hidden" name="type" id="task-type" value="<?php echo $page_type; ?>">
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