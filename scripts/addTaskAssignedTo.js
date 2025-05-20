/**
 * Counts the currently selected contacts for displaying contact icons.
 * Increments or decrements when contacts are selected or deselected.
 * @type {number}
 */
let counterContactIcons = 0;


/**
 * Holds the currently selected contacts using their names as keys.
 * Example: { "Max Mustermann": true }
 * @type {{ [contactName: string]: boolean }}
 */
let checkedContacts = {};


/**
 * List of all currently loaded contacts, sorted alphabetically.
 * Each entry is a contact object with name, background color, etc.
 * @type {Array<Object>}
 */
let currentContacts = [];


/**
 * Resets the assigned contacts for a task by clearing the selection,
 * hiding the assigned contact icons, resetting contact selections,
 * clearing the assigned-to input, and closing the assigned contact menu.
 */
function resetAssignedToContacts() {
    checkedContacts = {};
    hideAssignedToIcons();
    resetContactSelections();
    clearInput("addTaskAssignedToInput");
    closeAssignedContactToTaskMenu();
}


/**
 * Hides all assigned-to contact icons by adding the "d_none" class.
 */
function hideAssignedToIcons() {
    const iconElements = document.querySelectorAll("[id^='addTask_assignedTo_contactIcon_']");
    iconElements.forEach(icon => {
        icon.classList.add("d_none");
    });
}


/**
 * Resets all contact selections by removing the "contactChecked" class
 * and adding the "contactUnchecked" class to contact elements and their checkboxes.
 */
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


/**
 * Loads all contacts asynchronously, sorts them alphabetically,
 * renders them in the assigned-to contacts UI,
 * and stores them in the currentContacts variable.
 * @returns {Promise<void>}
 */
async function loadContactListAssignedTo() {
    let contacts = await getAllContacts(); 
    let sortedContacts = sortContactsAlphabetically(contacts);
    renderContactsToAssignedTo(sortedContacts);
    currentContacts = sortedContacts;
}


/**
 * Renders the list of contacts into the assigned-to dropdown and icons container.
 * Clears existing content before rendering.
 * @param {Object} contacts - An object containing contact data keyed by an identifier.
 */
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


/**
 * Returns rendering data for a contact such as CSS classes, initials, and background color,
 * depending on whether the contact is currently checked (assigned).
 * @param {Object} contact - The contact object containing at least a name and backgroundcolor.
 * @returns {Object} An object containing class names, initials, and background color for rendering.
 */
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


/**
 * Renders a message or template indicating that no contacts are assigned
 * in the assigned-to dropdown container.
 */
function renderNoContactsToAssignedTo() {
    let assignedToDropDownRef = document.getElementById("editDialogBoardAssignedToDropDown");
    assignedToDropDownRef.innerHTML += getNoContactAssignedTo();
}


/**
 * Closes the assigned-to contacts dropdown menu when clicking outside
 * the assigned-to input field or dropdown area.
 * @param {Event} event - The click event used to determine click target.
 */
function closeAssignedToByClickNextToIt(event) {
    const assignedInput = document.getElementById("addTaskAssignedToInput");
    const assignedDropdown = document.getElementById("editDialogBoardAssignedToDropDown");
    const isClickInsideAssigned = assignedInput.contains(event.target) || assignedDropdown.contains(event.target);
    if (!isClickInsideAssigned) {
        closeAssignedContactToTaskMenu();
    }
}


/**
 * Opens the assigned-to contacts dropdown menu,
 * shows the input field with an upward arrow,
 * and hides the assigned-to icons.
 */
function openAssignedContactToTaskMenu() {
    document.getElementById("editDialogBoardAssignedToDropDown").classList.remove("d_none");
    document.getElementById("addTaskAssignedToInput").classList.add("arrowDropUp");
    document.getElementById("addTask_assignedToIcons").classList.add("d_none");
}


/**
 * Closes the assigned-to contacts dropdown menu,
 * clears the input field, triggers a search reset,
 * shows the assigned-to icons,
 * and removes the upward arrow from the input.
 */
function closeAssignedContactToTaskMenu() {
    document.getElementById("addTaskAssignedToInput").value = "";
    searchContactAssignedTo();
    document.getElementById("editDialogBoardAssignedToDropDown").classList.add("d_none");
    document.getElementById("addTaskAssignedToInput").classList.remove("arrowDropUp");
    document.getElementById("addTask_assignedToIcons").classList.remove("d_none");
}


/**
 * Toggles the assigned-to contacts dropdown menu,
 * clears the input field,
 * toggles the arrow icon on the input,
 * and toggles visibility of the assigned-to icons.
 */
function toggleAssignedContactToTaskMenu() {
    document.getElementById("addTaskAssignedToInput").value = "";
    document.getElementById("editDialogBoardAssignedToDropDown").classList.toggle("d_none");
    document.getElementById("addTaskAssignedToInput").classList.toggle("arrowDropUp");
    document.getElementById("addTask_assignedToIcons").classList.toggle("d_none");
}


/**
 * Handles the selection of a contact to assign to a task by
 * changing the background color, toggling the checkbox,
 * and updating the checked status.
 * @param {Event} event - The click event triggered by selecting a contact.
 * @param {number} index - The index of the contact in the list.
 */
function addTaskselectContactToAssignTask(event, index) {
    changeBackgroundColor(event);
    changeCheckbox(event);
    checkIfContactChecked(event, index);
}


/**
 * Toggles the background color classes on the contact element
 * to visually indicate selection or deselection.
 * @param {Event} event - The event triggered by clicking a contact element.
 */
function changeBackgroundColor(event) {
    const contactDiv = event.target.closest('.dropDownContacts');
    contactDiv.classList.toggle('contactChecked');
    contactDiv.classList.toggle('contactUnchecked');
}


/**
 * Toggles the checkbox classes on the contact's checkbox element
 * to visually indicate selection or deselection.
 * @param {Event} event - The click event triggered by selecting a contact.
 */
function changeCheckbox(event) {
    const  checkboxDiv = event.target.closest('.dropDownContacts').querySelector('.editDialogBoardAssignedToDropDownCheckbox');
    checkboxDiv.classList.toggle('contactCheckedCheckbox');
    checkboxDiv.classList.toggle('contactUncheckedCheckbox');
}


/**
 * Checks if a contact is selected based on its CSS class,
 * then updates the assigned-to icon and selection state accordingly.
 * @param {Event} event - The click event triggered by selecting a contact.
 * @param {number} index - The index of the contact in the list.
 */
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


/**
 * Marks a contact as checked by showing its icon,
 * adding it to the checkedContacts object,
 * and incrementing the selected contacts counter.
 * @param {HTMLElement} iconRef - The icon element associated with the contact.
 * @param {string} contactRef - The name of the contact.
 */
function contactIsChecked(iconRef, contactRef){
    iconRef.classList.remove("d_none");
    checkedContacts[contactRef] = true;   
    counterContactIcons++; 
}


/**
 * Marks a contact as not checked by hiding its icon,
 * removing it from the checkedContacts object,
 * and decrementing the selected contacts counter.
 * @param {HTMLElement} iconRef - The icon element associated with the contact.
 * @param {string} contactRef - The name of the contact.
 */
function contactIsNotChecked(iconRef, contactRef){
    iconRef.classList.add("d_none");
    delete checkedContacts[contactRef];
    counterContactIcons--;
}


/**
 * Filters the currentContacts list based on the search input,
 * renders the filtered contacts in the assigned-to dropdown,
 * opens the assigned-to menu,
 * and shows or hides a "no contacts found" message accordingly.
 */
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