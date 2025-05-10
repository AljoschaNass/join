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