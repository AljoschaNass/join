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
    dialogRef.innerHTML += geteditDialogTemplate();
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

async function createNewTask(event) {
    event.stopPropagation();
    let dialogRef = document.getElementById("overlayBoard");
    dialogRef.innerHTML = "";
    dialogRef.classList.add("overlayBoard");
    const res = await fetch('../assets/templates/addTaskTemplate.html');
    const html = await res.text(); 
    dialogRef.innerHTML += getAddTaskDialogTemplate(html);
    w3.includeHTML();
    const dialogElement = document.getElementById("addTaskDialogBoard");
    dialogElement.addEventListener("click", (event) => {
    event.stopPropagation(); 
    }); 
}

function subtaskEdit(event) {
    const listItem = event.target.closest('.editDialogBoardSubtasksAdded').querySelector('li');
    
    // Macht das li-Element editierbar
    listItem.setAttribute('contenteditable', true);
    listItem.classList.add('editable'); // Füge eine Klasse hinzu
    listItem.focus();
    document.getElementById("editIcon1").classList.add("d_none");
    document.getElementById("editIcon3").classList.add("d_none");
    document.getElementById("editIcon2").classList.remove("d_none");
    document.getElementById("editIcon4").classList.remove("d_none");
    document.getElementById("editIcon5").classList.remove("d_none");
}

