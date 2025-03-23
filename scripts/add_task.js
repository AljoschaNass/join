
let currentPriority = "";

function setBtnPriority(priority) {
    console.log(currentPriority);

    if (currentPriority == priority) {
        removeAllPriosityBg();
        currentPriority = "";
    } else{
        removeAllPriosityBg();
        let priorityRef = document.getElementById("add_task_btn_priority_" + priority);
        priorityRef.classList.add("priority_color_" + priority);
        currentPriority = priority;
    }
}

function removeAllPriosityBg() {
    document.getElementById("add_task_btn_priority_urgent").classList.remove("priority_color_urgent");
    document.getElementById("add_task_btn_priority_medium").classList.remove("priority_color_medium");
    document.getElementById("add_task_btn_priority_low").classList.remove("priority_color_low");
}