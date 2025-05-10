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
