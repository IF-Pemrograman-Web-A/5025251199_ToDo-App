const themeToggleBtn = document.getElementById("theme-toggle");

document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeToggleBtn) themeToggleBtn.textContent = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        if (themeToggleBtn) themeToggleBtn.textContent = "🌙 Dark Mode";
    }
    
    initIndexedDB();
    initServiceWorker();
    requestNotificationPermission();
});

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        themeToggleBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

let db = null;
let selectedTodoId = null;

const initialTodos = [
    { id: 1, title: "Menyelesaikan 4 css games", description: "Selesai mengerjakan CSS games", deadline: "2026-09-10", completed: true, image: "", notifyTime: "" },
    { id: 2, title: "Membuat Webpage To-Do List", description: "Belajar cara membuat Webpage To-Do List.", deadline: "2026-09-14", completed: false, image: "", notifyTime: "" },
    { id: 3, title: "Mengerjakan Pre-Praktikum Jarkom", description: "Tugas modul 1 Jarkom", deadline: "2026-09-20", completed: false, image: "", notifyTime: "" },
    { id: 4, title: "LBE RPL", description: "Persiapan LBE RPL", deadline: "2026-09-25", completed: false, image: "", notifyTime: "" }
];

const taskListEl = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");

const detailTitle = document.getElementById("detail-title");
const detailStatus = document.getElementById("detail-status");
const detailDeadline = document.getElementById("detail-deadline");
const detailDesc = document.getElementById("detail-desc");
const detailImage = document.getElementById("detail-image");
const noImageText = document.getElementById("no-image-text");

function initIndexedDB() {
    const request = indexedDB.open("TodoDB", 1);

    request.onupgradeneeded = (e) => {
        db = e.target.result;
        if (!db.objectStoreNames.contains("todos")) {
            const store = db.createObjectStore("todos", { keyPath: "id" });
            initialTodos.forEach(todo => store.add(todo));
        }
    };

    request.onsuccess = (e) => {
        db = e.target.result;
        getAllTodosFromDB();
    };

    request.onerror = (e) => {
        console.error("IndexedDB Error:", e.target.error);
    };
}

function getAllTodosFromDB() {
    if (!db) return;
    const tx = db.transaction("todos", "readonly");
    const store = tx.objectStore("todos");
    const request = store.getAll();

    request.onsuccess = () => {
        const todos = request.result;
        renderTodos(todos);
        checkNotifications(todos);
    };
}

function saveTodoToDB(todo) {
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    store.put(todo);

    tx.oncomplete = () => {
        getAllTodosFromDB();
    };
}

function deleteTodoFromDB(id) {
    const tx = db.transaction("todos", "readwrite");
    const store = tx.objectStore("todos");
    store.delete(id);

    tx.oncomplete = () => {
        getAllTodosFromDB();
    };
}

let currentBase64Image = "";
let mediaStream = null;

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
            console.error("Camera Error:", err);
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

        currentBase64Image = webcamCanvas.toDataURL("image/jpeg");
        if (imagePreview) imagePreview.src = currentBase64Image;
        if (imagePreviewContainer) imagePreviewContainer.style.display = "block";

        stopCameraStream();
    });
}

function stopCameraStream() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    if (cameraContainer) cameraContainer.style.display = "none";
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
                currentBase64Image = event.target.result;
                if (imagePreview) imagePreview.src = currentBase64Image;
                if (imagePreviewContainer) imagePreviewContainer.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
}

function initServiceWorker() {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("sw.js")
            .then(reg => console.log("Service Worker registered:", reg.scope))
            .catch(err => console.error("Service Worker registration failed:", err));
    }
}

function requestNotificationPermission() {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

function checkNotifications(todos) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    const now = new Date();

    todos.forEach(todo => {
        if (!todo.completed && todo.notifyTime && !todo.notified) {
            const notifyDate = new Date(todo.notifyTime);
            if (now >= notifyDate) {
                if (navigator.serviceWorker && navigator.serviceWorker.controller) {
                    navigator.serviceWorker.ready.then(registration => {
                        registration.showNotification(`Reminder: ${todo.title}`, {
                            body: todo.description || "Time to finish this task!",
                            icon: todo.image || undefined,
                            tag: `todo-notify-${todo.id}`
                        });
                    });
                } else {
                    new Notification(`Reminder: ${todo.title}`, {
                        body: todo.description || "Time to finish this task!",
                        icon: todo.image || undefined
                    });
                }

                todo.notified = true;
                saveTodoToDB(todo);
            }
        }
    });
}

setInterval(() => {
    if (db) getAllTodosFromDB();
}, 10000);

function renderTodos(todos) {
    taskListEl.innerHTML = "";

    if (!selectedTodoId && todos.length > 0) {
        selectedTodoId = todos[0].id;
    }

    todos.forEach(todo => {
        const li = document.createElement("li");
        li.className = "task-item-container";
        
        li.innerHTML = `
            <label class="task-item">
                <input type="checkbox" ${todo.completed ? "checked" : ""} data-id="${todo.id}" class="todo-checkbox">
                <span class="custom-checkbox"></span>
                <span class="task-text ${todo.completed ? "completed-text" : ""}" data-id="${todo.id}">${todo.title}</span>
            </label>
            <div class="task-actions">
                <button class="btn-act btn-edit" data-id="${todo.id}">Edit</button>
                <button class="btn-act btn-delete" data-id="${todo.id}">Delete</button>
            </div>
        `;

        taskListEl.appendChild(li);
    });

    renderDetail(todos);
}

function renderDetail(todos) {
    const todo = todos.find(t => t.id === selectedTodoId) || todos[0];
    if (!todo) {
        detailTitle.textContent = "-";
        detailStatus.textContent = "-";
        detailStatus.className = "status-badge";
        detailDeadline.textContent = "-";
        detailDesc.textContent = "-";
        if (detailImage) detailImage.style.display = "none";
        if (noImageText) noImageText.style.display = "block";
        selectedTodoId = null;
        return;
    }

    selectedTodoId = todo.id;
    detailTitle.textContent = todo.title;
    detailStatus.textContent = todo.completed ? "Completed" : "On Progress";
    detailStatus.className = `status-badge ${todo.completed ? "status-completed" : "on-progress"}`;
    detailDeadline.textContent = todo.deadline || "-";
    detailDesc.textContent = todo.description || "-";

    if (todo.image && detailImage && noImageText) {
        detailImage.src = todo.image;
        detailImage.style.display = "block";
        noImageText.style.display = "none";
    } else if (detailImage && noImageText) {
        detailImage.style.display = "none";
        noImageText.style.display = "block";
    }
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const idInput = document.getElementById("task-id").value;
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const deadline = document.getElementById("task-deadline").value;
    const notifyTime = document.getElementById("task-notify-time").value;

    if (idInput) {
        const id = parseInt(idInput);
        const tx = db.transaction("todos", "readonly");
        const store = tx.objectStore("todos");
        const request = store.get(id);

        request.onsuccess = () => {
            const todo = request.result;
            if (todo) {
                todo.title = title;
                todo.description = description;
                todo.deadline = deadline;
                todo.notifyTime = notifyTime;
                if (currentBase64Image) todo.image = currentBase64Image;
                todo.notified = false;
                saveTodoToDB(todo);
            }
        };

        document.getElementById("task-id").value = "";
        document.getElementById("form-title").textContent = "Add Task";
    } else {
        const newTodo = {
            id: Date.now(),
            title,
            description,
            deadline,
            notifyTime,
            image: currentBase64Image,
            completed: false,
            notified: false
        };
        selectedTodoId = newTodo.id;
        saveTodoToDB(newTodo);
    }

    stopCameraStream();
    currentBase64Image = "";
    if (imagePreviewContainer) imagePreviewContainer.style.display = "none";
    taskForm.reset();
});

taskListEl.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);
    if (!id) return;

    if (e.target.classList.contains("todo-checkbox")) {
        const tx = db.transaction("todos", "readonly");
        const store = tx.objectStore("todos");
        const request = store.get(id);

        request.onsuccess = () => {
            const todo = request.result;
            if (todo) {
                todo.completed = e.target.checked;
                saveTodoToDB(todo);
            }
        };
    }

    if (e.target.classList.contains("task-text")) {
        selectedTodoId = id;
        getAllTodosFromDB();
    }

    if (e.target.classList.contains("btn-edit")) {
        const tx = db.transaction("todos", "readonly");
        const store = tx.objectStore("todos");
        const request = store.get(id);

        request.onsuccess = () => {
            const todo = request.result;
            if (todo) {
                document.getElementById("task-id").value = todo.id;
                document.getElementById("task-title").value = todo.title;
                document.getElementById("task-desc").value = todo.description;
                document.getElementById("task-deadline").value = todo.deadline;
                if (document.getElementById("task-notify-time")) {
                    document.getElementById("task-notify-time").value = todo.notifyTime || "";
                }
                document.getElementById("form-title").textContent = "Edit Task";
            }
        };
    }

    if (e.target.classList.contains("btn-delete")) {
        deleteTodoFromDB(id);
    }
});