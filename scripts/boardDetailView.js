function openOverlay(event, assignedToEncoded, category, description, dueDate, priority, subtasks, title, taskId) {
    event.stopPropagation();
    let assignedTo = {};
    if (assignedToEncoded && assignedToEncoded !== 'undefined') {
        assignedTo = JSON.parse(decodeURIComponent(assignedToEncoded));
    }
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.add("overlayBoard");
    overlayRef.innerHTML += getDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId);
    renderAssignedToIconsDetailView(assignedTo, `overlayTaskAssignedToContacts_${taskId}`);
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


function renderAssignedToIconsDetailView(assignedToObj, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!assignedToObj || typeof assignedToObj !== 'object' || Object.keys(assignedToObj).length === 0) {
        return;
    }
    let names = Object.keys(assignedToObj);
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        if (assignedToObj[name]) {
            let initials = setContactInitials(name);
            let bgColor = setBackgroundcolor();
            container.innerHTML += createAssignedToIconHTMLforDetailView(name, initials, bgColor);
        }
    }
}


function closeDialog() {
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.remove("overlayBoard");
    overlayRef.innerHTML = "";
}


async function deleteTask(taskId) {
    let path = `tasks/${taskId}`;
    await fetch(BASE_URL + path + ".json", {
        method: "DELETE"
    });
    closeDialog();
    loadTasksBoard();
}





