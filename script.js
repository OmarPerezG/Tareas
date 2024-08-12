document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const task = {
        name: document.getElementById('task-name').value,
        assignee: document.getElementById('task-assignee').value,
        creator: document.getElementById('task-creator').value,
        priority: document.getElementById('task-priority').value,
        date: document.getElementById('task-date').value,
        status: document.getElementById('task-status').value,
        comments: document.getElementById('task-comments').value
    };

    addTaskToTable(task, 'task-body');
    this.reset();
});

function addTaskToTable(task, tableBodyId) {
    const tableBody = document.getElementById(tableBodyId);
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.assignee}</td>
        <td>${task.creator}</td>
        <td>${task.priority}</td>
        <td>${task.date}</td>
        <td>${task.status}</td>
        <td class="editable">
            <span>${task.comments}</span>
            <textarea style="display:none;">${task.comments}</textarea>
        </td>
        <td>
            <button class="complete-btn">Terminar</button>
            <button class="delete-btn">Eliminar</button>
        </td>
    `;

    tableBody.appendChild(row);

    const completeBtn = row.querySelector('.complete-btn');
    const deleteBtn = row.querySelector('.delete-btn');
    const editableCell = row.querySelector('.editable');

    completeBtn.addEventListener('click', function() {
        task.status = 'terminado';
        moveTaskToCompleted(task, row);
    });

    deleteBtn.addEventListener('click', function() {
        tableBody.removeChild(row);
    });

    editableCell.addEventListener('click', function() {
        toggleEditComment(editableCell);
    });
}

function toggleEditComment(cell) {
    const span = cell.querySelector('span');
    const textarea = cell.querySelector('textarea');

    if (textarea.style.display === 'none') {
        span.style.display = 'none';
        textarea.style.display = 'block';
        textarea.focus();
    } else {
        span.innerText = textarea.value;
        span.style.display = 'block';
        textarea.style.display = 'none';
    }
}

function moveTaskToCompleted(task, row) {
    document.getElementById('task-body').removeChild(row);
    addTaskToTable(task, 'completed-task-body');
}

document.getElementById('completed-task-body').addEventListener('click', function(e) {
    if (e.target.classList.contains('complete-btn')) {
        const row = e.target.closest('tr');
        const task = {
            name: row.children[0].innerText,
            assignee: row.children[1].innerText,
            creator: row.children[2].innerText,
            priority: row.children[3].innerText,
            date: row.children[4].innerText,
            status: 'pendiente',
            comments: row.children[6].innerText
        };
        addTaskToTable(task, 'task-body');
        row.remove();
    }
});
