async function postContact(path="contacts", name, email, phone, isItMe){//erstellen neuer recoursen - nicht idempotent, dh mehrere ausführungen können mehrere einträge erzeugen
    let contact = {
        'name': name, 
        'email': email,
        'phone': phone,
        'isItMe': isItMe
    };
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(contact)
    });
    let responseToJson = await response.json();
    return responseToJson;
}


async function getAllContacts(){
    let path = "contacts";
    let response = await fetch(BASE_URL + path + ".json");   
    return responseToJson = await response.json();
}


async function loadContactList() {
    let contacts = await getAllContacts(); 
    let contactList = document.getElementById("contactList"); 
    contactList.innerHTML = ""; // Clear the contact list before adding new contacts
    for (let i in contacts) {
        let contact = contacts[i]; 
        let isItMe = (contact.email === currentUserEmail) ? true : false; // Check if the email is the same as the current user's email
        contactList.innerHTML += renderContactInList(contact.name, contact.email, contact.phone, isItMe); 
    } 
}


function loadContactDetails(name, email, phone, isItMe) {
    let contactCard = document.getElementById("contactDetails"); 
    contactCard.innerHTML = ""; // Clear the contact card before adding new contacts
    contactCard.innerHTML = renderContactDetails(name, email, phone, isItMe); 
}


async function addContact() { 
    let name = document.getElementById("addContactName").value;
    let email = document.getElementById("addContactEmail").value;
    let phone = document.getElementById("addContactPhone").value;	
    isItMe = (email === currentUserEmail) ? true : false; // Check if the email is the same as the current user's email
    await postContact("contacts", name, email, phone, isItMe); 
    closeContactDialog();
    document.getElementById("addContactSuccess").classList.remove("d_none");
    await loadContactList(); // Reload contacts after adding a new one
    // openContactCreatedMessage(); // Show success message
}


function openContactDialog() {
    let overlayRef = document.getElementById("overlayContacts");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.remove("d_none");
}


function closeContactDialog() {
    let overlayRef = document.getElementById("overlayContacts");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.add("d_none");
    document.getElementById("addContactName").value = "";
    document.getElementById("addContactEmail").value = "";
    document.getElementById("addContactPhone").value = "";
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