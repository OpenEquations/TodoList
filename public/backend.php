<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    if ($data === null) {
        http_response_code(400);
        echo 'Bad Request: Invalid JSON data';
        exit;
    }

    $filePath = 'data.json';
    $existingJson = file_get_contents($filePath);
    $existingData = json_decode($existingJson, true);

    if ($existingData === null) {
        $existingData = [];
    }

    if (isset($data['tasks'])) {
        $tasks = $data['tasks'];
        
        foreach ($tasks as $taskIndex => $task) {
            if (isset($existingData[$taskIndex])) {
                $existingData[$taskIndex]['completed'] = $task['completed'];
            }
        }
        
        foreach ($tasks as $task) {
            $existingTaskIndex = findTaskIndex($existingData, $task['text']);
            if ($existingTaskIndex !== -1) {
                $existingData[$existingTaskIndex] = $task;
            } else {
                $existingData[] = $task;
            }
        }

        if (isset($data['editedTaskIndex']) && isset($data['editedTaskText'])) {
            $editedTaskIndex = $data['editedTaskIndex'];
            $editedTaskText = $data['editedTaskText'];

            if (isset($tasks[$editedTaskIndex])) {
                $existingData[$editedTaskIndex]['text'] = $editedTaskText;
            }
        }

        if (isset($data['deletedTaskIndex'])) {
            $deletedTaskIndex = $data['deletedTaskIndex'];

            if (isset($existingData[$deletedTaskIndex]) && $deletedTaskIndex >= 0 && $deletedTaskIndex < count($existingData)) {
                unset($existingData[$deletedTaskIndex]);
                $existingData = array_values($existingData);
                
            }
        }

        if (file_put_contents($filePath, json_encode($existingData, JSON_PRETTY_PRINT))) {
            http_response_code(200);
            echo 'Data received and processed successfully.';
        } else {
            http_response_code(500);
            echo 'Error saving data.';
        }
    } else {
        http_response_code(400);
        echo 'Bad Request: No tasks provided.';
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $filePath = 'data.json';
    $existingJson = file_get_contents($filePath);
    $existingData = json_decode($existingJson, true);

    if ($existingData !== null) {
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode($existingData, JSON_PRETTY_PRINT);
    } else {
        http_response_code(500);
        echo 'Error loading tasks';
    }
} else {
    http_response_code(405);
    echo 'Method Not Allowed';
}

function findTaskIndex($tasks, $taskText) {
    foreach ($tasks as $index => $task) {
        if ($task['text'] === $taskText) {
            return $index;
        }
    }
    return -1;
}
?>
