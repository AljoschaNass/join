function editTask(assignedTo, category, description, dueDate, priority, subtasks, title, taskId) {
    let dialogRef = document.getElementById("dialogBoard");
    dialogRef.innerHTML = "";
    dialogRef.innerHTML += getEditDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId);
    updatePriorityButtonClasses(priority);
}


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


function selectUrgentPriority() {
    let urgentRef = document.getElementById("urgentPriority")
    urgentRef.classList.toggle("urgentPriorityButtonSelected");
    document.getElementById("mediumPriority").classList.remove("mediumPriorityButtonSelected");
    document.getElementById("lowPriority").classList.remove("lowPriorityButtonSelected");
}


function selectMediumPriority() {
    let mediumRef = document.getElementById("mediumPriority")
    mediumRef.classList.toggle("mediumPriorityButtonSelected");
    document.getElementById("urgentPriority").classList.remove("urgentPriorityButtonSelected");
    document.getElementById("lowPriority").classList.remove("lowPriorityButtonSelected");
}


function selectLowPriority() {
    let lowRef = document.getElementById("lowPriority")
    lowRef.classList.toggle("lowPriorityButtonSelected");
    document.getElementById("urgentPriority").classList.remove("urgentPriorityButtonSelected");
    document.getElementById("mediumPriority").classList.remove("mediumPriorityButtonSelected");
}


function assignedContactToTask() {
    document.getElementById("editDialogBoardAssignedToDropDown").classList.toggle("d_none");
    document.getElementById("editDialogBoardAssignedToInput").classList.toggle("arrowDropUp")
}


function selectContactToAssignTask(event) {
    changeBackgroundColor(event);
    changeCheckbox(event);
}


function changeBackgroundColor(event) {
    const contactDiv = event.target.closest('.dropDownContacts');
    contactDiv.classList.toggle('contactChecked');
    contactDiv.classList.toggle('contactUnchecked');
    }


function changeCheckbox(event) {
    const  checkboxDiv = event.target.closest('.dropDownContacts').querySelector('.editDialogBoardAssignedToDropDownCheckbox');
    checkboxDiv.classList.toggle('contactCheckedCheckbox');
    checkboxDiv.classList.toggle('contactUncheckedCheckbox');
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


async function updateTask(title, description, dueDate, priority, taskId) {
    const task = {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority
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
    if (document.getElementById("lowPriority").classList.contains("lowPriorityButtonSelected")) {
        priority = "low";
    } else if (document.getElementById("mediumPriority").classList.contains("mediumPriorityButtonSelected")) {
        priority = "medium";
    } else if (document.getElementById("urgentPriority").classList.contains("urgentPriorityButtonSelected")) {
        priority = "urgent";
    }
    await updateTask(title, description, dueDate, priority, taskId); 
    closeDialog();
    loadTasksBoard()
}




