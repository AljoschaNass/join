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