async function searchTask() {
    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    let allTasks = await getAllTasks();
    let allTasksArray = Object.values(allTasks);
    let filteredTasks = allTasksArray.filter(task => task.title.toLowerCase().includes(searchInput) || task.description.toLowerCase().includes(searchInput));
    if (filteredTasks.length > 0) {
         loadTasksBoardAfterSearch(filteredTasks);
    } else {
        alert('No tasks found!');//muss noch schöner
    }
}


function loadTasksBoardAfterSearch(tasks){
    let columns = {
        "toDoTask": document.getElementById('toDoTask'),
        "inProgressTask": document.getElementById('inProgressTask'),
        "awaitFeedbackTask": document.getElementById('awaitFeedbackTask'),
        "doneTask": document.getElementById('doneTask')
    };
    for (let key in columns) {
        columns[key].innerHTML = '';
    }
    for (let taskId in tasks) {
        let task = tasks[taskId];
        if (columns[task.status]) {
            columns[task.status].innerHTML += renderTaskCard(task.assignedTo, task.category, task.description, task.dueDate, task.priority, task.subtasks, task.title, taskId);
        }
    }
    for (let status in columns) {
        if (columns[status].innerHTML === '') {
            columns[status].innerHTML = renderNoTaskCard(status);
        }
    }
}