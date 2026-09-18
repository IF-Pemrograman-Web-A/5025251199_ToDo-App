
let todos = [
    { id: 1, title: "Menyelesaikan 4 css games", description: "Selesai mengerjakan CSS games", deadline: "2026-09-10", completed: true },
    { id: 2, title: "Membuat Webpage To-Do List", description: "Belajar cara membuat Webpage To-Do List.", deadline: "2026-09-14", completed: false },
    { id: 3, title: "Mengerjakan Pre-Praktikum Jarkom", description: "Tugas modul 1 Jarkom", deadline: "2026-09-20", completed: false },
    { id: 4, title: "LBE RPL", description: "Persiapan LBE RPL", deadline: "2026-09-25", completed: false }
];

let selectedTodoId = 2;

const taskListEl = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");
const themeToggleBtn = document.getElementById("theme-toggle");

const detailTitle = document.getElementById("detail-title");
const detailStatus = document.getElementById("detail-status");
const detailDeadline = document.getElementById("detail-deadline");
const detailDesc = document.getElementById("detail-desc");

function renderTodos() {
    taskListEl.innerHTML = "";

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

    renderDetail();
}

function renderDetail() {
    const todo = todos.find(t => t.id === selectedTodoId) || todos[0];
    if (!todo) {
        detailTitle.textContent = "-";
        detailStatus.textContent = "-";
        detailStatus.className = "status-badge";
        detailDeadline.textContent = "-";
        detailDesc.textContent = "-";
        return;
    }

    selectedTodoId = todo.id;
    detailTitle.textContent = todo.title;
    detailStatus.textContent = todo.completed ? "Completed" : "On Progress";
    detailStatus.className = `status-badge ${todo.completed ? "status-completed" : "on-progress"}`;
    detailDeadline.textContent = todo.deadline || "-";
    detailDesc.textContent = todo.description || "-";
}

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const idInput = document.getElementById("task-id").value;
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const deadline = document.getElementById("task-deadline").value;

    if (idInput) {
        const todo = todos.find(t => t.id === parseInt(idInput));
        if (todo) {
            todo.title = title;
            todo.description = description;
            todo.deadline = deadline;
        }
        document.getElementById("task-id").value = "";
        document.getElementById("form-title").textContent = "Add Task";
    } else {
        const newTodo = {
            id: Date.now(),
            title,
            description,
            deadline,
            completed: false
        };
        todos.push(newTodo);
        selectedTodoId = newTodo.id;
    }

    taskForm.reset();
    renderTodos();
});

taskListEl.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);

    if (e.target.classList.contains("todo-checkbox")) {
        const todo = todos.find(t => t.id === id);
        if (todo) todo.completed = e.target.checked;
        renderTodos();
    }

    if (e.target.classList.contains("task-text")) {
        selectedTodoId = id;
        renderDetail();
    }

    if (e.target.classList.contains("btn-edit")) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            document.getElementById("task-id").value = todo.id;
            document.getElementById("task-title").value = todo.title;
            document.getElementById("task-desc").value = todo.description;
            document.getElementById("task-deadline").value = todo.deadline;
            document.getElementById("form-title").textContent = "Edit Task";
        }
    }

    if (e.target.classList.contains("btn-delete")) {
        todos = todos.filter(t => t.id !== id);
        renderTodos();
    }
});

themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggleBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});

renderTodos();