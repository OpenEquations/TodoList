 
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const tasks = [];

taskForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = {
            text: taskText,
            completed: false
        };
        tasks.push(task);

        try {
            await saveTasksToServer(tasks);
            renderTasks();
            taskInput.value = '';
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }
});

async function saveTasksToServer(tasks) {

    const url = '/saveTasks';
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tasks }),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`Error saving tasks: ${response.status} ${response.statusText}`);
    }

    console.log('Tasks saved successfully.');
}

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
        <button class="delete-button" data-task-index="${index}"><i class="fa fa-times"></i>Delete</button>
    `;

    if (task.completed) {
        li.classList.add('completed');
    }

    return li;
}

taskList.addEventListener('change', function (e) {
    if (e.target.classList.contains('task-checkbox')) {
        const taskIndex = parseInt(e.target.dataset.taskIndex, 10);
        tasks[taskIndex].completed = e.target.checked;
        renderTasks();
    }
});

taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-button')) {
        const taskIndex = parseInt(e.target.dataset.taskIndex, 10);
        tasks.splice(taskIndex, 1);
        renderTasks();
    } else if (e.target.classList.contains('edit-button')) {
        const taskIndex = parseInt(e.target.dataset.taskIndex, 10);
        const newTaskText = prompt('Edit task:', tasks[taskIndex].text);
        if (newTaskText !== null) {
            tasks[taskIndex].text = newTaskText;
            renderTasks();
        }
    }
});

// Initial rendering
renderTasks();
