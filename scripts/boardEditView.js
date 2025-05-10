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
 * Updates the selected state of the priority buttons 
 * based on the current priority value.
 * @param {string} priority - The selected priority ('low', 'medium', 'urgent').
 */
function updatePriorityButtonClasses(priority) {
    document.getElementById("lowPriority").classList.remove("lowPriorityButtonSelected");
    document.getElementById("mediumPriority").classList.remove("mediumPriorityButtonSelected");
    document.getElementById("urgentPriority").classList.remove("urgentPriorityButtonSelected");
    if (priority === "low") {
        document.getElementById("lowPriority").classList.add("lowPriorityButtonSelected");
    } else if (priority === "medium") {
        document.getElementById("mediumPriority").classList.add("mediumPriorityButtonSelected");
    } else if (priority === "urgent") {
        document.getElementById("urgentPriority").classList.add("urgentPriorityButtonSelected");
    }
}


/**
 * marks the medium priority button and 
 * deselects the others.
 */
function selectMediumPriority() {
    let mediumRef = document.getElementById("mediumPriority");
    mediumRef.classList.toggle("mediumPriorityButtonSelected");
    document.getElementById("urgentPriority").classList.remove("urgentPriorityButtonSelected");
    document.getElementById("lowPriority").classList.remove("lowPriorityButtonSelected");
}


/**
 * Marks the urgent priority button and unmarks the others.
 */
function selectUrgentPriority() {
    let urgentRef = document.getElementById("urgentPriority")
    urgentRef.classList.toggle("urgentPriorityButtonSelected");
    document.getElementById("mediumPriority").classList.remove("mediumPriorityButtonSelected");
    document.getElementById("lowPriority").classList.remove("lowPriorityButtonSelected");
}


/**
 * Marks the medium priority button and unmarks the others.
 */
function selectMediumPriority() {
    let mediumRef = document.getElementById("mediumPriority")
    mediumRef.classList.toggle("mediumPriorityButtonSelected");
    document.getElementById("urgentPriority").classList.remove("urgentPriorityButtonSelected");
    document.getElementById("lowPriority").classList.remove("lowPriorityButtonSelected");
}


/**
 * Marks the low priority button and unmarks the others.
 */
function selectLowPriority() {
    let lowRef = document.getElementById("lowPriority")
    lowRef.classList.toggle("lowPriorityButtonSelected");
    document.getElementById("urgentPriority").classList.remove("urgentPriorityButtonSelected");
    document.getElementById("mediumPriority").classList.remove("mediumPriorityButtonSelected");
}


/**
 * Sets the global `checkedContacts` object based on an encoded JSON string.
 * This function resets the current checked contacts and fills the object
 * with contact names marked as selected.
 *
 * @param {string} assignedToEditEncoded - A URI-encoded JSON string representing the selected contacts.
 */
function setCheckedContactsFromEncoded(assignedToEditEncoded) {
    checkedContacts = {}; // reset
    const assignedToEdit = parseAssignedToEdit(assignedToEditEncoded);
    if (!assignedToEdit) return;
    Object.keys(assignedToEdit).forEach(name => {
        checkedContacts[name] = true;
    });
}


/**
 * Decodes and parses an encoded JSON string representing selected contacts.
 *
 * @param {string} assignedToEditEncoded - A URI-encoded JSON string.
 * @returns {Object|null} The parsed object containing selected contact names as keys, or null if invalid.
 */
function parseAssignedToEdit(assignedToEditEncoded) {
    if (!assignedToEditEncoded || assignedToEditEncoded === 'undefined') return null;
    return JSON.parse(decodeURIComponent(assignedToEditEncoded));
}


/**
 * Handles click outside the "Assigned To" menu.
 */
function handleClickOutsideAssignedTo() {
    const editDialog = document.getElementById('editDialogBoard');
    editDialog.addEventListener('click', (event) => {
        if (event.target.closest('.editDialogBoardAssignedToInputDiv')) return;
        closeAssignedContactToTaskMenu();
    });
}


/**
 * Activates editing mode for a subtask item by making it editable
 * and updating the button UI to show save/delete icons.
 * 
 * @param {Event} event - The click event triggered on the edit icon.
 */
function subtaskEdit(event) {
    editableListItem(event);
    changeButtons(event);
}


/**
 * Updates the UI to hide edit/delete icons and show save/cancel options.
 * 
 * @param {Event} event - The click event from the edit icon.
 */
function changeButtons(event) {
    const editDiv = event.target.closest('.editDivSubtasks');
    editDiv.classList.add('d_none');
    editDiv.nextElementSibling.classList.remove('d_none');
    editDiv.closest('.editDialogBoardSubtasksAdded').classList.add('underline');
}


/**
 * Makes the subtask list item content editable and focuses it.
 * 
 * @param {Event} event - The click event from the edit icon.
 */
function editableListItem(event) {
    const listItem = event.target.closest('.editDivSubtasks')
        .closest('.editDialogBoardSubtasksAdded')
        .querySelector('li');
    listItem.setAttribute('contenteditable', true);
    listItem.classList.add('editable');
    listItem.focus();
}


/**
 * Saves the edited subtask by disabling content editing
 * and resetting the button UI.
 * 
 * @param {Event} event - The click event from the save icon.
 */
function subtaskSave(event) {
    editableListItem2(event);
    changeButtons2(event);
}


/**
 * Disables editing on the subtask list item.
 * 
 * @param {Event} event - The click event from the save icon.
 */
function editableListItem2(event) {
    const listItem = event.target.closest('.editDivSubtasks2')
        .closest('.editDialogBoardSubtasksAdded')
        .querySelector('li');
    listItem.removeAttribute('contenteditable');
    listItem.classList.remove('editable');
}


/**
 * Updates the UI to show edit/delete icons again
 * and hide save/cancel options.
 * 
 * @param {Event} event - The click event from the save icon.
 */
function changeButtons2(event) {
    const editDiv = event.target.closest('.editDivSubtasks2');
    editDiv.classList.add('d_none'); 
    editDiv.previousElementSibling.classList.remove('d_none'); 
    editDiv.closest('.editDialogBoardSubtasksAdded').classList.remove('underline');
}


/**
 * Decodes a URL-encoded JSON string of subtasks and renders them in the edit dialog.
 * Only the titles of the subtasks (keys) are displayed.
 * 
 * @param {string} subtasksEncoded - The URL-encoded JSON string containing subtasks.
 */
function renderEditDialogSubtasksFromEncoded(subtasksEncoded) {
    const parsed = JSON.parse(decodeURIComponent(subtasksEncoded));
    if (!parsed) return;
    const subtaskTitles = Object.keys(parsed);
    const container = document.getElementById("subtasksContentEditView");
    subtaskTitles.forEach(title => {
        container.innerHTML += createEditTaskSubTaskHTML(title);
    });
}


/**
 * Clears the input field relative to the clicked clear icon.
 * @param {Event} event - The click event.
 */
function clearSubtasksInputEditTaskView(event) {
    const container = event.target.closest('.editDialogBoardSubtasksInput');
    const input = container?.querySelector('input');
    if (input) input.value = '';
}


/**
 * Adds a new subtask to the edit task view if the input is not empty.
 */
function addSubtasksEditTaskView() {
    const inputRef = document.getElementById("subtaskInputEditView");
    const subtaskValue = inputRef.value.trim();
    if (!subtaskValue) return;

    const container = document.getElementById("subtasksContentEditView");
    container.innerHTML += createEditTaskSubTaskHTML(subtaskValue);
    inputRef.value = '';
}


/**
 * Deletes a subtask from the DOM when the delete icon is clicked.
 * Works for both normal and edit modes.
 * 
 * @param {Event} event - The click event triggered by the delete icon.
 */
function deleteSubtaskBoard(event) {
    const subtaskContainer = event.target.closest('.editDialogBoardSubtasksAdded');
    if (subtaskContainer) {
        subtaskContainer.remove();
    }
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