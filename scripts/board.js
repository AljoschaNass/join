/**
 * Initializes the board.
 * Executes highlighting, template rendering, and data loading.
 */
async function boardInit() {
    init();
    highlightSelectedQuickLinks('board');
    await renderW3AddTaskTemplate();
    loadContactListAssignedTo();
    loadTasksBoard();
}


/**
 * Fetches all tasks from firebase.
 * @returns {Promise<Object>} All tasks as an object.
 */
async function getAllTasks() {
    let path = "tasks";
    let response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}


/**
 * Loads all tasks and displays them in their respective columns.
 */
async function loadTasksBoard() {
    let tasks = await getAllTasks();
    let contactsObj = await getAllContacts();
    let columns = getTaskColumns();
    clearColumns(columns);
    renderAllTasks(tasks, columns, contactsObj);
    renderEmptyColumns(columns);
}


/**
 * Returns the task board columns as DOM elements.
 * @returns {Object} Column elements keyed by status.
 */
function getTaskColumns() {
    return {
        toDoTask: document.getElementById('toDoTask'),
        inProgressTask: document.getElementById('inProgressTask'),
        awaitFeedbackTask: document.getElementById('awaitFeedbackTask'),
        doneTask: document.getElementById('doneTask')
    };
}

/**
 * Clears all column contents.
 * @param {Object} columns - Object with column elements.
 */
function clearColumns(columns) {
    for (let key in columns) {
        columns[key].innerHTML = '';
    }
}


/**
 * Renders all tasks into their corresponding columns.
 * @param {Object} tasks - Object containing all tasks.
 * @param {Object} columns - Mapping of column IDs to DOM elements.
 * @param {Object} contactsObj - Object containing contact data.
 */
function renderAllTasks(tasks, columns, contactsObj) {
    for (let taskId in tasks) {
        let task = tasks[taskId];
        renderTask(task, taskId, columns, contactsObj);
    }
}


/**
 * Renders a single task into the correct column.
 * @param {Object} task - Task data object.
 * @param {string} taskId - ID of the task.
 * @param {Object} columns - Mapping of column IDs to DOM elements.
 * @param {Object} contactsObj - Object containing contact data.
 */
function renderTask(task, taskId, columns, contactsObj) {
    if (!columns[task.status]) return;
    let html = renderTaskCard(task.assignedTo, task.category, task.description,
        task.dueDate, task.priority, task.subtasks, task.title, taskId, contactsObj);
    columns[task.status].innerHTML += html;
    renderAssignedToIcons(task.assignedTo, `cardsAssignedTo_${taskId}`, contactsObj);
    renderSubtasks(task.subtasks, `subtasksTaskCard_${taskId}`);
}


/**
 * Fills empty columns with a placeholder card..
 */
function renderEmptyColumns(columns) {
    for (let status in columns) {
        if (columns[status].innerHTML === '') {
            columns[status].innerHTML = renderNoTaskCard(status);
        }
    }
}


/**
 * Returns the CSS class for a task category.
 * @param {string} category - Task category
 * @returns {string} CSS class.
 */
function formatCategory(category) {
    return category === "User Story" ? "userStory" : "technicalTask";
}


/**
 * Renders the progress bar for subtasks.
 * @param {Object} subtasksObj - Object containing subtask statuses.
 * @param {string} containerId - ID of the container element.
 */
function renderSubtasks(subtasksObj, containerId) {
    const container = document.getElementById(containerId);
    if (!subtasksObj || Object.keys(subtasksObj).length === 0) {
        container.classList.add('d_none');
        return;
    }
    updateProgressBar(subtasksObj, container);
}


/**
 * Updates the progress bar and subtask count.
 * @param {Object} subtasksObj - Object containing subtask statuses.
 * @param {HTMLElement} container - DOM element that contains the progress bar.
 */
function updateProgressBar(subtasksObj, container) {
    const total = Object.keys(subtasksObj).length;
    const done = Object.values(subtasksObj).filter(s => s === 'done').length;
    const percent = (done / total) * 100;
    container.querySelector('#cardsSubtasks').innerText = `${done}/${total} Subtasks`;
    container.querySelector('#cardsProgressBar').setAttribute('aria-valuenow', percent);
    container.querySelector('#progressBar').style.width = `${percent}%`;
}


/**
 * Renders contact icons for assigned users.
 */
function renderAssignedToIcons(assignedToObj, containerId, contactsObj) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!assignedToObj || Object.keys(assignedToObj).length === 0) return;
    for (let name in assignedToObj) {
        if (assignedToObj[name]) {
            const bgColor = getContactBackgroundColor(name, contactsObj);
            const initials = setContactInitials(name);
            container.innerHTML += createAssignedToIconHTML(initials, bgColor);
        }
    }
}


/**
 * Finds the background color for a contact.
 */
function getContactBackgroundColor(name, contactsObj) {
    for (let id in contactsObj) {
        if (contactsObj[id].name === name) {
            return contactsObj[id].backgroundcolor || 'defaultBackground';
        }
    }
    return 'defaultBackground';
}


/**
 * Maps priority to image class name.
 */
function formatPriorityImg(priority) {
    switch (priority) {
        case "low": return "priorityLow";
        case "medium": return "priorityMedium";
        case "urgent": return "priorityUrgent";
        default: return "";
    }
}


/**
 * Stores column ID in the create task button.
  * @param {string} columnId - ID of the target column.
 */
function openTaskDialogFor(columnId) {
    document.getElementById("btn_add_task_create_task").setAttribute("data-column-id", columnId);
}


/**
 * Opens the add task dialog for a column.
 */
function createNewTask(event, status) {
    event.stopPropagation();
    let dialog = document.getElementById("overlayBoardAddTask");
    dialog.classList.remove("d_none");
    dialog.classList.add("overlayBoard");
    dialog.setAttribute('status', status);
    document.getElementById("addTaskDialogBoard").addEventListener("click", e => e.stopPropagation());
    document.body.classList.add("stopScrolling");
}


/**
 * Loads and renders the add-task HTML template.
 */
async function renderW3AddTaskTemplate() {
    await w3.includeHTML(); // Sicherstellen, dass Includes geladen werden
    const res = await fetch('../assets/templates/addTaskTemplate.html');
    const html = await res.text();
    const dialog = document.getElementById("overlayBoardAddTask");
    dialog.classList.add("d_none");
    dialog.innerHTML += getAddTaskDialogTemplate(html);
}


/**
 * Closes the add task dialog.
 */
function closeDialogAddTask() {
    document.getElementById("overlayBoardAddTask").classList.add("d_none");
    document.body.classList.remove("stopScrolling");
}


/**
 * Allows drop by preventing default.
 * @param {DragEvent} ev - Drag event.
 */
function allowDrop(ev) {
    ev.preventDefault();
}


/**
 * Starts dragging a task and highlights drop zones.
 * @param {DragEvent} ev - The drag event.
 */
function dragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    highlightDropZones(ev.target);
}


/**
 * Highlights neighboring columns.
 * @param {HTMLElement} draggedElement - The element being dragged.
 */
function highlightDropZones(draggedElement) {
    const zones = Array.from(document.querySelectorAll(
        '#toDoTask, #inProgressTask, #awaitFeedbackTask, #doneTask'
    ));
    const current = draggedElement.closest('div[id$="Task"]');
    const index = zones.indexOf(current);
    [index - 1, index + 1].forEach(i => {
        if (zones[i]) zones[i].appendChild(createHighlight());
    });
}


/**
 * Creates a drop zone highlight element.
 * @returns {HTMLElement} Highlight div.
 */
function createHighlight() {
    const el = document.createElement('div');
    el.classList.add('dragAreaHighlight');
    return el;
}


/**
 * Ends drag and re-renders the board.
 */
function dragEnd() {
    document.querySelectorAll('.dragAreaHighlight').forEach(el => el.remove());
    loadTasksBoard();
}


/**
 * Handles dropping a task into a column.
 * @param {DragEvent} ev - The drop event.
 */
function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    const dropZone = ev.currentTarget;
    const taskId = id;
    updateTaskStatus(taskId, dropZone.id);
    dropZone.appendChild(document.getElementById(id));
    dragEnd();
}



/**
 * Updates the task status in the backend.
 * @param {string} taskId - ID of the task.
 * @param {string} newStatus - New status value.
 */
async function updateTaskStatus(taskId, newStatus) {
    let path = `tasks/${taskId}`;
    await fetch(BASE_URL + path + ".json", {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
    });
}

