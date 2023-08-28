const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the Express server!');
});
app.post('/saveTasks', (req, res) => {
    const tasksData = req.body.tasks;
    const filePath = path.join(__dirname, 'tasks.json');

    fs.writeFile(filePath, JSON.stringify(tasksData, null, 2), err => {
        console.log('Received tasks data:', tasksData);

        if (err) {
            console.error('Error writing tasks to file:', err);
            res.status(500).send('Error saving tasks');
        } else {
            console.log('Tasks saved to file.');
            res.status(200).send('Tasks saved successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});