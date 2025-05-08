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
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @param {string} backgroundcolor - The background color associated with the contact.
 */
function loadContactDetails(name, email, phone, backgroundcolor) {
    let contactCard = document.getElementById("contactDetails"); 
    contactCard.innerHTML = ''; 
    contactCard.innerHTML += renderContactDetails(name, email, phone, isItMyEmail(email), backgroundcolor); 
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
 * Deletes a contact by its email.
 * @param {string} email - The email of the contact to delete.
 */
async function deleteContact(email) {
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
 * Displays a success message after adding a contact.
 */
function showAddContactSuccessMessage() {
    let successMessage = document.getElementById("addContactSuccess");
    successMessage.classList.add("d_none");
    void successMessage.offsetWidth; 
    successMessage.classList.remove("d_none");
    setTimeout(() => {
        successMessage.classList.add("d_none"); 
    }, 3000); 
}


/**
 * Displays a success message after editing a contact.
 */
function showEditContactSuccessMessage() {
    let successMessage = document.getElementById("editContactSuccess");
    successMessage.classList.add("d_none");
    void successMessage.offsetWidth; 
    successMessage.classList.remove("d_none");
    setTimeout(() => {
        successMessage.classList.add("d_none"); 
    }, 3000);
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
 * Opens the contact dialog by displaying the overlay and preventing background scrolling.
 * 
 * @param {Event} event - The event object that triggered the dialog opening.
 */
function openContactDialog(event) {
    event.stopPropagation(); 
    let overlayRef = document.getElementById("overlayContacts");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.remove("d_none");
    const dialogElement = document.getElementById("add_contact_background");
    dialogElement.addEventListener("click", (event) => {closeContactDialog(); 
    });
    const contactContainer = document.querySelector('.add_contact_container');
    contactContainer.addEventListener("click", (event) => {event.stopPropagation();
    });
}


/**
 * Opens the edit contact dialog by displaying the overlay and preventing background scrolling.
 * 
 * @param {Event} event - The event object that triggered the dialog opening.
 */
function openEditContactDialog(event) {
    event.stopPropagation(); 
    let overlayRef = document.getElementById("overlayEditContacts");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.remove("d_none");
    const dialogElement = document.getElementById("edit_contact_background");
    dialogElement.addEventListener("click", (event) => {closeEditContactDialog();});
    const editContactContainer = document.querySelector('#edit_contact_container');
    editContactContainer.addEventListener("click", (event) => {event.stopPropagation();});
}


/**
 * Closes the add contact dialog by hiding the overlay, allowing background scrolling, and resetting input fields and create button.
 * 
 * @param {Event} event - The event object that triggered the dialog closing.
 */
function closeContactDialog(event) {
    event.preventDefault();
    let dialogElement = document.getElementById("add_contact_background");
    let containerElement = document.getElementById("add_contact_container");
    dialogElement.classList.add("lighten");
    containerElement.classList.add("slide-out");
    setTimeout(() => {
    document.body.classList.remove("stopScrolling");
    document.getElementById("overlayContacts").classList.add("d_none");
    resetContactDialog();
    }, 800);
}


/**
 * Resets the edit contact dialog by
 *     removing classes to reset the slide out animation,      
 *     resetting input fields 
 *     and disabling the create button.
 * 
 * @param {Event} event - The event object that triggered the dialog closing.
 */
function resetContactDialog() {
    let dialogElement = document.getElementById("add_contact_background");
    let containerElement = document.getElementById("add_contact_container");
    dialogElement.classList.remove("lighten");
    containerElement.classList.remove("slide-out");
    document.getElementById("addContactName").value = null;
    document.getElementById("addContactEmail").value = null;
    document.getElementById("addContactPhone").value = null;
    disableCreateContactButton();
}


/**
 * Closes the edit contact dialog by hiding the overlay, allowing background scrolling and resetting input fields and save button.
 * 
 * @param {Event} event - The event object that triggered the dialog closing.
 */
function closeEditContactDialog() {
    let dialogElement = document.getElementById("edit_contact_background");
    let containerElement = document.getElementById("edit_contact_container");
    dialogElement.classList.add("lighten");
    containerElement.classList.add("slide-out");
    setTimeout(() => {
        document.body.classList.remove("stopScrolling");
        document.getElementById("overlayEditContacts").classList.add("d_none");
        resetEditContactDialog();
    }, 800); 
}


/**
 * Resets the edit contact dialog by 
 *    resetting the contactToEdit variable,
 *    removing classes to reset the slide out animation,
 *    removing the background color classes from the contact icon,
 *    and enabling the edit contact button.
 */
function resetEditContactDialog() {
    let dialogElement = document.getElementById("edit_contact_background");
    let containerElement = document.getElementById("edit_contact_container");
    dialogElement.classList.remove("lighten");
    containerElement.classList.remove("slide-out");
    contactToEdit = null;
    document.getElementById("edit_contact_img").classList.remove("backgroundColor1", "backgroundColor2", "backgroundColor3", "backgroundColor4", "backgroundColor5", "backgroundColor6", "backgroundColor7", "backgroundColor8", "backgroundColor9", "backgroundColor10", "backgroundColor11", "backgroundColor12", "backgroundColor13", "backgroundColor14", "backgroundColor15", "backgroundColor16");
    enableEditContactButton();
}


/**
 * Selects a contact from the list by adding a 'click' class to the selected contact
 * and removing it from all other contacts.
 * 
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
 * 
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
 * Enables the "Create Contact" button if all required fields are filled.
 * Otherwise, it disables the button.
 */
function enableCreateContactButton() {
    let name = document.getElementById("addContactName");
    let email = document.getElementById("addContactEmail");
    let phone= document.getElementById("addContactPhone");
    let createContactBtn = document.getElementById("addContactBtn");
    disableCreateContactButton();
    if (name.value && email.value && phone.value) {
        createContactBtn.disabled = false; 
        createContactBtn.classList.add("addContactBtn_enabled"); 
    } 
}


/**
 * Enables the "Save Contact" button if all required fields are filled.
 * Otherwise, it disables the button.
 */
function enableEditContactButton() {
    let name = document.getElementById("editContactName");
    let email = document.getElementById("editContactEmail");
    let phone= document.getElementById("editContactPhone");
    let createContactBtn = document.getElementById("saveContactBtn");
    if (name.value && email.value && phone.value) {
        createContactBtn.disabled = false; 
        createContactBtn.classList.add("saveContactBtn_enabled"); 
        createContactBtn.classList.remove("saveContactBtn_disabled");
    } else {
        disableEditContactButton();
    }     
}


/**
 * Disables the "Create Contact" button if required fields are empty.
 */
function disableCreateContactButton() {
    let createContactBtn = document.getElementById("addContactBtn");
    createContactBtn.disabled = true; 
    createContactBtn.classList.remove("addContactBtn_enabled"); 
}


/**
 * Disables the "Save Contact" button if required fields are empty.
 */
function disableEditContactButton() {
    let name = document.getElementById("editContactName");
    let email = document.getElementById("editContactEmail");
    let phone= document.getElementById("editContactPhone");
    let createContactBtn = document.getElementById("saveContactBtn");
    if (name.value == '' || email.value== '' || phone.value == '') {
        createContactBtn.disabled = true; 
        createContactBtn.classList.remove("saveContactBtn_enabled"); 
        createContactBtn.classList.add("saveContactBtn_disabled");
    }
}


/**
 * Converts an index to its corresponding uppercase letter (A-Z).
 * 
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
 * Fills the input fields with the current data of a contact, updates the background color and enables the "Edit Contact" button.
 * 
 * @param {string} name - The name of the contact to be edited.
 * @param {string} email - The email of the contact to be edited.
 * @param {string} phone - The phone number of the contact to be edited.
 * @param {string} backgroundcolor - The class name for the background color to be applied.
 */
function fillInputFieldsWithCurrentData(name, email, phone, backgroundcolor) {
    document.getElementById("editContactName").value = name;
    document.getElementById("editContactEmail").value = email;
    contactToEdit = email;
    document.getElementById("editContactPhone").value = phone;
    document.getElementById("edit_contact_img").classList.add(backgroundcolor);
    document.getElementById("edit_contact_img").innerHTML = setContactInitials(name);
    enableEditContactButton();
}


/**
 * Deletes a contact in the edit dialog and updates the contact list.
 * 
 * @param {Event} event - The event object that triggered the deletion.
 */
async function deleteContactInEditDialog(event) { 
    event.preventDefault();
    event.stopPropagation();
    let email = document.getElementById("editContactEmail").value;	
    deleteContact(email);
    closeEditContactDialog();
    await loadContactList();
    contactToEdit = null;
    showDeleteContactSuccessMessage();
}