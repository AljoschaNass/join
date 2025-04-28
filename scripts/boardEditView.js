function editTask(assignedTo, category, description, dueDate, priority, subtasks, title, taskId) {
    let dialogRef = document.getElementById("dialogBoard");
    dialogRef.innerHTML = "";
    dialogRef.innerHTML += getEditDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId);
    updatePriorityButtonClasses(priority);
    loadContactListAssignedTo();
    setTimeout(function() {
        loadAssignedContacts(assignedTo);
    }, 100);  // 100ms warten, bis loadContactListAssignedTo ausgeführt ist
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


function selectContactToAssignTask(event) {
    changeBackgroundColor(event);
    changeCheckbox(event);
    checkIfContactChecked(event, index);
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



function getContactIndex(contactName) {
    // Hier kannst du die Logik anpassen, um den Index basierend auf dem Namen zu bestimmen
    // Zum Beispiel könnte es ein Index in einem Array sein, oder du kannst ihn auf Basis des Namens ermitteln
    // Hier wird angenommen, dass der Index einfach die Reihenfolge der Namen in einer Liste widerspiegelt.
    let contactNames = ["Anton Mayer", "Sarah Schmidt", "John Doe"];  // Beispiel-Namen-Liste
    return contactNames.indexOf(contactName); // Gibt den Index des Namens in der Liste zurück
}

function loadAssignedContacts(assignedToEditEncoded, taskId) {
    let assignedToEdit = parseAssignedToEdit(assignedToEditEncoded);
    if (!assignedToEdit) return;

    const contactDivs = getContactDivs();
    if (!contactDivs) return;

    contactDivs.forEach(contactDiv => {
        let contactName = getContactName(contactDiv);
        if (assignedToEdit[contactName]) {
            markContactAsChecked(contactDiv);
            let index = getContactIndex(contactDiv);
            handleContactCheckbox(contactDiv, index);
        }
    });
}


function parseAssignedToEdit(assignedToEditEncoded) {
    if (!assignedToEditEncoded || assignedToEditEncoded === 'undefined') return null;
    return JSON.parse(decodeURIComponent(assignedToEditEncoded));
}


function getContactDivs() {
    const contactDivs = document.querySelectorAll('#editDialogBoardAssignedToDropDown .dropDownContacts');
    return contactDivs.length ? contactDivs : null;
}


function getContactName(contactDiv) {
    let contactNameElement = contactDiv.querySelector('.dropDownContact p');
    return contactNameElement ? contactNameElement.textContent.trim() : '';
}


function markContactAsChecked(contactDiv) {
    contactDiv.classList.add('contactChecked');
}


function getContactIndex(contactDiv) {
    return contactDiv.id.replace('addTask_assignedTo_contact_', '');
}


function handleContactCheckbox(contactDiv, index) {
    let event = { target: contactDiv };
    checkIfContactChecked(event, index);
    changeCheckbox(event);
}


