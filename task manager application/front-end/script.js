let tasks = [];

document.getElementById('taskForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const id = document.getElementById('taskId').value;

    if (id) {
        await updateTask(id, title, description, dueDate);
    } else {
        await createTask(title, description, dueDate);
    }

    $('#taskModal').modal('hide');
    this.reset();
    await fetchTasks();
});

function showAddTaskModal() {
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('taskModalLabel').textContent = 'Add Task';
    $('#taskModal').modal('show');
}

function showEditTaskModal(task) {
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskModalLabel').textContent = 'Edit Task';
    $('#taskModal').modal('show');
}

async function fetchTasks() {
    const response = await fetch('http://localhost:3000/tasks');
    tasks = await response.json();
    renderTaskList();
}

async function createTask(title, description, dueDate) {
    await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, dueDate })
    });
}

async function updateTask(id, title, description, dueDate) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, description, dueDate })
    });
}

async function deleteTask(id) {
    await fetch(`http://localhost:3000/tasks/${id}`, {
        method: 'DELETE'
    });
    await fetchTasks();
}

function renderTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'list-group-item';

        const taskDetails = document.createElement('div');
        taskDetails.className = 'task-details';
        taskDetails.innerHTML = `
            <h5>${task.title}</h5>
            <p>${task.description}</p>
            <small>Due: ${task.dueDate}</small>
        `;

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        taskActions.innerHTML = `
            <button class="btn btn-sm btn-secondary" onclick="showEditTaskModal(${JSON.stringify(task)})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask('${task.id}')">Delete</button>
        `;

        taskItem.appendChild(taskDetails);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);
    });
}

fetchTasks();
