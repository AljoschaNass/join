/**
 * Initializes the contact page by performing the following actions:
 * 1. Highlights the selected quick link for contacts.
 * 2. Loads the contact list.
 * 3. Checks if the user is logged in and redirects if not.
 * 4. Resets the animation of the contact details section.
 *
 * @returns {void} This function does not return a value.
 */
function contactInit() {
    init();
    highlightSelectedQuickLinks('contacts');
    loadContactList();
    checkUserLogIn();
}


/**
 * Resets the animation of the contact details div and re-applies the animation
 * to create a sliding effect from the right to the center of the screen.
 * 
 *  @returns {void} This function does not return a value.
 */
function resetAnimationSlightDetailsFromRightToCenter() {
    document.getElementById("contactDetails").classList.remove("slightFromRightToCenter");
    if (screen.width > 1024) {
        document.getElementById("contactDetails").classList.add("slightFromRightToCenter");
    } 
}


/**
 * Creates a new contact resource in the database.
 * This operation is non-idempotent, meaning multiple executions can create multiple entries.
 * @param {string} [path="contacts"] - The path to the contacts endpoint.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} backgroundcolor - The background color associated with the contact.
 * @returns {Promise<Object>} - The response from the server as a JSON object.
 */
async function postContact(path="contacts", name, email, phone, backgroundcolor){//erstellen neuer recoursen - nicht idempotent, dh mehrere ausführungen können mehrere einträge erzeugen
    let contact = {
        'name': name, 
        'email': email,
        'phone': phone,
        'backgroundcolor': backgroundcolor
    };
    let response = await fetch(BASE_URL + path + ".json", {method: "POST", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(contact)});
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Updates an existing contact resource in the database.
 * This operation uses PATCH to only overwrite parts of the contact.
 * @param {string} path - The path to the contact endpoint.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} backgroundcolor - The background color associated with the contact.
 * @returns {Promise<Object>} - The response from the server as a JSON object.
 */
async function patchContact(path, name, email, phone, backgroundcolor){ //patch statt put, da patch nur teile überscreibt. put überschreibt alles!
    let contact = {
        'name': name, 
        'email': email,
        'phone': phone,
        'backgroundcolor': backgroundcolor
    };
    let response = await fetch(BASE_URL + path + ".json", {method: "PATCH", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(contact)});
    let responseToJson = await response.json();
    return responseToJson;
}


/**
 * Fetches all contacts from the database.
 * @returns {Promise<Object>} - The response of the server: the contacts as a JSON object.
 */
async function getAllContacts(){
    let path = "contacts";
    let response = await fetch(BASE_URL + path + ".json");   
    return responseToJson = await response.json();
}


/**
 * Retrieves all users and posts them as contacts in the database.
 */
async function getAllUsersToContacts(){
    let path = "user";
    let response = await fetch(BASE_URL + path + ".json");   
    let users = await response.json();
    for (let i in users) {
        let contact = users[i];
        await postContact("contacts", contact.name, contact.email, contact.phone, setBackgroundcolor());
    }
}


/**
 * Loads the details of a contact into the contact details card.
 *
 * This function clears the existing contact details and inserts the selected contact's
 * information. If the screen width is below 1024 pixels, it adjusts the layout for
 * responsive view.
 *
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} backgroundcolor - The background color associated with the contact.
 */
function loadContactDetails(name, email, phone, backgroundcolor) {
    let contactCard = document.getElementById("contactDetails"); 
    contactCard.innerHTML = ''; 
    contactCard.innerHTML += renderContactDetails(name, email, phone, isItMyEmail(email), backgroundcolor); 
    if (window.innerWidth < 1024) {
        openResponsiveDetails();
    }
}


/**
 * Opens the responsive contact details view.
 *
 * Hides the general contacts list and shows the main contact section,
 * the contact details panel, and the three-dots menu (options menu)
 * for responsive layouts.
 */
function openResponsiveDetails() {
    document.querySelector('.contacts').style.display = 'none';
    document.querySelector('.main_contacts').style.display = 'flex';
    document.querySelector('#contactDetails').style.display = 'flex';
    document.querySelector('.theePointsMenu').style.display = 'flex';
}


/**
 * Loads the list of contacts, sorts the contacts alphabetically and renders them in the contact list.
 */
async function loadContactList() {
    let contacts = await getAllContacts(); 
    let sortedContacts = sortContactsAlphabetically(contacts);
    let contactList = document.getElementById("contactList"); 
    contactList.innerHTML = renderContactListHeader(); 
    filterContactsByFirstLetter(sortedContacts);
}


/**
 * Checks if the provided email belongs to the current user.
 * @param {string} email - The email to check.
 * @returns {string} - Returns '(You)' if the email belongs to the current user, otherwise an empty string.
 */
function isItMyEmail(email) {
    getCurrentUserFromLocalStorage(); 
    return (email === currentUserEmail) ? '(You)' : ''; 
}


/**
 * Filters and renders contacts by their first letter in the contact list.
 * @param {Object} contacts - The contacts to filter.
 */
function filterContactsByFirstLetter(contacts) {
    let contactsArray = Object.values(contacts);
    let contactList = document.getElementById("contactList"); 
    for (let i = 0; i < 26; i++) {
        let contacts_i = contactsArray.filter(contact => contact.name.toUpperCase().startsWith(letter(i)));
        if(contacts_i.length){
            contactList.innerHTML += renderContactListHeadline(i);
            contacts_i.forEach(contact => {
                contactList.innerHTML += renderContactInList(contact.name, contact.email, contact.phone, isItMyEmail(contact.email), contact.backgroundcolor); 
            });
        }
    }
}


/**
 * Sorts contacts alphabetically by their names.
 * @param {Object} contacts - The contacts to sort.
 * @returns {Object} - The sorted contacts as an object.
 */
function sortContactsAlphabetically(contacts) {
    let contactsArray = Object.values(contacts);
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    let sortedContacts = {};
    contactsArray.forEach((contact, index) => {
        sortedContacts[`contact${index + 1}`] = contact;
    });
    return sortedContacts;
}


/**
 * Adds a new contact based on the input values from the form.
 * @param {Event} event - The event triggered by the form submission.
 */
async function addContact(event) { 
    event.preventDefault();
    let name = document.getElementById("addContactName").value;
    let email = document.getElementById("addContactEmail").value;
    let phone = document.getElementById("addContactPhone").value;	
    let backgroundcolor = setBackgroundcolor();
    await postContact("contacts", name, email, phone, backgroundcolor); 
    closeContactDialog(event);
    await loadContactList(); 
    loadContactDetails(name, email, phone, backgroundcolor)
    showAddContactSuccessMessage(); 
}


/**
 * Saves the edited contact based on the input values from the form.
 * @param {Event} event - The event triggered by the form submission.
 */
async function saveEditedContact(event) { 
    event.preventDefault();
    let name = document.getElementById("editContactName").value;
    let email = document.getElementById("editContactEmail").value;
    let phone = document.getElementById("editContactPhone").value;
    let backgroundcolor = document.getElementById("edit_contact_img").classList[1];
    let i = await findContactPositionByEmail(contactToEdit);	
    await patchContact("contacts/" + i, name, email, phone, backgroundcolor);  
    closeEditContactDialog();
    loadContactDetails(name, email, phone, backgroundcolor);
    await loadContactList(); 
    contactToEdit = null;
}


/**
 * Deletes a contact by its email in the contactlist and in all tasks where the contact is assigned.
 * @param {string} email - The email of the contact to delete.
 */
async function deleteContact(email) {
    let position = await findContactPositionByEmail(email); 
    let contacts = await getAllContacts();
    let name = contacts[position].name;
    await deleteContactInList(email);
    await deleteContactInTask(name);
}


/**
 * Deletes a contact from the contact list based on the provided email.
 *
 * This asynchronous function first finds the position of the contact in the list using the email.
 * If the contact is found, it sends a DELETE request to the server to remove the contact.
 * Upon successful deletion, it reloads the contact list and clears the contact details displayed on the page.
 * It also shows a success message to the user.
 *
 * @async
 * @param {string} email - The email address of the contact to be deleted.
 * @returns {Promise<void>} A promise that resolves when the contact has been deleted or if the contact is not found.
 */
async function deleteContactInList(email) {
    let path = "contacts";
    let position = await findContactPositionByEmail(email); 
    if (position === null) return; 
    try {
        let response = await fetch(BASE_URL + path + "/"  + position + ".json", { method: "DELETE" });
        if (response.ok) {
            await loadContactList();
            document.getElementById("contactDetails").innerHTML = ''; 
            showDeleteContactSuccessMessage();
        } 
    } catch (error) {}
}


async function deleteContactInTask(name) {
    let path = "tasks";
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].assignedTo === name) {
            await deleteAssignedToInTask(path, email);
        }
    }
}


/**
 * Finds the position of a contact by its email.
 * @param {string} email - The email of the contact to find.
 */
async function findContactPositionByEmail(email) {
    let contacts = await getAllContacts(); 
    for (let i in contacts) {
        if (contacts[i].email === email) {
            return i;
        } 
    } 
    return null;
}


/**
 * Displays a success message after deleting a contact.
 */
function showDeleteContactSuccessMessage() {
    let successMessage = document.getElementById("deleteContactSuccess");
    successMessage.classList.add("d_none");
    void successMessage.offsetWidth; 
    successMessage.classList.remove("d_none");
    setTimeout(() => {
        successMessage.classList.add("d_none"); 
    }, 3000);
}


/**
 * Selects a contact from the list by adding a 'click' class to the selected contact
 * and removing it from all other contacts.
 * @param {Event} event - The event object that triggered the contact selection.
 */
function selectContact(event) {
    document.querySelectorAll('.contactInList').forEach(contact => {
        contact.classList.remove('click');
    });
    event.currentTarget.classList.add('click');
}


/**
 * Generates the initials from a given contact name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the contact's name in uppercase.
 */
function setContactInitials(name) {
    let contactName = name.toUpperCase();
    let contactNames = contactName.split(" ");
    let contactNameInitial = [];
    for (let index = 0; index < contactNames.length; index++) {
        contactNameInitial += contactNames[index].at(0);
    }    
    return contactNameInitial;
}

/**
 * Converts an index to its corresponding uppercase letter (A-Z).
 * @param {number} i - The index (0 for 'A', 1 for 'B', etc.).
 * @returns {string} The uppercase letter corresponding to the index.
 */
function letter(i) {
    let result = String.fromCharCode(65 + i); 
    return result;
}


/**
 * Generates a random background color class name. This backgroundcolor is used to style the icon with the contact initials 
 * @returns {string} A string representing a random background color class.
 */
function setBackgroundcolor() {
    number = Math.floor(Math.random() * 16) + 1;
    return `backgroundColor${number}`;
}


/**
 * Toggles the visibility of the responsive contact details menu.
 *
 * Adds or removes the 'respContactEditMenuClosed' class from the contact details menu
 * to show or hide it based on its current state.
 */
function toggleRespMenuContacts() {    
    document.getElementById("contactDetailsMenu").classList.toggle("respContactEditMenuClosed");
}


/**
 * Closes the contact details menu when clicking outside of it.
 *
 * This event listener is attached to the entire document and checks
 * if a click occurred outside of both the menu and the button that toggles it.
 * If the menu is open (i.e., does not have the 'respContactEditMenuClosed' class),
 * it adds this class to close it.
 *
 * @listens document#click
 */
document.addEventListener('click', function(event) {
    const menu = document.getElementById('contactDetailsMenu');
    const button = document.getElementById('theePointsMenu');
    if (!menu || !button) return;
    const clickedOutside = !menu.contains(event.target) && !button.contains(event.target);
    if (clickedOutside && !menu.classList.contains('respContactEditMenuClosed')) {
        menu.classList.add('respContactEditMenuClosed');
    }
});


/**
 * Resets the contact view to show the contact list.
 * Hides the contact detail view, main contact section, and the menu,
 * and displays the full contact list container again.
 */
function backToContactList() {
    document.querySelector('.main_contacts').style.display = 'none';
    document.querySelector('#contactDetails').style.display = 'none';
    document.querySelector('.theePointsMenu').style.display = 'none';
    document.querySelector('.contacts').style.display = 'unset';
}