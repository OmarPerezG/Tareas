document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const taskName = document.getElementById('taskName').value;
    const taskAssignee = document.getElementById('taskAssignee').value;
    const taskCreator = document.getElementById('taskCreator').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskStatus = document.getElementById('taskStatus').value;
    const taskComments = document.getElementById('taskComments').value;

    const task = {
        name: taskName,
        assignee: taskAssignee,
        creator: taskCreator,
        priority: taskPriority,
        date: taskDate,
        status: taskStatus,
        comments: taskComments
    };

    addTaskToTable(task);
    saveTaskToLocal(task);
    document.getElementById('taskForm').reset();
});

function addTaskToTable(task) {
    const tableBody = document.getElementById('taskTable').querySelector('tbody');
    const completedTableBody = document.getElementById('completedTaskTable').querySelector('tbody');
    const row = document.createElement('tr');

    const priorityOptions = `
        <option value="bajo" ${task.priority === 'bajo' ? 'selected' : ''}>Bajo</option>
        <option value="medio" ${task.priority === 'medio' ? 'selected' : ''}>Medio</option>
        <option value="alto" ${task.priority === 'alto' ? 'selected' : ''}>Alto</option>
    `;

    const statusOptions = `
        <option value="pendiente" ${task.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="en proceso" ${task.status === 'en proceso' ? 'selected' : ''}>En Proceso</option>
        <option value="terminado" ${task.status === 'terminado' ? 'selected' : ''}>Terminado</option>
    `;

    row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.assignee}</td>
        <td>${task.creator}</td>
        <td>
            <select class="priority-select">
                ${priorityOptions}
            </select>
        </td>
        <td>${task.date}</td>
        <td class="editable">
            <span>${task.comments}</span>
            <textarea>${task.comments}</textarea>
        </td>
        <td>
            <select class="status-select">
                ${statusOptions}
            </select>
        </td>
    `;

    const commentCell = row.querySelector('.editable');
    commentCell.addEventListener('click', function() {
        this.querySelector('span').style.display = 'none';
        this.querySelector('textarea').style.display = 'block';
        this.querySelector('textarea').focus();
    });

    row.querySelector('textarea').addEventListener('blur', function() {
        const newComments = this.value;
        this.style.display = 'none';
        this.previousElementSibling.style.display = 'block';
        updateTaskComments(task, newComments);
    });

    row.querySelector('.priority-select').addEventListener('change', function() {
        updateTaskPriority(task, this.value);
    });

    row.querySelector('.status-select').addEventListener('change', function() {
        const newStatus = this.value;
        updateTaskStatus(task, newStatus);

        if (newStatus === 'terminado') {
            row.remove();
            addCompletedTaskToTable(task);
        }
    });

    if (task.status === 'terminado') {
        addCompletedTaskToTable(task);
    } else {
        tableBody.appendChild(row);
    }
}

function addCompletedTaskToTable(task) {
    const completedTableBody = document.getElementById('completedTaskTable').querySelector('tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.assignee}</td>
        <td>${task.creator}</td>
        <td>${task.priority}</td>
        <td>${task.date}</td>
        <td>${task.comments}</td>
        <td>
            <button class="reactivate-btn">Reactivar</button>
            <button class="delete-btn">Eliminar</button>
        </td>
    `;

    row.querySelector('.reactivate-btn').addEventListener('click', function() {
        reActivateTask(task);
        row.remove();
    });

    row.querySelector('.delete-btn').addEventListener('click', function() {
        deleteTaskFromLocal(task);
        row.remove();
    });

    completedTableBody.appendChild(row);
}

function reActivateTask(task) {
    task.status = 'pendiente';
    addTaskToTable(task);
    updateTaskStatus(task, 'pendiente');
}

function saveTaskToLocal(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => !(t.name === task.name && t.date === task.date && t.assignee === task.assignee && t.creator === task.creator));
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskPriority(task, newPriority) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.name === task.name && t.assignee === task.assignee && t.date === task.date);
    if (taskIndex > -1) {
        tasks[taskIndex].priority = newPriority;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTaskStatus(task, newStatus) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.name === task.name && t.assignee === task.assignee && t.date === task.date);
    if (taskIndex > -1) {
        tasks[taskIndex].status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function updateTaskComments(task, newComments) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.name === task.name && t.assignee === task.assignee && t.date === task.date);
    if (taskIndex > -1) {
        tasks[taskIndex].comments = newComments;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function deleteTaskFromLocal(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => !(t.name === task.name && t.assignee === task.assignee && t.date === task.date));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocal() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToTable(task));
}

window.onload = loadTasksFromLocal;
