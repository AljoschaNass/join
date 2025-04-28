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
            renderSubtasksDetailView(task.subtasks);
        }
    }
    for (let status in columns) {
        if (columns[status].innerHTML === '') {
            columns[status].innerHTML = renderNoTaskCard(status);
        }
    } 
}


function formatCategory(category) {
    if (category === "User Story") {
        categoryClass = "userStory";
    } else if (category === "Technical Task") {
        categoryClass = "technicalTask";
    }
    return categoryClass;
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


function openTaskDialogFor(columnId) {
    document.getElementById("btn_add_task_create_task").setAttribute("data-column-id", columnId);
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


async function updateTaskStatus(taskId, newStatus) {
    let path = `tasks/${taskId}`; 
    await fetch(BASE_URL + path + ".json", {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus })
    });
}

