const taskName = document.getElementById('task-name');
const taskPriority = document.getElementById("task-priority");
const addTaskBtn = document.getElementById('add-task-btn');

let tasks = [];

addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskText = taskName.value.trim();
    const priority = taskPriority.value;


    if (taskText !== "") {
        const task = {
        name: taskText,
        priority: priority,
        status: "TO DO"
        };

        tasks.push(task);
        saveTasks();
        renderTasks();

        taskName.value = "";
        taskPriority.value = "LOW";
    } else {
        alert("Veuillez saisir un nom de tâche.");
    }
}

function renderTasks() {
    document.getElementById("todo-list").innerHTML = "";
    document.getElementById("inprogress-list").innerHTML = "";
    document.getElementById("inreview-list").innerHTML = "";
    document.getElementById("done-list").innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.style.borderColor = getprioritycolor(task.priority);
        li.innerHTML = `
            <div class="d-flex justify-content-center align-items-center">
              <div>
                <input type="checkbox" ${task.status === "DONE" ? "checked" : ""} data-index="${index}" class="complete-checkbox me-2">
                <span>${task.name}</span><br>
                <small class="text-muted">Priorité : ${task.priority}</small>
              </div>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary edit-btn" data-index="${index}">✏️</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">🗑</button>
              </div>
            </div>
      `
        const targetListId = getListId(task.status);
        document.getElementById(targetListId).appendChild(li);
    });
    const deletebtn = document.querySelectorAll(".delete-btn");
    deletebtn.forEach((button) => {
        button.addEventListener("click",()=> {
          const index = button.getAttribute("data-index");
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });
    });
    const modifybtn = document.querySelectorAll(".edit-btn");
    modifybtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        const newName = prompt("Modifier le nom de la tâche :", tasks[index].name);
        if (newName) {
          tasks[index].name = newName.trim();
          saveTasks();
          renderTasks();
        }
      });
    });
}

function getprioritycolor(priority) {
    switch (priority){
        case "HIGH": return "red";
        case "MEDIUM": return "orange";
        case "LOW": return "green";
        default: return "gray";
    }
}

function getListId(status) {
  switch (status) {
    case "TO DO": return "todo-list";
    case "IN PROGRESS": return "inprogress-list";
    case "IN REVIEW": return "inreview-list";
    case "DONE": return "done-list";
    default: return "todo-list";
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});