/**
 * Searches for tasks based on the user's input and updates the task board with the results.
 * If no tasks are found, a message is displayed.
 * 
 * @returns {Promise<void>} A promise that resolves when the search is complete and the UI is updated.
 */
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


/**
 * Loads the task board with the results of the search.
 * Clears existing columns and populates them with the filtered tasks.
 * 
 * @param {Array} tasks - The array of tasks to display on the board.
 */
function loadTasksBoardAfterSearch(tasks){
    let columns = getColumns();
    clearColumns(columns);
    loadColumns(columns, tasks);
    checkEmptyColumns(columns);
}


/**
 * Retrieves the columns of the task board.
 * 
 * @returns {Object} An object containing the task columns.
 */
function getColumns() {
    return {
        "toDoTask": document.getElementById('toDoTask'),
        "inProgressTask": document.getElementById('inProgressTask'),
        "awaitFeedbackTask": document.getElementById('awaitFeedbackTask'),
        "doneTask": document.getElementById('doneTask')
    };
}


/**
 * Clears the content of the specified columns.
 * 
 * @param {Object} columns - An object containing the columns to clear.
 */
function clearColumns(columns) {
    for (let key in columns) columns[key].innerHTML = '';
}


/**
 * Loads the specified tasks into the corresponding columns of the task board.
 * 
 * @param {Object} columns - An object containing the columns to load tasks into.
 * @param {Array} tasks - The array of tasks to display.
 */
function loadColumns(columns, tasks) {
    for (let taskId in tasks) {
        let task = tasks[taskId];
        if (columns[task.status]) {
            columns[task.status].innerHTML += renderTaskCard(task.assignedTo, task.category, task.description, task.dueDate, task.priority, task.subtasks, task.title, taskId);
        }
    }
}


/**
 * Checks if any columns are empty and populates them with a "no task" message if they are.
 * 
 * @param {Object} columns - An object containing the columns to check.
 */
function checkEmptyColumns(columns) {
    for (let status in columns) {
        if (columns[status].innerHTML === '') {
            columns[status].innerHTML = renderNoTaskCard(status);
        }
    }
}


/**
 * Displays a message indicating that no tasks were found.
 * The message is shown for a short duration before being hidden again.
 */
function showNoTaskFoundMessage() {
    let message = document.getElementById("noTaskFoundMessage");
    message.classList.add("d_none");
    void message.offsetWidth; 
    message.classList.remove("d_none");
    setTimeout(() => {message.classList.add("d_none");}, 2000);
}