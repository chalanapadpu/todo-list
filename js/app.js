// ==========================================
// TO-DO LIST APPLICATION
// ==========================================


// ---------- DOM ELEMENTS ----------

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const taskCount = document.getElementById("taskCount");
const clearCompletedBtn = document.getElementById("clearCompleted");

const filterButtons = document.querySelectorAll(".filter-btn");


// ---------- APPLICATION STATE ----------

// Load tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current filter
let currentFilter = "all";


// ==========================================
// LOCAL STORAGE
// ==========================================

// Save tasks to LocalStorage
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ==========================================
// CREATE TASK
// ==========================================

function addTask() {

    const text = taskInput.value.trim();

    // Prevent empty tasks
    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    // Add task to state
    tasks.push(newTask);


    // Save state
    saveTasks();


    // Clear input
    taskInput.value = "";


    // Update interface
    renderTasks();


    // Put cursor back in input
    taskInput.focus();

}


// ==========================================
// READ / DISPLAY TASKS
// ==========================================

function renderTasks() {

    // Clear existing DOM elements
    taskList.innerHTML = "";


    // Filter tasks
    const filteredTasks = tasks.filter(task => {

        if (currentFilter === "active") {

            return !task.completed;

        }

        if (currentFilter === "completed") {

            return task.completed;

        }

        return true;

    });


    // Show empty message
    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // Create task elements
    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task-item";

        li.dataset.id = task.id;


        // Add completed class
        if (task.completed) {

            li.classList.add("completed");

        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.className = "task-checkbox";

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );


        // Task text
        const span = document.createElement("span");

        span.className = "task-text";

        span.textContent = task.text;


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.className = "delete-btn";

        deleteButton.textContent = "Delete";

        deleteButton.setAttribute(
            "aria-label",
            `Delete ${task.text}`
        );


        // Add elements to list item
        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(deleteButton);


        // Add list item to DOM
        taskList.appendChild(li);

    });


    updateTaskCount();

}


// ==========================================
// UPDATE TASK
// ==========================================

function toggleTask(taskId) {

    tasks = tasks.map(task => {

        if (task.id === taskId) {

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


// ==========================================
// DELETE TASK
// ==========================================

function deleteTask(taskId) {

    tasks = tasks.filter(task => task.id !== taskId);


    saveTasks();

    renderTasks();

}


// ==========================================
// TASK COUNT
// ==========================================

function updateTaskCount() {

    const activeTasks = tasks.filter(
        task => !task.completed
    ).length;


    if (activeTasks === 1) {

        taskCount.textContent = "1 task remaining";

    } else {

        taskCount.textContent =
            `${activeTasks} tasks remaining`;

    }

}


// ==========================================
// CLEAR COMPLETED TASKS
// ==========================================

function clearCompleted() {

    tasks = tasks.filter(
        task => !task.completed
    );


    saveTasks();

    renderTasks();

}


// ==========================================
// EVENT DELEGATION
// ==========================================

// Instead of adding separate event listeners
// to every checkbox/delete button,
// we use one listener on the task container.

taskList.addEventListener("click", function (event) {

    const taskItem = event.target.closest(".task-item");


    if (!taskItem) {

        return;

    }


    const taskId = Number(taskItem.dataset.id);


    // Delete task
    if (event.target.classList.contains("delete-btn")) {

        deleteTask(taskId);

    }

});


// Checkbox change event
taskList.addEventListener("change", function (event) {

    if (!event.target.classList.contains("task-checkbox")) {

        return;

    }


    const taskItem = event.target.closest(".task-item");

    const taskId = Number(taskItem.dataset.id);


    toggleTask(taskId);

});


// ==========================================
// FILTERING
// ==========================================

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        // Remove active class from all buttons
        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        // Add active class to clicked button
        button.classList.add("active");


        // Change filter
        currentFilter = button.dataset.filter;


        // Render filtered tasks
        renderTasks();

    });

});


// ==========================================
// EVENT LISTENERS
// ==========================================

// Add task button
addTaskBtn.addEventListener("click", addTask);


// Press Enter to add task
taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// Clear completed button
clearCompletedBtn.addEventListener(
    "click",
    clearCompleted
);


// ==========================================
// INITIAL RENDER
// ==========================================

// Display saved tasks when page loads
renderTasks();
