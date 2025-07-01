const taskName = document.getElementById('task-name');
const taskList = document.getElementById('task-list');
const taskPriority = document.getElementById("task-priority");
const addTaskBtn = document.getElementById('add-task-btn');

let tasks = [];

addTaskBtn.addEventListener('click', addTask);

function addTask() {
  const taskText = taskName.value.trim();
  const taskPriority = taskPriority.value;

  if (taskText !== "") {
    const task = {
      name: taskText,
      priority: taskPriority,
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

function renderTaskList() {
    Document.getElementById("todo-list").innerHTML = "";
    Document.getElementById("inprogress-list").innerHTML = "";
    Document.getElementById("inreview-list").innerHTML = "";
    Document.getElementById("done-list").innerHTML = "";

    tasks.forEach((task, index) => {
        const li = document.createElement("li");

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

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTaskList();
    }
}

loadTasks();
saveTasks();
