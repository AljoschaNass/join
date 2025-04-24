
let currentPriority = "";
let counterContactIcons = 0;
let checkedContacts = {};
let currentContacts = [];


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
    let subtasks = document.getElementById("add_task_subtask").value;
    document.getElementById("taskAdded").classList.remove("d_none");

    if(title != "" && dueDate != "" && category != "") {
        await postTask("tasks", title, description, dueDate, priority, assignedTo, category, subtasks, status); 
        setTimeout(() => {
            window.location.href = "./board.html";
        }, 1000);
    }
}


function clearAddTaskForm() {
    document.getElementById("add_task_title").value = "";
    document.getElementById("add_task_description").value = "";
    document.getElementById("add_task_date").value = "";
    removeAllPriosityBg();
    currentPriority = "";
    document.getElementById("addTaskAssignedToInput").value = "";
    document.getElementById("addTaskCategoryInput").value = "";
    document.getElementById("add_task_subtask").value = "";

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
    renderSubtask();
}

function renderSubtask() {
    let contentRef = document.getElementById("addTask_subtask_content");
    contentRef.innerHTML += getSubtaskTemplate();
}


function clearSubtaskInput() {
    document.getElementById("add_task_subtask").value = "";
}


//function editSubtask() {}


//function deleteSubtask(id) {}


async function loadContactListAssignedTo() {
    let contacts = await getAllContacts(); 
    let sortedContacts = sortContactsAlphabetically(contacts);
    renderContactsToAssignedTo(sortedContacts);
    saveCurrentContacts(sortedContacts);
}

function saveCurrentContacts(contacts) {
    currentContacts = contacts;
}

function renderContactsToAssignedTo(contacts) {
    let assignedToDropDownRef = document.getElementById("editDialogBoardAssignedToDropDown");
    assignedToDropDownRef.innerHTML = "";

    let assignedToIcons = document.getElementById("addTask_assignedToIcons");
    assignedToIcons.innerHTML = "";
    
    Object.entries(contacts).forEach(([key, contact], index) => {
        let bgClass = setBackgroundcolor();
        assignedToDropDownRef.innerHTML += getAssignedToContactTemplate(contact.name, setContactInitials(contact.name), index, bgClass);
        assignedToIcons.innerHTML += getAssignedToContactIconTemplate(setContactInitials(contact.name), index, bgClass);
    });
}

function toggleAssignedContactToTaskMenu() {
    document.getElementById("editDialogBoardAssignedToDropDown").classList.toggle("d_none");
    document.getElementById("addTaskAssignedToInput").classList.toggle("arrowDropUp");
    document.getElementById("addTask_assignedToIcons").classList.toggle("d_none");
}

function addTaskselectContactToAssignTask(event, index) {
    changeBackgroundColor(event);
    changeCheckbox(event);
    checkIfContactChecked(event, index);
}

function checkIfContactChecked(event, index) {
    const contactDiv = event.target.closest('.dropDownContacts');
    let isChecked = contactDiv.classList.contains('contactChecked');
    let iconRef = document.getElementById("addTask_assignedTo_contactIcon_" + index);
    let contactRef = document.getElementById("addTask_assignedTo_contact_" + index).querySelector('.dropDownContact p').textContent;

    if (isChecked) {    
        iconRef.classList.remove("d_none");
        checkedContacts[contactRef] = true;   
        counterContactIcons++;        
    } else {
        iconRef.classList.add("d_none");
        delete checkedContacts[contactRef];
        counterContactIcons--;
    }    
}

function searchContactAssignedTo() {
    let searchInputRef = document.getElementById("addTaskAssignedToInput").value.toLowerCase();

    let filteredContacts = Object.entries(currentContacts).filter(([key, contact]) =>
        contact.name.toLowerCase().includes(searchInputRef)
    );
    renderContactsToAssignedTo(Object.fromEntries(filteredContacts));
}