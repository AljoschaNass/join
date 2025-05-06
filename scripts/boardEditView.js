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
async function openEditDialog(assignedTo, category, description, dueDate, priority, subtasks, title, taskId) {
    const dialog = document.getElementById("dialogBoard");
    dialog.innerHTML = getEditDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId);
    updatePriorityButtonClasses(priority);
    setCheckedContactsFromEncoded(assignedTo);
    await loadContactListAssignedTo();
    handleClickOutsideAssignedTo();
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


function subtaskEdit(event) {
    editableListItem(event);
    changeButtons(event);
}


function changeButtons(event) {
    const editDiv = event.target.closest('.editDivSubtasks');
    editDiv.classList.add('d_none');
    editDiv.nextElementSibling.classList.remove('d_none');
    editDiv.closest('.editDialogBoardSubtasksAdded').classList.add('underline');
}


function editableListItem(event) {
    const listItem = event.target.closest('.editDivSubtasks').closest('.editDialogBoardSubtasksAdded').querySelector('li');
    listItem.setAttribute('contenteditable', true);
    listItem.classList.add('editable');
    listItem.focus();
}


function subtaskSave(event) {
    editableListItem2(event);
    changeButtons2(event);
}


function editableListItem2(event) {
    const listItem = event.target.closest('.editDivSubtasks2').closest('.editDialogBoardSubtasksAdded').querySelector('li');
    listItem.removeAttribute('contenteditable');
    listItem.classList.remove('editable');
}


function changeButtons2(event) {
    const editDiv = event.target.closest('.editDivSubtasks2');
    editDiv.classList.add('d_none'); 
    editDiv.previousElementSibling.classList.remove('d_none'); 
    editDiv.closest('.editDialogBoardSubtasksAdded').classList.remove('underline');
}


async function updateTask(title, description, dueDate, priority, assignedTo, taskId) {
    const task = {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        assignedTo: assignedTo
    };
    let response = await fetch(`${BASE_URL}tasks/${taskId}.json`, {
        method: "PATCH", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(task)
    });
    let responseToJson = await response.json();
    return responseToJson;  
}


async function saveEditTask(taskId) { 
    let title = document.getElementById("titleTask").value;
    let description = document.getElementById("inputEditDialogBoardDescription").value;
    let dueDate = document.getElementById("dueDate").value;
    let priority;
    let assignedTo = checkedContacts;
    console.log(assignedTo)
    if (document.getElementById("lowPriority").classList.contains("lowPriorityButtonSelected")) {
        priority = "low";
    } else if (document.getElementById("mediumPriority").classList.contains("mediumPriorityButtonSelected")) {
        priority = "medium";
    } else if (document.getElementById("urgentPriority").classList.contains("urgentPriorityButtonSelected")) {
        priority = "urgent";
    }
    await updateTask(title, description, dueDate, priority, assignedTo, taskId); 
    closeDialog();
    loadTasksBoard()
}






