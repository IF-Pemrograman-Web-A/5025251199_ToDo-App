const themeToggleBtn = document.getElementById("theme-toggle");
let mediaStream = null;

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
});

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
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
                alert("Gagal membuka kamera: " + err.message);
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
    document.getElementById("task-desc").value = todo.description || '';
    document.getElementById("task-deadline").value = todo.deadline || '';
    document.getElementById("existing-image").value = todo.image_path || '';

    document.getElementById("form-title").textContent = "Edit Task";
    document.getElementById("btn-submit").textContent = "Update Task";
    document.getElementById("btn-cancel").style.display = "block";

    document.getElementById("task-form").scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    stopCameraStream();
    document.getElementById("task-id").value = "";
    document.getElementById("existing-image").value = "";
    const cameraBase64Input = document.getElementById("camera-base64");
    if (cameraBase64Input) cameraBase64Input.value = "";
    const imagePreviewContainer = document.getElementById("image-preview-container");
    if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
    document.getElementById("task-form").reset();
    document.getElementById("form-title").textContent = "Add Task";
    document.getElementById("btn-submit").textContent = "Save Task";
    document.getElementById("btn-cancel").style.display = "none";
}