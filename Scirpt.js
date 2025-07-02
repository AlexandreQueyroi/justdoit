const taskName = document.getElementById('task-name');
const taskPriority = document.getElementById("task-priority");
const addTaskBtn = document.getElementById('add-task-btn');

let tasks = [];
let trashedTasks = [];
const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");

const contextMenu = document.createElement('div');
contextMenu.className = 'priority-context-menu';
contextMenu.innerHTML = `
    <div class="priority-option" data-priority="HIGH">
        <span class="priority-dot high"></span>
        Haute priorité
    </div>
    <div class="priority-option" data-priority="MEDIUM">
        <span class="priority-dot medium"></span>
        Priorité moyenne
    </div>
    <div class="priority-option" data-priority="LOW">
        <span class="priority-dot low"></span>
        Basse priorité
    </div>
`;
document.body.appendChild(contextMenu);

document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
});

statusFilter.addEventListener("change", renderTasks);
priorityFilter.addEventListener("change", renderTasks);
addTaskBtn.addEventListener('click', addTask);

document.querySelector('.fa-trash-alt').parentElement.addEventListener('click', toggleTrash);

function initDragAndDrop() {
    const lists = document.querySelectorAll('#todo-list, #inprogress-list, #inreview-list, #done-list');
    
    lists.forEach(list => {
        list.addEventListener('dragover', e => {
            e.preventDefault();
            list.classList.add('dragover');
        });

        list.addEventListener('dragleave', () => {
            list.classList.remove('dragover');
        });

        list.addEventListener('drop', e => {
            e.preventDefault();
            list.classList.remove('dragover');
            const draggedItem = document.querySelector('.dragging');
            if (draggedItem) {
                list.appendChild(draggedItem);
                
                const taskIndex = draggedItem.getAttribute('data-index');
                const newStatus = getStatusFromList(list.id);
                if (taskIndex !== null && tasks[taskIndex]) {
                    tasks[taskIndex].status = newStatus;
                    saveTasks();
                }
            }
        });
    });
}

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
    document.getElementById("trash-list").innerHTML = "";

    const selectedStatus = statusFilter ? statusFilter.value : "ALL";
    const selectedPriority = priorityFilter ? priorityFilter.value : "ALL";

    tasks.forEach((task, index) => {
        const matchesStatus = selectedStatus === "ALL" || task.status === selectedStatus;
        const matchesPriority = selectedPriority === "ALL" || task.priority === selectedPriority;

        if (matchesStatus && matchesPriority) {
            const li = document.createElement("li");
            li.style.borderColor = getprioritycolor(task.priority);
            li.draggable = true;
            li.classList.add('task-item');
            li.setAttribute('data-index', index);
            
            li.addEventListener('dragstart', () => {
                li.classList.add('dragging');
            });
            
            li.addEventListener('dragend', () => {
                li.classList.remove('dragging');
            });

            li.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const rect = li.getBoundingClientRect();
                contextMenu.style.display = 'block';
                contextMenu.style.top = e.clientY + 'px';
                contextMenu.style.left = e.clientX + 'px';
                
                document.querySelectorAll('.priority-option').forEach(option => {
                    option.classList.toggle('active', option.dataset.priority === task.priority);
                });

                const handlePriorityChange = (e) => {
                    const newPriority = e.target.closest('.priority-option').dataset.priority;
                    if (newPriority) {
                        task.priority = newPriority;
                        saveTasks();
                        renderTasks();
                    }
                    contextMenu.style.display = 'none';
                };

                contextMenu.querySelectorAll('.priority-option').forEach(option => {
                    option.onclick = handlePriorityChange;
                });
            });

            li.innerHTML = `
                <div class="d-flex justify-content-center align-items-center">
                    <div class="drag-handle me-2">⋮⋮</div>
                    <div>
                        <input type="checkbox" ${task.status === "DONE" ? "checked" : ""} data-index="${index}" class="complete-checkbox me-2">
                        <span>${task.name}</span><br>
                        <small class="text-muted">
                            <span class="priority-dot ${task.priority.toLowerCase()}"></span>
                            Priorité : ${task.priority}
                        </small>
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-index="${index}">✏️</button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">🗑</button>
                    </div>
                </div>
            `;

            const targetListId = getListId(task.status);
            document.getElementById(targetListId).appendChild(li);
        }
    });

    trashedTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.style.borderColor = getprioritycolor(task.priority);
        li.innerHTML = `
            <div class="d-flex justify-content-center align-items-center">
                <div>
                    <span>${task.name}</span><br>
                    <small class="text-muted">
                        <span class="priority-dot ${task.priority.toLowerCase()}"></span>
                        Priorité : ${task.priority}
                    </small>
                </div>
                <div class="btn-group ms-2">
                    <button class="btn btn-sm btn-outline-success restore-btn" data-index="${index}">↩️</button>
                    <button class="btn btn-sm btn-outline-danger permanent-delete-btn" data-index="${index}">❌</button>
                </div>
            </div>
        `;
        document.getElementById("trash-list").appendChild(li);
    });

    const deletebtn = document.querySelectorAll(".delete-btn");
    deletebtn.forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            const deletedTask = tasks.splice(index, 1)[0];
            trashedTasks.push(deletedTask);
            saveTasks();
            saveTrash();
            renderTasks();
        });
    });

    const restoreButtons = document.querySelectorAll(".restore-btn");
    restoreButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            const restoredTask = trashedTasks.splice(index, 1)[0];
            tasks.push(restoredTask);
            saveTasks();
            saveTrash();
            renderTasks();
        });
    });

    const permanentDeleteButtons = document.querySelectorAll(".permanent-delete-btn");
    permanentDeleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            trashedTasks.splice(index, 1);
            saveTrash();
            renderTasks();
        });
    });

    const modifybtn = document.querySelectorAll(".edit-btn");
    modifybtn.forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            const newName = prompt("Modifier le nom de la tâche :", tasks[index].name);
            if (newName) {
                tasks[index].name = newName.trim();
                saveTasks();
                renderTasks();
            }
        });
    });

    initDragAndDrop();
}

function getStatusFromList(listId) {
    switch (listId) {
        case "todo-list": return "TO DO";
        case "inprogress-list": return "IN PROGRESS";
        case "inreview-list": return "IN REVIEW";
        case "done-list": return "DONE";
        default: return "TO DO";
    }
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

function saveTrash() {
  localStorage.setItem("trashedTasks", JSON.stringify(trashedTasks));
}

function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    const storedTrash = localStorage.getItem('trashedTasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    if (storedTrash) {
        trashedTasks = JSON.parse(storedTrash);
    }
    renderTasks();
}

function toggleTrash() {
    const trashSection = document.getElementById('trash-section');
    if (trashSection) {
        trashSection.style.display = trashSection.style.display === 'none' ? 'block' : 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});