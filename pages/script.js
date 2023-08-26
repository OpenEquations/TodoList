const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

const tasks = []; 

taskForm.addEventListener('submit', function (e) {
    e.preventDefault(); 

    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = {
            text: taskText,
            completed: false
        };
        tasks.push(task); 

        renderTasks(); 
        taskInput.value = ''; 
    }
});

function renderTasks() {
    taskList.innerHTML = ''; 

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
    <input type="checkbox" class="task-checkbox" data-task-index="${index}" ${task.completed ? 'checked' : ''}>
    ${task.text}
    <button class="edit-button" data-task-index="${index}"><i class="fa fa-edit"></i>Edit</button>
    <button class="delete-button" data-task-index="${index}"><i class="fa fa-times"></i>Delete</button>
`;

        if (task.completed) {
            li.classList.add('completed');
        }
        taskList.appendChild(li);
    });

    
    const taskCheckboxes = document.querySelectorAll('.task-checkbox');
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const taskIndex = parseInt(this.dataset.taskIndex, 10);
            tasks[taskIndex].completed = this.checked;
            renderTasks(); 
        });
    });
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const taskIndex = parseInt(this.dataset.taskIndex, 10);
            tasks.splice(taskIndex, 1); 
            renderTasks(); 
        });
    });
    const editButtons = document.querySelectorAll('.edit-button');
editButtons.forEach(button => {
    button.addEventListener('click', function () {
        const taskIndex = parseInt(this.dataset.taskIndex, 10);
        const newTaskText = prompt('Edit task:', tasks[taskIndex].text);
        if (newTaskText !== null) {
            tasks[taskIndex].text = newTaskText;
            renderTasks(); 
        }
    });
});
}

renderTasks(); 
