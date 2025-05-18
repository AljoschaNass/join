let currentPriority = "medium";
let currentSubtasks = {};
let subtaskId = 0;


document.addEventListener("click", function(event) {
    closeAssignedToByClickNextToIt(event);
    closeCategoryByClickNextToIt(event);
});


function clearInput(id) {
    const inputRef = document.getElementById(id);
    if (inputRef) {
        inputRef.value = "";
    }
}


function setBtnPriority(priority) {
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


function resetBtnPriority() {
    removeAllPriosityBg();
    currentPriority = "medium";
    let priorityRef = document.getElementById("add_task_btn_priority_medium");
    priorityRef.classList.add("priority_color_medium");
}


function removeAllPriosityBg() {
    document.getElementById("add_task_btn_priority_urgent").classList.remove("priority_color_urgent");
    document.getElementById("add_task_btn_priority_medium").classList.remove("priority_color_medium");
    document.getElementById("add_task_btn_priority_low").classList.remove("priority_color_low");
}


function checkRequiredBtnAddTask() {
    checkRequiredTitel();
    checkRequiredDate();
    checkRequiredCategory(); 
}


function resetRequiredIputs() {
    let titleRequiredRef = document.getElementById("add_task_required_title");
    let dateRequiredRef = document.getElementById("add_task_required_date");
    let categoryRequiredRef = document.getElementById("add_task_required_category");

    titleRequiredRef.innerText = "";
    dateRequiredRef.innerText = "";
    categoryRequiredRef.innerText = "";
}


function checkRequiredTitel() {
    let titleRef = document.getElementById("add_task_title").value;
    let titleRequiredRef = document.getElementById("add_task_required_title");

    if (titleRef == "") {
        titleRequiredRef.innerText = "This field is required";
    } else {
        titleRequiredRef.innerText = "";
    }
}


function checkRequiredDate() {
    let dateRef = document.getElementById("add_task_date").value;
    let dateRequiredRef = document.getElementById("add_task_required_date");

    if (dateRef == "") {
        dateRequiredRef.innerText = "This field is required";
    } else {
        dateRequiredRef.innerText = "";
    }
}


function checkRequiredCategory() {
    let categoryRef = document.getElementById("addTaskCategoryInput").value;
    let categoryRequiredRef = document.getElementById("add_task_required_category");

    if (categoryRef == "") {
        categoryRequiredRef.innerText = "This field is required";
    } else {
        categoryRequiredRef.innerText = "";
    }
}


function arrowDropDownSelection(id) {
    document.getElementById(id + "DropDown").classList.toggle("d_none");
    document.getElementById(id + "Input").classList.toggle("arrowDropUp")
}


function addTaskselectCategory(category) {
    document.getElementById("addTaskCategoryInput").value = category;
    checkRequiredCategory();
    arrowDropDownSelection('addTaskCategory');
}


async function postTask(path="tasks", title, description, dueDate, priority, assignedTo, category, subtasks, status) {
    let task = {
        'title': title, 
        'description': description,
        'dueDate': dueDate,
        'priority': priority,
        'assignedTo': assignedTo,
        'category': category,
        'subtasks': subtasks,
        'status': status
    };
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(task)
    });
    let responseToJson = await response.json();
    return responseToJson;
}


async function addTask(status) { 
    let title = document.getElementById("add_task_title").value;
    let description = document.getElementById("add_task_description").value;
    let dueDate = document.getElementById("add_task_date").value;
    let priority = currentPriority;
    let assignedTo = checkedContacts;
    let category = document.getElementById("addTaskCategoryInput").value;
    let subtasks = currentSubtasks;
    document.getElementById("taskAdded").classList.remove("d_none");

    if(title != "" && dueDate != "" && category != "") {
        await postTask("tasks", title, description, dueDate, priority, assignedTo, category, subtasks, status); 
        setTimeout(() => {
            window.location.href = "./board.html";
        }, 1000);
        clearAddTaskForm();
    }
}


function clearAddTaskForm() {
    document.getElementById("add_task_title").value = "";
    document.getElementById("add_task_description").value = "";
    document.getElementById("add_task_date").value = "";
    resetBtnPriority();
    resetAssignedToContacts();
    document.getElementById("addTaskCategoryInput").value = "";
    deleteAllSubtasks();
    resetRequiredIputs();
    let createTaskBtn = document.getElementById("btn_add_task_create_task");
    diableCreateTaskButton(createTaskBtn);
}


function enableCreateTaskButton() {
    let titleRef = document.getElementById("add_task_title").value;
    let dateRef = document.getElementById("add_task_date").value;
    let categoryRef = document.getElementById("addTaskCategoryInput").value;
    let createTaskBtn = document.getElementById("btn_add_task_create_task");
    diableCreateTaskButton(createTaskBtn);
    if (titleRef != "" && dateRef != "" && categoryRef != "") {
        createTaskBtn.disabled = false;
        createTaskBtn.classList.add("btn_create_enabled");
    }
}


function diableCreateTaskButton(createTaskBtn) {
    createTaskBtn.disabled = true;
    createTaskBtn.classList.remove("btn_create_enabled");
}


function addSubtask() {
    let inputRef = document.getElementById("add_task_subtask");   
    let subtaskValue = inputRef.value.trim();
    let id = `subtask_${subtaskId++}`;

    if (subtaskValue !== "" && !currentSubtasks.hasOwnProperty(subtaskValue)) {
        currentSubtasks[subtaskValue] = "undone";
        renderSubtask(id, subtaskValue);
        inputRef.value = "";
    }
}


function renderSubtask(id, subtaskValue) {
    let contentRef = document.getElementById("addTask_subtask_content");
    contentRef.innerHTML += getSubtaskTemplate(id, subtaskValue);
}


function clearSubtaskInput() {
    document.getElementById("add_task_subtask").value = "";
}


function deleteSubtask(id) {
    delete currentSubtasks[id];
    const subtaskDiv = document.getElementById(id);
    if (subtaskDiv) {
        subtaskDiv.remove();
    }    
}


function deleteAllSubtasks() {
    currentSubtasks = {};
    document.getElementById("addTask_subtask_content").innerHTML = "";
}


function closeCategoryByClickNextToIt(event) {
    const categoryInput = document.getElementById("addTaskCategoryInput");
    const categoryDropdown = document.getElementById("addTaskCategoryDropDown");
    const isClickInsideCategory = categoryInput.contains(event.target) || categoryDropdown.contains(event.target);
    if (!isClickInsideCategory) {
        if (!categoryDropdown.classList.contains("d_none")) {
            arrowDropDownSelection('addTaskCategory');
        }
    }
}