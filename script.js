const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const clearCompleted = document.getElementById("clearCompleted");
const errorMessage = document.getElementById("errorMessage");

const themeToggle = document.getElementById("themeToggle");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

/* -----------------------------
   SAVE TASKS
----------------------------- */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* -----------------------------
   ESCAPE HTML
----------------------------- */

function escapeHtml(text) {
    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

/* -----------------------------
   DISPLAY TASKS
----------------------------- */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    emptyState.style.display =
        filteredTasks.length === 0
            ? "block"
            : "none";

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.innerHTML = `
            <div class="task-left">

                <input
                    class="task-checkbox"
                    type="checkbox"
                    data-id="${task.id}"
                    ${task.completed ? "checked" : ""}
                >

                <span class="task-text ${
                    task.completed ? "completed" : ""
                }">
                    ${escapeHtml(task.text)}
                </span>

            </div>

            <button
                class="delete-btn"
                data-id="${task.id}"
                type="button"
            >
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

/* -----------------------------
   UPDATE STATISTICS
----------------------------- */

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const active = total - completed;

    totalTasks.textContent = total;
    activeTasks.textContent = active;
    completedTasks.textContent = completed;
}

/* -----------------------------
   ADD TASK
----------------------------- */

function addTask(text) {

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();
}

/* -----------------------------
   TOGGLE TASK
----------------------------- */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();

    renderTasks();
}

/* -----------------------------
   DELETE TASK
----------------------------- */

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );

    saveTasks();

    renderTasks();
}

/* -----------------------------
   ADD TASK FORM
----------------------------- */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const text = taskInput.value.trim();

    if (text === "") {

        errorMessage.textContent =
            "Please enter a task.";

        return;
    }

    errorMessage.textContent = "";

    addTask(text);

    taskInput.value = "";

    taskInput.focus();
});

/* -----------------------------
   CLICK TASK ACTIONS
----------------------------- */

taskList.addEventListener("click", function(event) {

    const target = event.target;

    const id = Number(target.dataset.id);

    if (!id) {
        return;
    }

    if (target.classList.contains("delete-btn")) {
        deleteTask(id);
    }
});

/* -----------------------------
   CHECKBOX ACTIONS
----------------------------- */

taskList.addEventListener("change", function(event) {

    const target = event.target;

    if (!target.classList.contains("task-checkbox")) {
        return;
    }

    const id = Number(target.dataset.id);

    toggleTask(id);
});

/* -----------------------------
   FILTERS
----------------------------- */

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

/* -----------------------------
   CLEAR COMPLETED
----------------------------- */

clearCompleted.addEventListener("click", function() {

    tasks = tasks.filter(
        task => !task.completed
    );

    saveTasks();

    renderTasks();
});

/* -----------------------------
   DARK MODE
----------------------------- */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️";

    } else {

        themeToggle.textContent = "🌙";
    }
}

themeToggle.addEventListener("click", function() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

    themeToggle.textContent =
        isDark ? "☀️" : "🌙";
});
// Correct Express.js redirection
res.redirect('https://github.com/zeng-bitman');


/* -----------------------------
   START APP
----------------------------- */

loadTheme();

renderTasks();