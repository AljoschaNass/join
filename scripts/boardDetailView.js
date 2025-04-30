function openOverlay(event, assignedToEncoded, category, description, dueDate, priority, subtasksEncoded, title, taskId, contactsObjEncoded) {
    event.stopPropagation();
    let assignedTo = {};
    if (assignedToEncoded && assignedToEncoded !== 'undefined') {
        assignedTo = JSON.parse(decodeURIComponent(assignedToEncoded));
    }
    let subtasks = {};
    if (subtasksEncoded && subtasksEncoded !== 'undefined') {
        subtasks = JSON.parse(decodeURIComponent(subtasksEncoded));
    }
    let contacts = {};
    if (contactsObjEncoded && contactsObjEncoded !== 'undefined') {
        contacts = JSON.parse(decodeURIComponent(contactsObjEncoded));
    }
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.add("overlayBoard");
    overlayRef.innerHTML += getDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId, contacts);
    renderAssignedToIconsDetailView(assignedTo, `overlayTaskAssignedToContacts_${taskId}`, contacts);
    renderSubtasksDetailView(subtasks, `addTask_subtask_content_${taskId}`, taskId);
    const dialogElement = document.getElementById("dialogBoard");
    dialogElement.addEventListener("click", (event) => {
        event.stopPropagation(); 
    });    
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}


function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


function renderAssignedToIconsDetailView(assignedToObj, containerId, contacts) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!assignedToObj || typeof assignedToObj !== 'object' || Object.keys(assignedToObj).length === 0) {
        return;
    }
    let names = Object.keys(assignedToObj);
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        if (assignedToObj[name]) {
            let email = '';
            for (let contactKey in contacts) {
                if (contacts[contactKey].name === name) {
                    email = contacts[contactKey].email;
                    break; 
                }
            }
            let nameWithYou = `${name} ${isItMyEmail(email)}`;
            let initials = setContactInitials(name);
            let bgColor = getContactBackgroundColor(name, contacts);
            container.innerHTML += createAssignedToIconHTMLforDetailView(nameWithYou, initials, bgColor);
        }
    }
}



function renderSubtasksDetailView(subtasksObj, containerIdS, taskId) {
    const container = document.getElementById(containerIdS);
    container.innerHTML = '';
    if (!subtasksObj || typeof subtasksObj !== 'object' || Object.keys(subtasksObj).length === 0) {
        document.getElementById('subtasksDialog').classList.add('d_none');
        return;
    }
    for (let [title, status] of Object.entries(subtasksObj)) {
        container.innerHTML += createSubTaskHTML(title, status, taskId);
    }
}



function closeDialog(taskId) {
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.remove("overlayBoard");
    let subtasks = {};  
    const subtasksElements = document.querySelectorAll(`#addTask_subtask_content_${taskId} .overlayTaskSubtasks input`);
    subtasksElements.forEach(subtask => {
        const title = subtask.nextElementSibling.nextElementSibling.textContent;  
        const isChecked = subtask.checked ? "done" : "undone";
        subtasks[title] = isChecked; 
    });
    loadTasksBoard();
    overlayRef.innerHTML = "";
}


async function updateSubtasksInDatabase(taskId, title, isChecked) {
    const newStatus = isChecked ? "done" : "undone";
    const path = `tasks/${taskId}/subtasks`;
    let response = await fetch(BASE_URL + path + ".json");
    let subtasks = await response.json();
    if (!subtasks) {
        subtasks = {}; 
    }
    subtasks[title] = newStatus;
    await fetch(BASE_URL + path + ".json", {
        method: "PUT",
        body: JSON.stringify(subtasks), 
        headers: {
            "Content-Type": "application/json",
        },
    });
}


async function deleteTask(taskId) {
    let path = `tasks/${taskId}`;
    await fetch(BASE_URL + path + ".json", {
        method: "DELETE"
    });
    closeDialog();
    loadTasksBoard();
}





