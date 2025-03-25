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
    unselectPriority();
    let urgentRef = document.getElementById("urgentPriority")
    urgentRef.classList.add("urgentPriorityButtonSelected");
}

function selectMediumPriority() {
    unselectPriority();
    let mediumRef = document.getElementById("mediumPriority")
    mediumRef.classList.add("mediumPriorityButtonSelected");
}

function selectLowPriority() {
    unselectPriority();
    let lowRef = document.getElementById("lowPriority")
    lowRef.classList.add("lowPriorityButtonSelected");
}

function unselectPriority () {
    document.getElementById("urgentPriority").classList.remove("urgentPriorityButtonSelected");
    document.getElementById("mediumPriority").classList.remove("mediumPriorityButtonSelected");
    document.getElementById("lowPriority").classList.remove("lowPriorityButtonSelected");
}