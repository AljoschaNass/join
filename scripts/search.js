async function searchTask() {
    let searchInput = document.getElementById('searchInput').value.toLowerCase();
    let allTasks = await getAllTasks();
    let allTasksArray = Object.values(allTasks);
    let filteredTasks = allTasksArray.filter(task => task.title.toLowerCase().includes(searchInput) || task.description.toLowerCase().includes(searchInput));
    if (filteredTasks.length > 0) {
         loadTasksBoardAfterSearch(filteredTasks);
    } else {
        loadTasksBoardAfterSearch(filteredTasks);
        showNoTaskFoundMessage();
    }
}


function loadTasksBoardAfterSearch(tasks){
    let columns = getColumns();
    clearColumns(columns);
    loadColumns(columns, tasks);
    checkEmptyColumns(columns);
}


function getColumns() {
    return {
        "toDoTask": document.getElementById('toDoTask'),
        "inProgressTask": document.getElementById('inProgressTask'),
        "awaitFeedbackTask": document.getElementById('awaitFeedbackTask'),
        "doneTask": document.getElementById('doneTask')
    };
}


function clearColumns(columns) {
    for (let key in columns) columns[key].innerHTML = '';
}


function loadColumns(columns, tasks) {
    for (let taskId in tasks) {
        let task = tasks[taskId];
        if (columns[task.status]) {
            columns[task.status].innerHTML += renderTaskCard(task.assignedTo, task.category, task.description, task.dueDate, task.priority, task.subtasks, task.title, taskId);
        }
    }
}


function checkEmptyColumns(columns) {
    for (let status in columns) {
        if (columns[status].innerHTML === '') {
            columns[status].innerHTML = renderNoTaskCard(status);
        }
    }
}


function showNoTaskFoundMessage() {
    let message = document.getElementById("noTaskFoundMessage");
    message.classList.add("d_none");
    void message.offsetWidth; 
    message.classList.remove("d_none");
}