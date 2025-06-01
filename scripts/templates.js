function renderTaskCard(assignedTo, category, description, dueDate, priority, subtasks, title, taskId, contactsObj) {
    return `
                                <div id="${taskId}" class="taskCards" onclick="openOverlay(event, '${encodeURIComponent(JSON.stringify(assignedTo))}', '${category}', '${description}', '${dueDate}', '${priority}', '${encodeURIComponent(JSON.stringify(subtasks))}', '${title}', '${taskId}', '${encodeURIComponent(JSON.stringify(contactsObj))}')" draggable="true" ondragstart="dragStart(event)"  ondragend="dragEnd(event)">
                                <div class="cardsFrame">
                                    <div class="cardsLabel">
                                        <p class="${formatCategory(category)}">${category}</p>
                                        <button class="openOverlayMoveTo" onclick="toggleMenuMobileMoveTo(event)"></button>
                                        <div class="menuMoveToMobile d_none">
                                            <div class="moveToDiv">Move to</div>
                                            <div></div>
                                        </div>
                                    </div>
                                    <div class="cardsTitleAndContent">
                                        <p class="cardsTitle">${title}</p>
                                        <p class="cardsContent">${description}..</p>
                                    </div>
                                    <div class="cardsProgress" id="subtasksTaskCard_${taskId}">
                                        <p id="cardsSubtasks">1/2 Subtasks</p>
                                        <div id="cardsProgressBar" aria-valuemin="0" aria-valuemax="100"
                                            are-valuenow="50">
                                            <div id="progressBar" style="width: 50%;"></div>
                                        </div>
                                    </div>
                                    <div id="cardsBottom">
                                        <div id="cardsAssignedTo_${taskId}" class="cardsAssignedTo">
                                        </div>
                                        <div id="cardsPriority" class="${formatPriorityImg(priority)}">
                                        </div>
                                    </div>
                                </div>
                            </div>
    `
}


function createAssignedToIconHTML(initials, bgColor) {
    return `
        <div class="cardsAssignedToIcon contactCircleExtraSmall ${bgColor}">
            ${initials}
        </div>
    `;
}


function getDialogTemplate(assignedTo, category, description, dueDate, priority, subtasks, title, taskId) {
    return `
            <div id="dialogBoard">
                <div id="dialogBoardFrame">
                    <div class="dialogBoardTop">
                        <p class="${formatCategory(category)}">${category}</p>
                        <button id="closeOverlayBoard" onclick="closeDialog()">
                            <img src="../assets/img/icons/X.svg" alt="">
                        </button>
                    </div>
                    <div class="editViewScrollbar">
                        <div id="editViewContent">
                            <div id="overlayTaskTitle">
                                <p>${title}</p>
                            </div>
                            <div id="overlayTaskContent">
                                <p>${description}</p>
                            </div>
                            <div id="overlayTaskDueDate">
                                <p>Due date:</p>
                                <div>${formatDate(dueDate)}</div>
                            </div>
                            ${renderPrioritySection(priority)}
                            ${renderAssignedToSection(assignedTo, taskId)}
                            <div id="subtasksDialog">
                                <p class="mb_8px">Subtasks</p>
                                <div id="addTask_subtask_content_${taskId}" class="subtasksContent">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="overlayTaskBottom">
                        <div class="overlayTaskDelete">
                            <button onclick="deleteTask('${taskId}')">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_298547_4497" style="mask-type:alpha" maskUnits="userSpaceOnUse"
                                        x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9"></rect>
                                    </mask>
                                    <g mask="url(#mask0_298547_4497)">
                                        <path
                                            d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z"
                                            fill="#2A3647"></path>
                                    </g>
                                </svg>
                                <p>Delete</p>
                            </button>
                        </div>
                        <div class="overlayTaskVector"></div>
                        <div class="overlayTaskEdit">
                            <button
                                onclick="openEditDialog(event, '${encodeURIComponent(JSON.stringify(assignedTo, taskId))}', '${category}', '${description}', '${dueDate}', '${priority}', '${encodeURIComponent(JSON.stringify(subtasks, taskId))}', '${title}', '${taskId}')">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_298547_4257" style="mask-type:alpha" maskUnits="userSpaceOnUse"
                                        x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9"></rect>
                                    </mask>
                                    <g mask="url(#mask0_298547_4257)">
                                        <path
                                            d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                                            fill="#2A3647"></path>
                                    </g>
                                </svg>
                                <p>Edit</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    `
}


function renderPrioritySection(priority) {
    if (!priority) return '';
    return `
        <div id="overlayTaskPriority">
            <p>Priority:</p>
            <div class="overlayTaskPriorityDiv">
                <div>${capitalizeFirstLetter(priority)}</div>
                <div class="${formatPriorityImg(priority)} priorityImg"></div>
            </div>
        </div>
    `;
}


function renderAssignedToSection(assignedTo, taskId) {
    if (!assignedTo || Object.keys(assignedTo).length === 0) return '';
    return `
        <div class="overlayTaskAssignedTo">
            <p>Assigned To:</p>
            <div id="overlayTaskAssignedToContacts_${taskId}" class="overlayTaskAssignedToContacts"></div> 
        </div>
    `;
}


function createAssignedToIconHTMLforDetailView(name, initials, bgColor) {
    return `
                <div class="assignedToContact">
                    <div class="contactCircleSmallDetailView ${bgColor}">${initials}</div>
                    <p>${name}</p>
                </div>
    `
}


function createSubTaskHTML(title, status, taskId) {
    const checked = status === "done" ? "checked" : "";
    return `
        <div class="overlayTaskSubtasks">
            <input type="checkbox" id="check_${taskId}_${title}" ${checked} onchange="updateSubtasksInDatabase('${taskId}', '${title}', this.checked)">
            <label for="check_${taskId}_${title}">
                <span class="customCheckbox"></span>
            </label>
            <p>${title}</p>
        </div>
    `;
}


function getEditDialogTemplate(category, description, dueDate, title, taskId) {
    return `
<div id="editDialogBoard">
                <button onclick="closeDialog()" class="closeEditDialogBoard">
                    <img src="../assets/img/icons/X.svg" alt="">          
                </button>
                <div class="editDialogBoardFrameWithScrollbar">
                    <div id="editDialogBoardFrame">
                        <div class="editDialogBoardTop">
                            <div class="editDialogBoardTitle height_98">
                                <p>Title</p>
                                <input type="text" class="inputEditDialogBoardTitle" placeholder="Enter a title" id="titleTask"
                                    value="${title}" required oninput="validateTitleInput()">
                                <p class="requiredFieldDialog d_none">This field is required</p>
                            </div>
                            <div class="editDialogBoardDescription">
                                <p>Description</p>
                                <textarea id="inputEditDialogBoardDescription" class="inputEditDialogBoardDescription"
                                    placeholder="Enter a Description">${description}</textarea>
                            </div>
                            <div class="editDialogBoardDueDate height_98" required>
                                <p>Due Date</p>
                                <input type="date" class="inputEditDialogBoardDueDate" value="${dueDate}" id="dueDate" required oninput="validateDueDateInput()">
                                <p class="requiredFieldDialog d_none">This field is required</p>
                            </div>
                        </div>
                        <div class="editDialogBoardPriority">
                            <p class="marginb_8px">Priority</p>
                            <div class="editDialogBoardPriorityButtons">
                                <button class="editDialogBoardPriorityButton" onclick="selectUrgentPriority()"
                                    id="urgentPriority">
                                    <p>Urgent</p>
                                    <svg width="21" height="16" viewBox="0 0 21 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_156_921)">
                                            <path
                                                d="M19.2597 15.4464C19.0251 15.4468 18.7965 15.3719 18.6077 15.2328L10.3556 9.14965L2.10356 15.2328C1.98771 15.3184 1.85613 15.3803 1.71633 15.4151C1.57652 15.4498 1.43124 15.4567 1.28877 15.4354C1.14631 15.414 1.00944 15.3648 0.885997 15.2906C0.762552 15.2164 0.654943 15.1186 0.569314 15.0029C0.483684 14.8871 0.421712 14.7556 0.386936 14.6159C0.352159 14.4762 0.345259 14.331 0.366629 14.1887C0.409788 13.9012 0.565479 13.6425 0.799451 13.4697L9.70356 6.89926C9.89226 6.75967 10.1208 6.68433 10.3556 6.68433C10.5904 6.68433 10.819 6.75967 11.0077 6.89926L19.9118 13.4697C20.0977 13.6067 20.2356 13.7988 20.3057 14.0186C20.3759 14.2385 20.3747 14.4749 20.3024 14.6941C20.2301 14.9133 20.0904 15.1041 19.9031 15.2391C19.7159 15.3742 19.4907 15.4468 19.2597 15.4464Z"
                                                fill="#FF3D00" />
                                            <path
                                                d="M19.2597 9.69733C19.0251 9.69774 18.7965 9.62289 18.6077 9.48379L10.3556 3.40063L2.10356 9.48379C1.86959 9.6566 1.57651 9.72945 1.28878 9.68633C1.00105 9.6432 0.742254 9.48762 0.569318 9.25383C0.396382 9.02003 0.323475 8.72716 0.366634 8.43964C0.409793 8.15213 0.565483 7.89352 0.799455 7.72072L9.70356 1.15024C9.89226 1.01065 10.1208 0.935303 10.3556 0.935303C10.5904 0.935303 10.819 1.01065 11.0077 1.15024L19.9118 7.72072C20.0977 7.85763 20.2356 8.04974 20.3057 8.26962C20.3759 8.4895 20.3747 8.72591 20.3024 8.94509C20.2301 9.16427 20.0904 9.35503 19.9031 9.49012C19.7159 9.62521 19.4907 9.69773 19.2597 9.69733Z"
                                                fill="#FF3D00" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_156_921">
                                                <rect width="20" height="14.5098" fill="white"
                                                    transform="translate(0.355469 0.936768)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button class="editDialogBoardPriorityButton mediumPriorityButtonSelected"
                                    onclick="selectMediumPriority()" id="mediumPriority">
                                    <p>Medium</p>
                                    <svg width="21" height="8" viewBox="0 0 21 8" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_156_928)">
                                            <path
                                                d="M19.7596 7.91693H1.95136C1.66071 7.91693 1.38197 7.80063 1.17645 7.59362C0.970928 7.3866 0.855469 7.10584 0.855469 6.81308C0.855469 6.52032 0.970928 6.23955 1.17645 6.03254C1.38197 5.82553 1.66071 5.70923 1.95136 5.70923H19.7596C20.0502 5.70923 20.329 5.82553 20.5345 6.03254C20.74 6.23955 20.8555 6.52032 20.8555 6.81308C20.8555 7.10584 20.74 7.3866 20.5345 7.59362C20.329 7.80063 20.0502 7.91693 19.7596 7.91693Z"
                                                fill="#FFA800" />
                                            <path
                                                d="M19.7596 2.67376H1.95136C1.66071 2.67376 1.38197 2.55746 1.17645 2.35045C0.970928 2.14344 0.855469 1.86267 0.855469 1.56991C0.855469 1.27715 0.970928 0.996386 1.17645 0.789374C1.38197 0.582363 1.66071 0.466064 1.95136 0.466064L19.7596 0.466064C20.0502 0.466064 20.329 0.582363 20.5345 0.789374C20.74 0.996386 20.8555 1.27715 20.8555 1.56991C20.8555 1.86267 20.74 2.14344 20.5345 2.35045C20.329 2.55746 20.0502 2.67376 19.7596 2.67376Z"
                                                fill="#FFA800" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_156_928">
                                                <rect width="20" height="7.45098" fill="white"
                                                    transform="translate(0.855469 0.466064)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                                <button class="editDialogBoardPriorityButton" onclick="selectLowPriority()"
                                    id="lowPriority">
                                    <p>Low</p>
                                    <svg width="21" height="16" viewBox="0 0 21 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M10.8555 9.69779C10.6209 9.69819 10.3923 9.62335 10.2035 9.48427L1.30038 2.91453C1.18454 2.82898 1.0867 2.72146 1.01245 2.59812C0.938193 2.47478 0.888977 2.33803 0.867609 2.19569C0.824455 1.90821 0.897354 1.61537 1.07027 1.3816C1.24319 1.14782 1.50196 0.992265 1.78965 0.949143C2.07734 0.906021 2.3704 0.978866 2.60434 1.15165L10.8555 7.23414L19.1066 1.15165C19.2224 1.0661 19.354 1.00418 19.4938 0.969432C19.6336 0.934685 19.7788 0.927791 19.9213 0.949143C20.0637 0.970495 20.2006 1.01967 20.324 1.09388C20.4474 1.16808 20.555 1.26584 20.6407 1.3816C20.7263 1.49735 20.7883 1.62882 20.823 1.7685C20.8578 1.90818 20.8647 2.05334 20.8433 2.19569C20.822 2.33803 20.7727 2.47478 20.6985 2.59812C20.6242 2.72146 20.5264 2.82898 20.4106 2.91453L11.5075 9.48427C11.3186 9.62335 11.0901 9.69819 10.8555 9.69779Z"
                                            fill="#7AE229" />
                                        <path
                                            d="M10.8555 15.4463C10.6209 15.4467 10.3923 15.3719 10.2035 15.2328L1.30038 8.66307C1.06644 8.49028 0.910763 8.2317 0.867609 7.94422C0.824455 7.65674 0.897354 7.3639 1.07027 7.13013C1.24319 6.89636 1.50196 6.7408 1.78965 6.69768C2.07734 6.65456 2.3704 6.7274 2.60434 6.90019L10.8555 12.9827L19.1066 6.90019C19.3405 6.7274 19.6336 6.65456 19.9213 6.69768C20.209 6.7408 20.4678 6.89636 20.6407 7.13013C20.8136 7.3639 20.8865 7.65674 20.8433 7.94422C20.8002 8.2317 20.6445 8.49028 20.4106 8.66307L11.5075 15.2328C11.3186 15.3719 11.0901 15.4467 10.8555 15.4463Z"
                                            fill="#7AE229" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="editDialogBoardAssignedTo">
                            <p>Assigned to</p>
                            <div class="editDialogBoardAssignedToInputDiv">
                                <input type="text" placeholder="Select contacts to assign"
                                    id="addTaskAssignedToInput" class="editDialogBoardAssignedToInput arrowDropDown"
                                    onclick="toggleAssignedContactToTaskMenu()" onkeyup="searchContactAssignedTo()">
                                <div id="editDialogBoardAssignedToDropDown" class="editDialogBoardAssignedToDropDown d_none">
                                </div>
                            </div>
                            <div class="editDialogBoardAssignedToIcons" id="addTask_assignedToIcons">
                            </div>
                        </div>
                        <div class="editDialogBoardSubtasks" id="editDialogBoardSubtasks">
                            <p class="">Subtasks</p>
                            <div class="editDialogBoardSubtasksInput">
                                <input id="subtaskInputEditView" type="text" placeholder="Add new subtask" onkeydown="if(event.key === 'Enter') { event.preventDefault(); addSubtasksEditTaskView(); }">
                                <div class="xIcon" onpointerdown="clearSubtasksInputEditTaskView(event)"></div>
                                <div class="vectorAddSubtask"></div>
                                <div class="addIcon" onpointerdown="addSubtasksEditTaskView()"></div>
                            </div>
                            <div id="subtasksContentEditView"></div>
                        </div>
                    </div>
                </div>
                <button class="saveEditTaskButton" onclick="saveEditTask(event, '${category}', '${taskId}')" id="saveEditTaskButton">
                <p>Ok</p>
                <img src="../assets/img/icons/add_task_btn_check.svg" alt="">
                </button>
            </div>
    `
}


function createEditTaskSubTaskHTML(title) {
    return `
                                <div class="editDialogBoardSubtasksAdded">
                                <li>${title}</li>
                                <div class="editDivSubtasks">
                                    <div class="editIcon" onclick="subtaskEdit(event)"></div>
                                    <div class="vectorAddSubtask"></div>
                                    <div class="deleteIcon" onclick="deleteSubtaskBoard(event)"></div>
                                </div>
                                <div class="editDivSubtasks2 d_none">
                                    <div class="deleteIcon2" onclick="deleteSubtaskBoard(event)"></div>
                                    <div class="vectorAddSubtask2"></div>
                                    <div class="saveIcon" onclick="subtaskSave(event)"></div>
                                </div>
                            </div>
    `
}


function getAddTaskDialogTemplate() {
    return `
            <div class="addTaskDialogBoard" id="addTaskDialogBoard">
                <div class="addTaskDialogBoardFrame">
                    <div w3-include-html="../assets/templates/addTaskTemplate.html" class="addTaskTemplate"></div>
                    <button class="addTaskDialogBoardClose" onclick="closeDialogAddTask()">
                        <img src="../assets/img/icons/X.svg" alt="">                                            
                    </button>
                </div>
            </div>
    `
}


function renderNoTaskCard(status) {
    const statusMap = {
        toDoTask: "To do",
        inProgressTask: "In progress",
        awaitFeedbackTask: "Await Feedback",
        doneTask: "Done"
    };

    const readableStatus = statusMap[status];
    return `
                            <div id="noTaskToDo">
                                <p>No tasks ${readableStatus}</p>
                            </div>
    
    `
}


function renderContactInList(name, email, phone, isItMe, backgroundcolor) {
    return `
            <div class="contactInList" id="${email}" onclick="selectContact(event); loadContactDetails('${name}', '${email}', '${phone}', '${backgroundcolor}'); resetAnimationSlightDetailsFromRightToCenter();">
                <div class="contactCircleSmall ${backgroundcolor}">
                    ${setContactInitials(name)}
                </div>
                <div>
                    <p>${name} ${isItMe}</p>
                    <a>${email}</a>
                </div>
            </div>
        `;
}


function renderContactListHeader() {
    return `
        <div class="alphabetInContactList"></div>
    `;
}


function renderContactListHeadline(i) {
    return `
        <div class="alphabetInContactList">${letter(i)}</div>
        <div class="seperatorContactList"></div>
    `;
}


function renderContactDetails(name, email, phone, isItMe, backgroundcolor) {
    return `            
        <div class="contactDetailsTop">
            <div class="contactIcon">
                <div class="contactCircleBig ${backgroundcolor}">${setContactInitials(name)}</div>
            </div>
            <div>
                <div class="contactName">${name} ${isItMe}</div>
                <div id="contactDetailsMenu" class="contactDetailsButtons respContactEditMenuClosed">
                    <div class="contactButton" onclick="openEditContactDialog(event); fillInputFieldsWithCurrentData('${name}', '${email}', '${phone}', '${backgroundcolor}')">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_298547_4257" style="mask-type:alpha"
                                maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_298547_4257)">
                                <path
                                    d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                                    fill="#2A3647" />
                            </g>
                        </svg>
                        <p>Edit</p>
                    </div>
                    <div onclick="deleteContact('${email}')" class="contactButton">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_298547_4497" style="mask-type:alpha"
                                maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                <rect width="24" height="24" fill="#D9D9D9" />
                            </mask>
                            <g mask="url(#mask0_298547_4497)">
                                <path
                                    d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z"
                                    fill="#2A3647" />
                            </g>
                        </svg>
                        <p>Delete</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="contactDetailsMiddle">Contact Information</div>
        <div>
            <p class="contactDetailsKey">Email</p>
            <a href="mailto:${email}">${email}</a>
        </div>
        <div>
            <p class="contactDetailsKey">Phone</p>
            <a href="tel:${phone}">${phone}</a>
        </div>         
    `;
}


function getAssignedToContactTemplate(name, initials, index, classIfContactChecked, classIfCheckbox, bgClass) {
    return `
            <div id="addTask_assignedTo_contact_${index}" class="dropDownContacts ${classIfContactChecked}" onclick="addTaskselectContactToAssignTask(event, ${index})">
                <div class="dropDownContact">
                    <div class="contactCircleSmallDetailView ${bgClass}">${initials}</div>
                    <p>${name}</p>
                </div>
                <div class="editDialogBoardAssignedToDropDownCheckbox ${classIfCheckbox}">
                </div>
            </div>
    `
}


function getNoContactAssignedTo() {
    return `
            <div id="addTask_assignedTo_no_contact" class="dropDownContacts contactUnchecked d_none">
                <div class="dropDownContact">
                    <div class="contactCircleSmallDetailView"></div>
                    <p>Kein Kontakt gefunden!</p>
                </div>
                <div class="editDialogBoardAssignedToDropDownCheckbox">
                </div>
            </div>
    `
}


function getAssignedToContactIconTemplate(initials, index, iconClass, bgClass) {
    return `
            <div id="addTask_assignedTo_contactIcon_${index}" class="contactCircleSmallDetailView ${bgClass} ${iconClass}">${initials}</div>
    `
}


function getAssignedToContactIconExtraTemplate(num) {
    return `
            <div id="contact_icon_counter" class="contactCircleSmallDetailView bg_grey">+${num}</div>
    `
}


function getSubtaskTemplate(id, input) {
    return `
            <div id="${id}" class="editDialogBoardSubtasksAdded">
                <li>${input}</li>
                <div class="editDivSubtasks">
                    <div onclick="subtaskEdit(event)" class="editIcon"></div>
                    <div class="vectorAddSubtask"></div>
                    <div class="deleteIcon" onclick="deleteSubtask('${id}')"></div>
                </div>
                <div class="editDivSubtasks2 d_none">
                    <div class="deleteIcon2" onclick="deleteSubtask('${id}')"></div>
                    <div class="vectorAddSubtask2"></div>
                    <div class="saveIcon" onclick="subtaskSave(event)"></div>
                </div>
            </div>
    `
}