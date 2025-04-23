function openOverlay(event, index) {
    event.stopPropagation();
    let overlayRef = document.getElementById("overlayBoard");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.add("overlayBoard");
    overlayRef.innerHTML += getDialogTemplate(index);
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

function editTask() {
    let dialogRef = document.getElementById("dialogBoard");
    dialogRef.innerHTML = "";
    dialogRef.innerHTML += getEditDialogTemplate();
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

function openTaskDialogFor(columnId) {
    document.getElementById("btn_add_task_create_task").setAttribute("data-column-id", columnId);
}