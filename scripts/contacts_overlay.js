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
 * Fills the input fields in the edit contact overlay with the current data of a contact, updates the background color and enables the "Edit Contact" button.
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
