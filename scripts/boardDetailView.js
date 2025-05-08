/**
 * Opens the overlay dialog with task details.
 * @param {Event} event - The event object.
 * @param {string} assignedToEncoded - Encoded assignedTo data.
 * @param {string} category - Task category.
 * @param {string} description - Task description.
 * @param {string} dueDate - Due date.
 * @param {string} priority - Task priority.
 * @param {string} subtasksEncoded - Encoded subtasks data.
 * @param {string} title - Task title.
 * @param {string} taskId - Task ID.
 * @param {string} contactsObjEncoded - Encoded contacts data.
 */
function openOverlay(event, assignedToEncoded, category, description, dueDate, priority, subtasksEncoded, title, taskId, contactsObjEncoded) {
    event.stopPropagation();
    const assignedTo = (assignedToEncoded && assignedToEncoded !== 'undefined') ? JSON.parse(decodeURIComponent(assignedToEncoded)) : {};
    const subtasks = (subtasksEncoded && subtasksEncoded !== 'undefined') ? JSON.parse(decodeURIComponent(subtasksEncoded)) : {};
    const contacts = (contactsObjEncoded && contactsObjEncoded !== 'undefined') ? JSON.parse(decodeURIComponent(contactsObjEncoded)) : {};
    const overlayRef = document.getElementById("overlayBoard");
    document.body.classList.add("stopScrolling");
    overlayRef.classList.add("overlayBoard");
    overlayRef.innerHTML += getDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId, contacts);
    renderAssignedToIconsDetailView(assignedTo, `overlayTaskAssignedToContacts_${taskId}`, contacts);
    renderSubtasksDetailView(subtasks, `addTask_subtask_content_${taskId}`, taskId);
    document.getElementById("dialogBoard").addEventListener("click", e => e.stopPropagation());
}


/**
 * Formats a date string into dd/mm/yyyy.
 * @param {string} dateString - The date string.
 * @returns {string} The formatted date.
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}/${date.getFullYear()}`;
}


/**
 * Capitalizes the first letter and lowercases the remainder.
 * @param {string} str - The input string.
 * @returns {string} The modified string.
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


/**
 * Renders assigned-to icons in the detail view.
 * @param {Object} assignedToObj - Object with assigned user data.
 * @param {string} containerId - The container element ID.
 * @param {Object} contacts - Contacts data.
 */
function renderAssignedToIconsDetailView(assignedToObj, containerId, contacts) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    Object.keys(assignedToObj).forEach(name => {
        if (assignedToObj[name]) {
            const email = Object.values(contacts).find(c => c.name === name)?.email || '';
            const nameWithYou = `${name} ${isItMyEmail(email)}`;
            container.innerHTML += createAssignedToIconHTMLforDetailView(nameWithYou, setContactInitials(name), getContactBackgroundColor(name, contacts));
        }
    });
}


/**
 * Renders the detailed view for subtasks.
 * @param {Object} subtasksObj - Object with subtask statuses.
 * @param {string} containerIdS - ID of the container element.
 * @param {string} taskId - The task ID.
 */
function renderSubtasksDetailView(subtasksObj, containerIdS, taskId) {
    const container = document.getElementById(containerIdS);
    container.innerHTML = '';
    if (!subtasksObj || Object.keys(subtasksObj).length === 0) {
        document.getElementById('subtasksDialog').classList.add('d_none'); return;
    }
    Object.entries(subtasksObj).forEach(([title, status]) =>
        container.innerHTML += createSubTaskHTML(title, status, taskId)
    );
}


/**
 * Closes the dialog.
 * @param {string} taskId - The task's ID.
 */
function closeDialog(taskId) {
    const overlay = document.getElementById("overlayBoard");
    document.body.classList.remove("stopScrolling");
    overlay.classList.remove("overlayBoard");
    const subtasks = collectSubtasks(taskId);
    loadTasksBoard();
    overlay.innerHTML = "";
}


/**
 * Reads the status of all subtasks in the overlay.
 * @param {string} taskId - he task's ID.
 * @returns {Object} - Subtasks-Object with status.
 */
function collectSubtasks(taskId) {
    const subtasks = {};
    const inputs = document.querySelectorAll(
        `#addTask_subtask_content_${taskId} .overlayTaskSubtasks input`
    );
    inputs.forEach(input => {
        const title = input.nextElementSibling.nextElementSibling.textContent;
        subtasks[title] = input.checked ? "done" : "undone";
    });
    return subtasks;
}


/**
 * Updates the subtasks status in the database.
 * @param {string} taskId - The task ID.
 * @param {string} title - The subtask title.
 * @param {boolean} isChecked - The checkbox status.
 */
async function updateSubtasksInDatabase(taskId, title, isChecked) {
    const newStatus = isChecked ? "done" : "undone";
    const path = `tasks/${taskId}/subtasks`;
    const res = await fetch(BASE_URL + path + ".json");
    const subtasks = await res.json() || {};
    subtasks[title] = newStatus;
    await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        body: JSON.stringify(subtasks),
        headers: { "Content-Type": "application/json" }
    });
}


/**
 * Deletes a task and refreshes the board.
 * @param {string} taskId - The task ID.
 */
async function deleteTask(taskId) {
    const path = `tasks/${taskId}`;
    await fetch(BASE_URL + path + ".json", { method: "DELETE" });
    closeDialog(taskId);
    loadTasksBoard();
}





