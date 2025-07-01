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
