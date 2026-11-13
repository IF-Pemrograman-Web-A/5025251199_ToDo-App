const API_URL = "api/todos.php";
const themeToggleBtn = document.getElementById("theme-toggle");
let mediaStream = null;
let currentTodos = [];

function getCurrentPageType() {
    const typeInput = document.getElementById("task-type");
    if (typeInput && typeInput.value) return typeInput.value;
    return window.location.pathname.includes("shared.php") ? "shared" : "personal";
}

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggleBtn) themeToggleBtn.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        if (themeToggleBtn) themeToggleBtn.textContent = "🌙 Dark Mode";
    }

    initCameraEvents();
    initApiFormHandler();
    loadTasks();
});

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

async function loadTasks(selectedId = null) {
    const type = getCurrentPageType();
    try {
        const response = await fetch(`${API_URL}?type=${type}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || `HTTP Error ${response.status}`);
        }

        currentTodos = result.data || [];
        renderTaskList(currentTodos);

        if (currentTodos.length > 0) {
            const target = selectedId 
                ? currentTodos.find(t => t.id == selectedId) || currentTodos[0]
                : currentTodos[0];
            showTaskDetail(target);
        } else {
            clearTaskDetail();
        }
    } catch (error) {
        console.error("Gagal memuat tasks (GET):", error.message);
        const listEl = document.getElementById("task-list");
        if (listEl) listEl.innerHTML = `<p style="color: #ef4444; font-size: 0.9rem;">Failed to load data from API.</p>`;
    }
}

function renderTaskList(todos) {
    const listContainer = document.getElementById("task-list");
    if (!listContainer) return;

    if (todos.length === 0) {
        listContainer.innerHTML = `<p style="color: #888; font-size: 0.9rem;">No tasks available in this category yet.</p>`;
        return;
    }

    listContainer.innerHTML = todos.map(todo => {
        const isCompleted = todo.status === "completed";
        return `
            <li class="task-item-container" data-id="${todo.id}">
                <div class="task-item" style="display: flex; align-items: center; gap: 10px; flex: 1;">
                    <label style="cursor: pointer; display: inline-flex; align-items: center;">
                        <input type="checkbox" 
                                ${isCompleted ? "checked" : ""} 
                                onchange="toggleTaskStatus(${todo.id}, '${todo.status}')">
                        <span class="custom-checkbox"></span>
                    </label>
                    <span class="task-text ${isCompleted ? 'completed-text' : ''}" 
                            onclick="selectTaskById(${todo.id})"
                            style="cursor: pointer; display: block; user-select: none; flex: 1;">
                        ${escapeHtml(todo.title)}
                    </span>
                </div>
                <div class="task-actions">
                    <button type="button" class="btn-act btn-edit" onclick="editTaskById(${todo.id})">Edit</button>
                    <button type="button" class="btn-act btn-delete" onclick="deleteTask(${todo.id})">Delete</button>
                </div>
            </li>
        `;
    }).join("");
}

function initApiFormHandler() {
    const taskForm = document.getElementById("task-form");
    if (!taskForm) return;

    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const taskId = document.getElementById("task-id").value;
        const payload = {
            title: document.getElementById("task-title").value.trim(),
            description: document.getElementById("task-desc").value.trim(),
            deadline: document.getElementById("task-deadline").value || null,
            type: getCurrentPageType()
        };

        const isEditMode = Boolean(taskId);
        const url = isEditMode ? `${API_URL}?id=${taskId}` : API_URL;
        const method = isEditMode ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.status === 201 || response.status === 200) {
                const focusId = isEditMode ? taskId : (result.data ? result.data.id : null);
                resetForm();
                await loadTasks(focusId);
            } else {
                alert(`Error (${response.status}): ${result.message}`);
            }
        } catch (error) {
            console.error(`Gagal menyimpan data (${method}):`, error);
            alert("Network error occurred while connecting to the API.");
        }
    });
}

async function toggleTaskStatus(id, currentStatus) {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";

    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus })
        });

        const result = await response.json();

        if (response.ok) {
            await loadTasks(id);
        } else {
            alert(`Failed to update status (${response.status}): ${result.message}`);
        }
    } catch (error) {
        console.error("Failed to update status (PATCH):", error);
    }
}

async function deleteTask(id) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (response.ok) {
            if (document.getElementById("task-id").value == id) {
                resetForm();
            }
            await loadTasks();
        } else {
            alert(`Failed to delete task (${response.status}): ${result.message}`);
        }
    } catch (error) {
        console.error("Failed to delete task (DELETE):", error);
    }
}

function selectTaskById(id) {
    const todo = currentTodos.find(item => item.id == id);
    if (todo) showTaskDetail(todo);
}

function editTaskById(id) {
    const todo = currentTodos.find(item => item.id == id);
    if (todo) editTask(todo);
}

function showTaskDetail(todo) {
    const detailTitle = document.getElementById("detail-title");
    const detailStatus = document.getElementById("detail-status");
    const detailDeadline = document.getElementById("detail-deadline");
    const detailDesc = document.getElementById("detail-desc");
    const imageWrapper = document.getElementById("detail-image-wrapper");

    if (detailTitle) detailTitle.textContent = todo.title;
    if (detailStatus) {
        const isCompleted = todo.status === "completed";
        detailStatus.textContent = isCompleted ? "Completed" : "On Progress";
        detailStatus.className = `status-badge ${isCompleted ? 'status-completed' : 'on-progress'}`;
    }
    if (detailDeadline) detailDeadline.textContent = todo.deadline || "-";
    if (detailDesc) detailDesc.textContent = todo.description || "-";

    if (imageWrapper) {
        if (todo.image_path) {
            imageWrapper.innerHTML = `<img id="detail-image" src="${escapeHtml(todo.image_path)}" alt="Todo Image" style="max-width: 100%; max-height: 200px; border-radius: 8px;" />`;
        } else {
            imageWrapper.innerHTML = `<p id="no-image-text" style="color: #888; font-size: 0.9rem;">No Image Available</p>`;
        }
    }
}

function clearTaskDetail() {
    if (document.getElementById("detail-title")) document.getElementById("detail-title").textContent = "-";
    const detailStatus = document.getElementById("detail-status");
    if (detailStatus) {
        detailStatus.textContent = "-";
        detailStatus.className = "status-badge on-progress";
    }
    if (document.getElementById("detail-deadline")) document.getElementById("detail-deadline").textContent = "-";
    if (document.getElementById("detail-desc")) document.getElementById("detail-desc").textContent = "-";
    const imageWrapper = document.getElementById("detail-image-wrapper");
    if (imageWrapper) {
        imageWrapper.innerHTML = `<p id="no-image-text" style="color: #888; font-size: 0.9rem;">No Image Available</p>`;
    }
}

function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function initCameraEvents() {
    const taskImageInput = document.getElementById("task-image");
    const btnUploadFile = document.getElementById("btn-upload-file");
    const btnStartCamera = document.getElementById("btn-start-camera");
    const btnStopCamera = document.getElementById("btn-stop-camera");
    const btnCapture = document.getElementById("btn-capture");
    const cameraContainer = document.getElementById("camera-container");
    const webcamVideo = document.getElementById("webcam-video");
    const webcamCanvas = document.getElementById("webcam-canvas");
    const imagePreviewContainer = document.getElementById("image-preview-container");
    const imagePreview = document.getElementById("image-preview");
    const cameraBase64Input = document.getElementById("camera-base64");

    if (btnUploadFile && taskImageInput) {
        btnUploadFile.addEventListener("click", () => {
            stopCameraStream();
            taskImageInput.click();
        });
    }

    if (btnStartCamera) {
        btnStartCamera.addEventListener("click", async () => {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "environment" }, 
                    audio: false 
                });
                webcamVideo.srcObject = mediaStream;
                cameraContainer.style.display = "block";
            } catch (err) {
                alert("Failed to access camera: " + err.message);
            }
        });
    }

    if (btnCapture) {
        btnCapture.addEventListener("click", () => {
            if (!mediaStream) return;

            const context = webcamCanvas.getContext("2d");
            webcamCanvas.width = webcamVideo.videoWidth;
            webcamCanvas.height = webcamVideo.videoHeight;
            context.drawImage(webcamVideo, 0, 0, webcamCanvas.width, webcamCanvas.height);

            const base64Data = webcamCanvas.toDataURL("image/jpeg");
            if (cameraBase64Input) cameraBase64Input.value = base64Data;
            if (imagePreview) imagePreview.src = base64Data;
            if (imagePreviewContainer) imagePreviewContainer.style.display = "block";

            stopCameraStream();
        });
    }

    if (btnStopCamera) {
        btnStopCamera.addEventListener("click", stopCameraStream);
    }

    if (taskImageInput) {
        taskImageInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (imagePreview) imagePreview.src = event.target.result;
                    if (imagePreviewContainer) imagePreviewContainer.style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js");
    });
}

function stopCameraStream() {
    const cameraContainer = document.getElementById("camera-container");
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    if (cameraContainer) cameraContainer.style.display = "none";
}

function editTask(todo) {
    if (!todo) return;

    document.getElementById("task-id").value = todo.id;
    document.getElementById("task-title").value = todo.title;
    document.getElementById("task-desc").value = todo.description || "";
    document.getElementById("task-deadline").value = todo.deadline || "";
    document.getElementById("existing-image").value = todo.image_path || "";

    document.getElementById("form-title").textContent = "Edit Task";
    document.getElementById("btn-submit").textContent = "Update Task";
    document.getElementById("btn-cancel").style.display = "block";

    document.getElementById("task-form").scrollIntoView({ behavior: "smooth" });
}

function resetForm() {
    stopCameraStream();
    const pageType = getCurrentPageType();
    const capitalizedType = pageType.charAt(0).toUpperCase() + pageType.slice(1);

    document.getElementById("task-id").value = "";
    document.getElementById("existing-image").value = "";
    const cameraBase64Input = document.getElementById("camera-base64");
    if (cameraBase64Input) cameraBase64Input.value = "";
    const imagePreviewContainer = document.getElementById("image-preview-container");
    if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
    document.getElementById("task-form").reset();
    document.getElementById("form-title").textContent = `Add ${capitalizedType} Task`;
    document.getElementById("btn-submit").textContent = "Save Task";
    document.getElementById("btn-cancel").style.display = "none";
}