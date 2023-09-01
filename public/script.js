
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const tasks = [];
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = createTaskElement(task, index);
        taskList.appendChild(li);
    });
}

function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox" data-task-index="${index}" ${task.completed ? 'checked' : ''}>
        ${task.text}
        <button class="edit-button" data-task-index="${index}" ${task.completed ? 'disabled' : ''}><i class="fa fa-edit"></i>Edit</button>

        <button class="delete-button" data-task-index="${index}">Delete</button>
    `;

    if (task.completed) {
        li.classList.add('completed');
    }

    return li;
}

function saveTasksToServerAjax(tasks) {
    const xhr = new XMLHttpRequest();
    const url = 'backend.php'; 

    xhr.open('POST', url, true);
     xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Tasks saved successfully.');
            } else {
                console.error('Error saving tasks:', xhr.status, xhr.statusText);
            }
        }
    };

    xhr.send(JSON.stringify({ tasks }));
}

function loadTasksFromServerAjax() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'backend.php', true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                tasks.length = 0;
                tasks.push(...data);
                renderTasks();
            } else {
                console.error('Error loading tasks:', xhr.status, xhr.statusText);
            }
        }
    };

    xhr.send();
}

taskForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = {
            text: taskText,
            completed: false
        };
        tasks.push(task);

        saveTasksToServerAjax(tasks);
        renderTasks();
        taskInput.value = '';
    }
});

taskList.addEventListener('change', function (e) {
    if (e.target.classList.contains('task-checkbox')) {
        const taskIndex = parseInt(e.target.dataset.taskIndex, 10);
        tasks[taskIndex].completed = e.target.checked;
        saveTasksToServerAjax(tasks);
        renderTasks();
    }
});

taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-button')) {
        const taskIndex = parseInt(e.target.dataset.taskIndex, 10);
        tasks.splice(taskIndex, 1);
        saveTasksToServerAjax(tasks);
        renderTasks();
    } else if (e.target.classList.contains('edit-button')) {
        const taskIndex = parseInt(e.target.dataset.taskIndex, 10);
        const newTaskText = prompt('Edit task:', tasks[taskIndex].text);
        if (newTaskText !== null) {
            tasks[taskIndex].text = newTaskText;
            saveTasksToServerAjax(tasks);
            renderTasks();
        }
    }
});

window.addEventListener('load', loadTasksFromServerAjax);
