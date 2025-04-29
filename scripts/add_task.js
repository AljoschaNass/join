
let currentPriority = "";
let counterContactIcons = 0;
let checkedContacts = {};
let currentSubtasks = {};
let subtaskId = 0;
let currentContacts = [];

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
    removeAllPriosityBg();
    currentPriority = "";
    resetAssignedToContacts();
    document.getElementById("addTaskCategoryInput").value = "";
    deleteAllSubtasks();

    resetRequiredIputs();

    let createTaskBtn = document.getElementById("btn_add_task_create_task");
    diableCreateTaskButton(createTaskBtn);
}

function resetAssignedToContacts() {
    checkedContacts = {};
    hideAssignedToIcons();
    resetContactSelections();
    clearInput("addTaskAssignedToInput");
    closeAssignedContactToTaskMenu();
}

function hideAssignedToIcons() {
    const iconElements = document.querySelectorAll("[id^='addTask_assignedTo_contactIcon_']");
    iconElements.forEach(icon => {
        icon.classList.add("d_none");
    });
}

function resetContactSelections() {
    const contactElements = document.querySelectorAll(".dropDownContacts");
    contactElements.forEach(el => {
        el.classList.remove("contactChecked");
        el.classList.add("contactUnchecked");

        const checkbox = el.querySelector(".editDialogBoardAssignedToDropDownCheckbox");
        if (checkbox) {
            checkbox.classList.remove("contactCheckedCheckbox");
            checkbox.classList.add("contactUncheckedCheckbox");
        }
    });
}

function deleteAllSubtasks() {
    currentSubtasks = {};
    document.getElementById("addTask_subtask_content").innerHTML = "";
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

    if (subtaskValue !== "") {
        currentSubtasks[id] = { text: subtaskValue, status: "undone" };
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
        assignedToDropDownRef.innerHTML += getAssignedToContactTemplate(contact.name, setContactInitials(contact.name), index, contact.backgroundcolor);
        assignedToIcons.innerHTML += getAssignedToContactIconTemplate(setContactInitials(contact.name), index, contact.backgroundcolor);        
    });
    renderNoContactsToAssignedTo();
}

function renderNoContactsToAssignedTo() {
    let assignedToDropDownRef = document.getElementById("editDialogBoardAssignedToDropDown");
    assignedToDropDownRef.innerHTML += getNoContactAssignedTo();
}

document.addEventListener("click", function(event) {
    closeAssignedToByClickNextToIt(event);
    closeCategoryByClickNextToIt(event);
});

function closeAssignedToByClickNextToIt(event) {
    const assignedInput = document.getElementById("addTaskAssignedToInput");
    const assignedDropdown = document.getElementById("editDialogBoardAssignedToDropDown");

    const isClickInsideAssigned =
        assignedInput.contains(event.target) || assignedDropdown.contains(event.target);
    
    if (!isClickInsideAssigned) {
        closeAssignedContactToTaskMenu();
    }
}

function closeCategoryByClickNextToIt(event) {
    const categoryInput = document.getElementById("addTaskCategoryInput");
    const categoryDropdown = document.getElementById("addTaskCategoryDropDown");

    const isClickInsideCategory =
        categoryInput.contains(event.target) || categoryDropdown.contains(event.target);
    
    if (!isClickInsideCategory) {
        if (!categoryDropdown.classList.contains("d_none")) {
            arrowDropDownSelection('addTaskCategory');
        }
    }
}

function openAssignedContactToTaskMenu() {
    document.getElementById("editDialogBoardAssignedToDropDown").classList.remove("d_none");
    document.getElementById("addTaskAssignedToInput").classList.remove("arrowDropUp");
    document.getElementById("addTask_assignedToIcons").classList.add("d_none");
}

function closeAssignedContactToTaskMenu() {
    document.getElementById("addTaskAssignedToInput").value = "";
    searchContactAssignedTo();
    document.getElementById("editDialogBoardAssignedToDropDown").classList.add("d_none");
    document.getElementById("addTaskAssignedToInput").classList.add("arrowDropUp");
    document.getElementById("addTask_assignedToIcons").classList.remove("d_none");
}

function toggleAssignedContactToTaskMenu() {
    document.getElementById("addTaskAssignedToInput").value = "";
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
    openAssignedContactToTaskMenu();
    let filteredContacts = Object.entries(currentContacts).filter(([key, contact]) =>
        contact.name.toLowerCase().includes(searchInputRef)
    );
    renderContactsToAssignedTo(Object.fromEntries(filteredContacts));

    if(filteredContacts.length == 0) {
        document.getElementById("addTask_assignedTo_no_contact").classList.remove("d_none");
    } else {
        document.getElementById("addTask_assignedTo_no_contact").classList.add("d_none");
    }
}