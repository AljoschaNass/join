function openOverlay(event, assignedTo, category, description, dueDate, priority, subtasks, title, taskId) {
    event.stopPropagation();
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.add("overlayBoard");
    overlayRef.innerHTML += getDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId);
    const dialogElement = document.getElementById("dialogBoard");
    dialogElement.addEventListener("click", (event) => {
    event.stopPropagation(); 
    });    
}

function closeDialog() {
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.remove("overlayBoard");
    overlayRef.innerHTML = "";
}

function editTask(assignedTo, category, description, dueDate, priority, subtasks, title, taskId) {
    let dialogRef = document.getElementById("dialogBoard");
    dialogRef.innerHTML = "";
    dialogRef.innerHTML += getEditDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId);
    updatePriorityButtonClasses(priority);
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

function saveNewTaskData() {
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.remove("overlayBoard");
    overlayRef.innerHTML = "";
}

function createNewTask(event, status) {
    event.stopPropagation();
    let dialogRef = document.getElementById("overlayBoardAddTask");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    dialogRef.classList.remove("d_none");
    dialogRef.classList.add("overlayBoard");
    const dialogElement = document.getElementById("addTaskDialogBoard");
    dialogRef.setAttribute('status', status);
    dialogElement.addEventListener("click", (event) => {
    event.stopPropagation(); 
    }); 
}

async function renderW3AddTaskTemplate() {
    const res = await fetch('../assets/templates/addTaskTemplate.html');
    const html = await res.text(); 
    let dialogRef = document.getElementById("overlayBoardAddTask");
    dialogRef.classList.add("d_none")
    dialogRef.innerHTML += getAddTaskDialogTemplate(html);
    w3.includeHTML(); 

}

function closeDialogAddTask() {
    let overlayRef = document.getElementById("overlayBoardAddTask");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.add("d_none");
}

function subtaskEdit(event) {
    editableListItem(event);
    changeButtons(event);
}

function editableListItem(event) {
    const listItem = event.target.closest('.editDivSubtasks').closest('.editDialogBoardSubtasksAdded').querySelector('li');
    listItem.setAttribute('contenteditable', true);
    listItem.classList.add('editable');
    listItem.focus();
}

function changeButtons(event) {
    const editDiv = event.target.closest('.editDivSubtasks');
    editDiv.classList.add('d_none');
    editDiv.nextElementSibling.classList.remove('d_none');
    editDiv.closest('.editDialogBoardSubtasksAdded').classList.add('underline');
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

function allowDrop(ev) {
    ev.preventDefault();
}

function dragStart(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
    const taskContainers = Array.from(document.querySelectorAll('#toDoTask, #inProgressTask, #awaitFeedbackTask, #doneTask'));
    const currentContainer = ev.target.closest('#toDoTask, #inProgressTask, #awaitFeedbackTask, #doneTask');
    const index = taskContainers.indexOf(currentContainer);
    dragAreaHighlight = document.createElement('div');
    dragAreaHighlight.classList.add('dragAreaHighlight');
    if (taskContainers[index - 1]) {
        taskContainers[index - 1].appendChild(dragAreaHighlight.cloneNode());
    }
    if (taskContainers[index + 1]) {
        taskContainers[index + 1].appendChild(dragAreaHighlight.cloneNode());
    }
}

function dragEnd() {
    document.querySelectorAll('.dragAreaHighlight').forEach(el => el.remove());
    loadTasksBoard();
}

function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(id);
    const dropZone = ev.currentTarget;
    const newStatus = dropZone.id; 
    const taskId = draggedElement.id; 
    updateTaskStatus(taskId, newStatus);
    dropZone.appendChild(draggedElement);
    dragEnd(); 
}

async function getAllTasks() {
    let path = "tasks";
    let response = await fetch(BASE_URL + path + ".json");   
    return responseToJson = await response.json();
}

async function loadTasksBoard() {
    let tasks = await getAllTasks();
    const columns = {
        "toDoTask": document.getElementById('toDoTask'),
        "inProgressTask": document.getElementById('inProgressTask'),
        "awaitFeedbackTask": document.getElementById('awaitFeedbackTask'),
        "doneTask": document.getElementById('doneTask')
    };
    for (let key in columns) {
        columns[key].innerHTML = '';
    }
    for (let taskId in tasks) {
        let task = tasks[taskId];
        if (columns[task.status]) {
            columns[task.status].innerHTML += renderTaskCard(task.assignedTo, task.category, task.description, task.dueDate, task.priority, task.subtasks, task.title, taskId);
            renderAssignedToIcons(task.assignedTo, `cardsAssignedTo_${taskId}`);
        }
    }
    for (let status in columns) {
        if (columns[status].innerHTML === '') {
            columns[status].innerHTML = renderNoTaskCard(status);
        }
    }
    
}

async function updateTaskStatus(taskId, newStatus) {
    let path = `tasks/${taskId}`; 
    await fetch(BASE_URL + path + ".json", {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
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

function openTaskDialogFor(columnId) {
    document.getElementById("btn_add_task_create_task").setAttribute("data-column-id", columnId);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function formatCategory(category) {
    if (category === "User Story") {
        categoryClass = "userStory";
    } else if (category === "Technical Task") {
        categoryClass = "technicalTask";
    }
    return categoryClass;
}

function formatPriorityImg(priority) {
    let priorityImg = "";

    switch (priority) {
        case "low":
            priorityImg = "priorityLow"; 
            break;
        case "medium":
            priorityImg = "priorityMedium";
            break;
        case "urgent":
            priorityImg= "priorityUrgent";
            break;
    }
    return priorityImg;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

function renderAssignedToIcons(assignedToObj, containerId) {
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
            container.innerHTML += createAssignedToIconHTML(initials, bgColor);
        }
    }
}


