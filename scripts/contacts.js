async function postContact(path="contacts", name, email, phone, backgroundcolor){//erstellen neuer recoursen - nicht idempotent, dh mehrere ausführungen können mehrere einträge erzeugen
    let contact = {
        'name': name, 
        'email': email,
        'phone': phone,
        'backgroundcolor': backgroundcolor
    };
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(contact)
    });
    let responseToJson = await response.json();
    return responseToJson;
}


async function patchContact(path, name, email, phone, backgroundcolor){ //patch statt put, da patch nur teile überscreibt. put überschreibt alles!
    let contact = {
        'name': name, 
        'email': email,
        'phone': phone,
        'backgroundcolor': backgroundcolor
    };
    let response = await fetch(BASE_URL + path + ".json", {
        method: "PATCH", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(contact)
    });
    let responseToJson = await response.json();
    return responseToJson;
}


async function getAllContacts(){
    let path = "contacts";
    let response = await fetch(BASE_URL + path + ".json");   
    return responseToJson = await response.json();
}


async function getAllUsersToContacts(){
    let path = "user";
    let response = await fetch(BASE_URL + path + ".json");   
    let users = await response.json();
    for (let i in users) {
        let contact = users[i];
        await postContact("contacts", contact.name, contact.email, contact.phone, setBackgroundcolor());
    }
}


function loadContactDetails(name, email, phone, backgroundcolor) {
    let contactCard = document.getElementById("contactDetails"); 
    contactCard.innerHTML = ''; // Clear the contact card before adding new contacts
    contactCard.innerHTML += renderContactDetails(name, email, phone, isItMyEmail(email), backgroundcolor); 
}


async function loadContactList() {
    let contacts = await getAllContacts(); 
    let sortedContacts = sortContactsAlphabetically(contacts);
    let contactList = document.getElementById("contactList"); 
    contactList.innerHTML = renderContactListHeader(); 
    filterContactsByFirstLetter(sortedContacts);
}


function isItMyEmail(email) {
    getCurrentUserFromLocalStorage(); 
    return (email === currentUserEmail) ? '(You)' : ''; 
}


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


function sortContactsAlphabetically(contacts) {
    let contactsArray = Object.values(contacts);
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    let sortedContacts = {};
    contactsArray.forEach((contact, index) => {
        sortedContacts[`contact${index + 1}`] = contact;
    });
    return sortedContacts;
}


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


async function deleteContact(email) {
    let path = "contacts";
    let position = await findContactPositionByEmail(email); 
    if (position === null) {
        return; 
    }
    try {
        let response = await fetch(BASE_URL + path + "/"  + position + ".json", { method: "DELETE" });
        if (response.ok) {
            await loadContactList();
            document.getElementById("contactDetails").innerHTML = ''; 
        } 
    } catch (error) {
    }
}


async function findContactPositionByEmail(email) {
    let contacts = await getAllContacts(); 
    for (let i in contacts) {
        if (contacts[i].email === email) {
            return i;
        } 
    } 
    return null;
}


function showAddContactSuccessMessage() {
    let successMessage = document.getElementById("addContactSuccess");
    successMessage.classList.add("d_none");
    void successMessage.offsetWidth; // Triggern der Reflow, um die Animation zurückzusetzen
    successMessage.classList.remove("d_none");
}


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


function openEditContactDialog(event) {
    event.stopPropagation(); 
    let overlayRef = document.getElementById("overlayEditContacts");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.remove("d_none");
    enableCreateContactButton();
    const dialogElement = document.getElementById("edit_contact_background");
    dialogElement.addEventListener("click", (event) => {closeEditContactDialog();});
    const editContactContainer = document.querySelector('#edit_contact_container');
    editContactContainer.addEventListener("click", (event) => {event.stopPropagation();});
}


function closeContactDialog(event) {
    event.preventDefault();
    let overlayRef = document.getElementById("overlayContacts");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.add("d_none");
    document.getElementById("addContactName").value = null;
    document.getElementById("addContactEmail").value = null;
    document.getElementById("addContactPhone").value = null;
    disableCreateContactButton();
}


function closeEditContactDialog() {
    let overlayRef = document.getElementById("overlayEditContacts");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.add("d_none");
    enableEditContactButton();
    contactToEdit = null;
    document.getElementById("edit_contact_img").classList.remove("backgroundColor1", "backgroundColor2", "backgroundColor3", "backgroundColor4", "backgroundColor5", "backgroundColor6", "backgroundColor7", "backgroundColor8", "backgroundColor9", "backgroundColor10", "backgroundColor11", "backgroundColor12", "backgroundColor13", "backgroundColor14", "backgroundColor15", "backgroundColor16");
}


function selectContact(event) {
    document.querySelectorAll('.contactInList').forEach(contact => {
        contact.classList.remove('click');
    });
    event.currentTarget.classList.add('click');
}


function setContactInitials(name) {
    let contactName = name.toUpperCase();
    let contactNames = contactName.split(" ");
    let contactNameInitial = [];
    for (let index = 0; index < contactNames.length; index++) {
        contactNameInitial += contactNames[index].at(0);
    }    
    return contactNameInitial;
}


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


function enableEditContactButton() {
    let name = document.getElementById("editContactName");
    let email = document.getElementById("editContactEmail");
    let phone= document.getElementById("editContactPhone");
    let createContactBtn = document.getElementById("saveContactBtn");
    disableEditContactButton();
    if (name.value && email.value && phone.value) {
        createContactBtn.disabled = false; 
        createContactBtn.classList.add("saveContactBtn_enabled"); 
        createContactBtn.classList.remove("saveContactBtn_disabled");
    } 
}


function disableCreateContactButton() {
    let createContactBtn = document.getElementById("saveContactBtn");
    createContactBtn.disabled = true; 
    createContactBtn.classList.remove("addContactBtn_enabled"); 
}


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


function letter(i) {
    let result = String.fromCharCode(65 + i); // 65 ist der ASCII-Wert für 'A'
    return result;
}


function setBackgroundcolor() {
    number = Math.floor(Math.random() * 16) + 1;
    return `backgroundColor${number}`;
}


function fillInputFieldsWithCurrentData(name, email, phone, backgroundcolor) {
    document.getElementById("editContactName").value = name;
    document.getElementById("editContactEmail").value = email;
    contactToEdit = email;
    document.getElementById("editContactPhone").value = phone;
    document.getElementById("edit_contact_img").classList.add(backgroundcolor);
    document.getElementById("edit_contact_img").innerHTML = setContactInitials(name);
}


async function deleteContactInEditDialog(event) { 
    event.preventDefault();
    event.stopPropagation();
    let email = document.getElementById("editContactEmail").value;	
    deleteContact(email);
    closeEditContactDialog();
    await loadContactList();
    contactToEdit = null;
}
