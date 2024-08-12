document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const taskName = document.getElementById('taskName').value;
    const taskAssignee = document.getElementById('taskAssignee').value;
    const taskCreator = document.getElementById('taskCreator').value;
    const taskPriority = document.getElementById('taskPriority').value;
    const taskDate = document.getElementById('taskDate').value;
    const taskStatus = document.getElementById('taskStatus').value;
    const taskComments = document.getElementById('taskComments').value;

    addTaskToTable(taskName, taskAssignee, taskCreator, taskPriority, taskDate, taskStatus, taskComments);
    document.getElementById('taskForm').reset();
});

function addTaskToTable(name, assignee, creator, priority, date, status, comments) {
    const table = status === 'terminado' ? document.getElementById('completedTasksTable').querySelector('tbody') : document.getElementById('taskTable').querySelector('tbody');
    const row = table.insertRow();

    row.innerHTML = `
        <td>${name}</td>
        <td>${assignee}</td>
        <td>${creator}</td>
        <td>${priority}</td>
        <td>${date}</td>
        <td>
            <select class="status-select" onchange="updateTaskStatus(this)">
                <option value="pendiente" ${status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                <option value="en proceso" ${status === 'en proceso' ? 'selected' : ''}>En Proceso</option>
                <option value="terminado" ${status === 'terminado' ? 'selected' : ''}>Terminado</option>
            </select>
        </td>
        <td class="editable"><span>${comments}</span><textarea onblur="saveComment(this)">${comments}</textarea></td>
        <td><button class="delete-btn" onclick="deleteTask(this)">Eliminar</button></td>
    `;
}

function updateTaskStatus(selectElement) {
    const row = selectElement.parentElement.parentElement;
    const tableBody = row.parentElement;
    const status = selectElement.value;
    
    if (status === 'terminado') {
        document.getElementById('completedTasksTable').querySelector('tbody').appendChild(row);
    } else {
        document.getElementById('taskTable').querySelector('tbody').appendChild(row);
    }
}

function saveComment(textareaElement) {
    const spanElement = textareaElement.previousElementSibling;
    spanElement.textContent = textareaElement.value;
    textareaElement.style.display = 'none';
    spanElement.style.display = 'block';
}

document.addEventListener('click', function(event) {
    const target = event.target;
    
    if (target.tagName.toLowerCase() === 'span' && target.parentElement.classList.contains('editable')) {
        target.style.display = 'none';
        target.nextElementSibling.style.display = 'block';
        target.nextElementSibling.focus();
    }
});

function deleteTask(buttonElement) {
    const row = buttonElement.parentElement.parentElement;
    row.remove();
}
