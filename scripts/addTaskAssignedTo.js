let counterContactIcons = 0;
let checkedContacts = {};
let currentContacts = [];


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


async function loadContactListAssignedTo() {
    let contacts = await getAllContacts(); 
    let sortedContacts = sortContactsAlphabetically(contacts);
    renderContactsToAssignedTo(sortedContacts);
    currentContacts = sortedContacts;
}


function renderContactsToAssignedTo(contacts) {
    const dropDown = document.getElementById("editDialogBoardAssignedToDropDown");
    const icons = document.getElementById("addTask_assignedToIcons");
    dropDown.innerHTML = "";
    icons.innerHTML = "";

    Object.entries(contacts).forEach(([_, contact], index) => {
        const data = getContactRenderData(contact);
        dropDown.innerHTML += getAssignedToContactTemplate(contact.name, data.initials, index, data.contactClass, data.checkboxClass, data.bgColor);
        icons.innerHTML += getAssignedToContactIconTemplate(data.initials, index, data.iconClass, data.bgColor);
    });
    renderNoContactsToAssignedTo();
}


function getContactRenderData(contact) {
    const isChecked = checkedContacts.hasOwnProperty(contact.name);
    return {
        contactClass: isChecked ? "contactChecked" : "contactUnchecked",
        checkboxClass: isChecked ? "contactCheckedCheckbox" : "contactUncheckedCheckbox",
        iconClass: isChecked ? "" : "d_none",
        initials: setContactInitials(contact.name),
        bgColor: contact.backgroundcolor
    };
}


function renderNoContactsToAssignedTo() {
    let assignedToDropDownRef = document.getElementById("editDialogBoardAssignedToDropDown");
    assignedToDropDownRef.innerHTML += getNoContactAssignedTo();
}


function closeAssignedToByClickNextToIt(event) {
    const assignedInput = document.getElementById("addTaskAssignedToInput");
    const assignedDropdown = document.getElementById("editDialogBoardAssignedToDropDown");
    const isClickInsideAssigned = assignedInput.contains(event.target) || assignedDropdown.contains(event.target);
    if (!isClickInsideAssigned) {
        closeAssignedContactToTaskMenu();
    }
}


function openAssignedContactToTaskMenu() {
    document.getElementById("editDialogBoardAssignedToDropDown").classList.remove("d_none");
    document.getElementById("addTaskAssignedToInput").classList.add("arrowDropUp");
    document.getElementById("addTask_assignedToIcons").classList.add("d_none");
}


function closeAssignedContactToTaskMenu() {
    document.getElementById("addTaskAssignedToInput").value = "";
    searchContactAssignedTo();
    document.getElementById("editDialogBoardAssignedToDropDown").classList.add("d_none");
    document.getElementById("addTaskAssignedToInput").classList.remove("arrowDropUp");
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


function checkIfContactChecked(event, index) {
    const contactDiv = event.target.closest('.dropDownContacts');
    let isChecked = contactDiv.classList.contains('contactChecked');
    let iconRef = document.getElementById("addTask_assignedTo_contactIcon_" + index);
    let contactRef = document.getElementById("addTask_assignedTo_contact_" + index).querySelector('.dropDownContact p').textContent;
    if (isChecked) {    
        contactIsChecked(iconRef, contactRef);       
    } else {
        contactIsNotChecked(iconRef, contactRef);
    }       
}


function contactIsChecked(iconRef, contactRef){
    iconRef.classList.remove("d_none");
    checkedContacts[contactRef] = true;   
    counterContactIcons++; 
}


function contactIsNotChecked(iconRef, contactRef){
    iconRef.classList.add("d_none");
    delete checkedContacts[contactRef];
    counterContactIcons--;
}


function searchContactAssignedTo() {
    let searchInputRef = document.getElementById("addTaskAssignedToInput").value.toLowerCase();
    openAssignedContactToTaskMenu();
    let filteredContacts = Object.entries(currentContacts).filter(([key, contact]) =>
        contact.name.toLowerCase().includes(searchInputRef));
    renderContactsToAssignedTo(Object.fromEntries(filteredContacts));
    if(filteredContacts.length == 0) {
        document.getElementById("addTask_assignedTo_no_contact").classList.remove("d_none");
    } else {
        document.getElementById("addTask_assignedTo_no_contact").classList.add("d_none");
    }
}