let currentPriority = "medium";
let currentSubtasks = {};
let subtaskId = 0;


/**
 * Adds a global click event listener to the document.
 * Closes the "Assigned To" and "Category" dropdowns if the user clicks outside of them.
 *
 * @param {MouseEvent} event - The mouse click event triggered by the user.
 */
document.addEventListener("click", function(event) {
    closeAssignedToByClickNextToIt(event);
    closeCategoryByClickNextToIt(event);
});


/**
 * Clears the value of an input element by its ID.
 *
 * @param {string} id - The ID of the input element to be cleared.
 */
function clearInput(id) {
    const inputRef = document.getElementById(id);
    if (inputRef) {
        inputRef.value = "";
    }
}


/**
 * Sets the current task priority.
 * If the selected priority is already active, it resets the selection.
 * Otherwise, it applies the selected priority and updates the button styling.
 *
 * @param {string} priority - The priority level to be set ('urgent', 'medium', or 'low').
 */
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


/**
 * Resets the task priority to the default value ("medium").
 * Clears all priority button styles and highlights the "medium" priority button.
 */
function resetBtnPriority() {
    removeAllPriosityBg();
    currentPriority = "medium";
    let priorityRef = document.getElementById("add_task_btn_priority_medium");
    priorityRef.classList.add("priority_color_medium");
}


/**
 * Removes all background highlight classes from the priority buttons.
 * Ensures that no priority button remains visually selected.
 */
function removeAllPriosityBg() {
    document.getElementById("add_task_btn_priority_urgent").classList.remove("priority_color_urgent");
    document.getElementById("add_task_btn_priority_medium").classList.remove("priority_color_medium");
    document.getElementById("add_task_btn_priority_low").classList.remove("priority_color_low");
}


/**
 * Triggers validation checks for all required input fields
 * before allowing the task to be added.
 * Checks title, date, and category fields.
 */
function checkRequiredBtnAddTask() {
    checkRequiredTitel();
    checkRequiredDate();
    checkRequiredCategory(); 
}


/**
 * Resets the error messages for all required input fields.
 * Clears the validation text for title, date, and category.
 */
function resetRequiredIputs() {
    let titleRequiredRef = document.getElementById("add_task_required_title");
    let dateRequiredRef = document.getElementById("add_task_required_date");
    let categoryRequiredRef = document.getElementById("add_task_required_category");

    titleRequiredRef.innerText = "";
    dateRequiredRef.innerText = "";
    categoryRequiredRef.innerText = "";
}


/**
 * Checks if the task title input is empty.
 * If empty, displays a required field message.
 * Otherwise, clears the message.
 */
function checkRequiredTitel() {
    let titleRef = document.getElementById("add_task_title").value;
    let titleRequiredRef = document.getElementById("add_task_required_title");

    if (titleRef == "") {
        titleRequiredRef.innerText = "This field is required";
    } else {
        titleRequiredRef.innerText = "";
    }
}


/**
 * Checks if the task date input is empty.
 * If empty, displays a required field message.
 * Otherwise, clears the message.
 */
function checkRequiredDate() {
    let dateRef = document.getElementById("add_task_date").value;
    let dateRequiredRef = document.getElementById("add_task_required_date");

    if (dateRef == "") {
        dateRequiredRef.innerText = "This field is required";
    } else {
        dateRequiredRef.innerText = "";
    }
}


/**
 * Checks if the task category input is empty.
 * If empty, displays a required field message.
 * Otherwise, clears the message.
 */
function checkRequiredCategory() {
    let categoryRef = document.getElementById("addTaskCategoryInput").value;
    let categoryRequiredRef = document.getElementById("add_task_required_category");

    if (categoryRef == "") {
        categoryRequiredRef.innerText = "This field is required";
    } else {
        categoryRequiredRef.innerText = "";
    }
}


/**
 * Toggles the visibility of the dropdown menu and the arrow direction for a given element ID.
 * @param {string} id - The base ID of the dropdown and input elements to toggle.
 */
function arrowDropDownSelection(id) {
    document.getElementById(id + "DropDown").classList.toggle("d_none");
    document.getElementById(id + "Input").classList.toggle("arrowDropUp")
}


/**
 * Sets the selected category value in the category input field,
 * checks if the category field is valid, and toggles the dropdown menu.
 * @param {string} category - The category to set as selected.
 */
function addTaskselectCategory(category) {
    document.getElementById("addTaskCategoryInput").value = category;
    checkRequiredCategory();
    arrowDropDownSelection('addTaskCategory');
}


/**
 * Sends a new task object to the backend API using a POST request.
 * @param {string} [path="tasks"] - The API path to post the task to.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} dueDate - The due date of the task.
 * @param {string} priority - The priority level of the task.
 * @param {Array} assignedTo - List of contacts assigned to the task.
 * @param {string} category - The category of the task.
 * @param {Array} subtasks - List of subtasks under the main task.
 * @param {string} status - The status of the task.
 * @returns {Promise<Object>} The response from the backend as a JSON object.
 */
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


/**
 * Gathers task input data from the form and attempts to add a new task.
 * Validates required fields before posting the task.
 * Shows a confirmation message and redirects to the board page after successful addition.
 * @param {string} status - The status to assign to the new task.
 */
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


/**
 * Clears all input fields in the add task form,
 * resets priority buttons, assigned contacts,
 * subtasks, required field indicators,
 * and disables the create task button.
 */
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


/**
 * Enables the create task button if the title, date, and category inputs are not empty.
 * Otherwise, disables the button.
 */
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


/**
 * Disables the given create task button and removes the enabled styling class.
 * @param {HTMLButtonElement} createTaskBtn - The create task button element to disable.
 */
function diableCreateTaskButton(createTaskBtn) {
    createTaskBtn.disabled = true;
    createTaskBtn.classList.remove("btn_create_enabled");
}


/**
 * Adds a new subtask if the input is not empty and does not already exist.
 * Generates a unique ID for the subtask, stores it with status "undone",
 * renders it in the UI, and clears the input field.
 */
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


/**
 * Renders a subtask element inside the subtask container using a template.
 * @param {string} id - The unique ID of the subtask element.
 * @param {string} subtaskValue - The text content of the subtask.
 */
function renderSubtask(id, subtaskValue) {
    let contentRef = document.getElementById("addTask_subtask_content");
    contentRef.innerHTML += getSubtaskTemplate(id, subtaskValue);
}


/**
 * Clears the input field for adding a new subtask.
 */
function clearSubtaskInput() {
    document.getElementById("add_task_subtask").value = "";
}


/**
 * Deletes a subtask both from the currentSubtasks object and from the DOM.
 * @param {string} id - The unique ID of the subtask to delete.
 */
function deleteSubtask(id) {
    delete currentSubtasks[id];
    const subtaskDiv = document.getElementById(id);
    if (subtaskDiv) {
        subtaskDiv.remove();
    }    
}


/**
 * Deletes all subtasks from the currentSubtasks object and clears the subtask container in the UI.
 */
function deleteAllSubtasks() {
    currentSubtasks = {};
    document.getElementById("addTask_subtask_content").innerHTML = "";
}


/**
 * Closes the category dropdown menu when clicking outside of the category input or dropdown.
 * @param {Event} event - The click event to check the target against.
 */
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