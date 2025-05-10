/**
 * Opens the edit dialog and renders the template.
 * @param {Object} assignedTo - Contacts assigned to the task.
 * @param {string} category - Task category.
 * @param {string} description - Task description.
 * @param {string} dueDate - Due date of the task.
 * @param {string} priority - Priority level.
 * @param {Object} subtasks - Subtasks of the task.
 * @param {string} title - Title of the task.
 * @param {string} taskId - ID of the task.
 */
async function openEditDialog(event, assignedTo, category,  description, dueDate, priority, subtasks, title, taskId) {
    event.stopPropagation();
    const dialog = document.getElementById("dialogBoard");
    dialog.innerHTML = getEditDialogTemplate(category, description, dueDate, title, taskId);
    updatePriorityButtonClasses(priority);
    setCheckedContactsFromEncoded(assignedTo);
    await loadContactListAssignedTo();
    handleClickOutsideAssignedTo();
    renderEditDialogSubtasksFromEncoded(subtasks);
    document.getElementById("dialogBoard").addEventListener("click", e => e.stopPropagation());
}


/**
 * Saves edited task values and updates the task.
 *
 * @param {string} taskId - The ID of the task to update.
 */
async function saveEditTask(event, category, taskId) {
    const { title, description, dueDate, priority, assignedTo } = collectTaskData();
    const subtasks = collectEditedSubtasks(); 
    const contacts = await getAllContacts(); 
    await updateTaskAndRenderDialog(event, title, description, dueDate, priority, assignedTo, subtasks, taskId, contacts, category);
}


/**
 * Collects task values and priority.
 *
 * @returns {Object} - The task data including title, description, due date, priority, and assigned contacts.
 */
function collectTaskData() {
    const title = document.getElementById("titleTask").value;
    const description = document.getElementById("inputEditDialogBoardDescription").value;
    const dueDate = document.getElementById("dueDate").value;
    const assignedTo = checkedContacts; 
    let priority = "";
    if (document.getElementById("lowPriority").classList.contains("lowPriorityButtonSelected")) {
        priority = "low";
    } else if (document.getElementById("mediumPriority").classList.contains("mediumPriorityButtonSelected")) {
        priority = "medium";
    } else if (document.getElementById("urgentPriority").classList.contains("urgentPriorityButtonSelected")) {
        priority = "urgent";}
    return { title, description, dueDate, priority, assignedTo };
}


/**
 * Collects all edited subtasks from the DOM and returns them as an object.
 * Subtask title is the key, and value is initially set to "undone".
 * 
 * @returns {Object} - Subtasks object: { "Subtask title": "undone", ... }
 */
function collectEditedSubtasks() {
    const subtaskElements = document.querySelectorAll('.editDialogBoardSubtasksAdded li');
    const subtasks = {};
    subtaskElements.forEach(li => {
        const title = li.textContent.trim();
        if (title) {
            subtasks[title] = "undone"; // default state
        }
    });
    return subtasks;
}


/**
 * Updates the task and renders the updated task dialog.
 *
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} dueDate - Due date in YYYY-MM-DD format.
 * @param {string} priority - Task priority.
 * @param {Object} assignedTo - Assigned contacts object.
 * @param {Object} subtasks - Subtask titles with status.
 * @param {string} taskId - Task ID to update.
 * @param {Array} contacts - List of contacts to render.
 * @param {string} category - Task category.
 */
async function updateTaskAndRenderDialog(event, title, description, dueDate, priority, assignedTo, subtasks, taskId, contacts, category) {
    event.stopPropagation();
    const updatedTask = await updateTaskOnFirebase(title, description, dueDate, priority, assignedTo, subtasks, taskId);
    const overlayRef = document.getElementById("overlayBoard");
    overlayRef.innerHTML = ""; 
    overlayRef.innerHTML += getDialogTemplate(updatedTask.assignedTo, category, updatedTask.description, updatedTask.dueDate, updatedTask.priority, updatedTask.subtasks, updatedTask.title, taskId,  contacts);
    renderAssignedToIconsDetailView(updatedTask.assignedTo, `overlayTaskAssignedToContacts_${taskId}`, contacts);
    renderSubtasksDetailView(updatedTask.subtasks, `addTask_subtask_content_${taskId}`, taskId);
    const dialog = document.getElementById("dialogBoard");
    dialog.setAttribute("class", "dialogBoardFix");
    dialog.addEventListener("click", e => e.stopPropagation());
}


/**
 * Sends a PATCH request to update a task on the server.
 *
 * @param {string} title - Task title.
 * @param {string} description - Task description.
 * @param {string} dueDate - Due date in YYYY-MM-DD format.
 * @param {string} priority - Task priority.
 * @param {Object} assignedTo - Assigned contacts object.
 * @param {Object} subtasks - Subtask titles with status.
 * @param {string} taskId - Task ID to update.
 * @returns {Promise<Object>} - Updated task data.
 */
async function updateTaskOnFirebase(title, description, dueDate, priority, assignedTo, subtasks, taskId) {
    const task = { title, description, dueDate, priority, assignedTo, subtasks };
    const response = await fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: "PATCH",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    return await response.json(); 
}


/**
 * Validates the title input field for emptiness.
 * 
 * If the field is empty, it shows an error message and
 * highlights the border in red. If not, it hides the
 * error message and resets the border. Also triggers
 * validation of the save button state.
 * 
 * Called via `oninput` on the title field.
 */
function validateTitleInput() {
    const input = document.querySelector('.inputEditDialogBoardTitle');
    const errorMsg = input.nextElementSibling;
    const isEmpty = !input.value.trim();
    input.style.border = isEmpty ? '1px solid rgba(255, 129, 144, 1)' : '';
    errorMsg.classList.toggle('d_none', !isEmpty);
    validateSaveButtonState();
}


/**
 * Validates the due date input field for emptiness.
 * 
 * If the date is empty, it shows an error message and
 * highlights the border in red. If not, it hides the
 * error and resets the border. Also triggers
 * validation of the save button state.
 * 
 * Called via `oninput` on the due date field.
 */
function validateDueDateInput() {
    const input = document.querySelector('.inputEditDialogBoardDueDate');
    const errorMsg = input.nextElementSibling;
    const isEmpty = !input.value;
    input.style.border = isEmpty ? '1px solid rgba(255, 129, 144, 1)' : '';
    errorMsg.classList.toggle('d_none', !isEmpty);
    validateSaveButtonState();
}


/**
 * Validates the state of the save button based on title and due date inputs.
 * Disables the button and adds a CSS class if fields are incomplete.
 */
function validateSaveButtonState() {
    const title = document.querySelector('.inputEditDialogBoardTitle').value.trim();
    const date = document.querySelector('.inputEditDialogBoardDueDate').value;
    const button = document.getElementById('saveEditTaskButton');
    const isValid = title && date;
    button.disabled = !isValid;
    if (!isValid) {
        button.classList.add('saveEditTaskButtonDisabled');
    } else {
        button.classList.remove('saveEditTaskButtonDisabled');
    }
}