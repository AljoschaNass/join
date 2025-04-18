async function postContact(path="contacts", name, email, phone, isItMe){//erstellen neuer recoursen - nicht idempotent, dh mehrere ausführungen können mehrere einträge erzeugen
    console.log('postContact loaded');
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
    let sortedContacts = sortContactsAlphabetically(contacts);
    let contactList = document.getElementById("contactList"); 
    contactList.innerHTML = ""; 
    for (let i in sortedContacts) {
        let contact = sortedContacts[i]; 
        let isItMe = (contact.email === currentUserEmail) ? true : false; // Check if the email is the same as the current user's email
        contactList.innerHTML += renderContactInList(contact.name, contact.email, contact.phone, isItMe); 
    } 
}


function sortContactsAlphabetically(contacts) {
    let contactsArray = Object.values(contacts);
    contactsArray.sort((a, b) => a.name.localeCompare(b.name));
    let sortedContacts = {};
    contactsArray.forEach((contact, index) => {
        sortedContacts[`contact${index + 1}`] = contact;
    });
    return sortedContacts
}


function loadContactDetails(name, email, phone, isItMe) {
    let contactCard = document.getElementById("contactDetails"); 
    contactCard.innerHTML = ''; // Clear the contact card before adding new contacts
    contactCard.innerHTML = renderContactDetails(name, email, phone, isItMe); 
}


async function addContact(event) { 
    event.preventDefault();
    console.log('addContact loaded');
    let name = document.getElementById("addContactName").value;
    let email = document.getElementById("addContactEmail").value;
    let phone = document.getElementById("addContactPhone").value;	
    isItMe = (email === currentUserEmail) ? true : false; // Check if the email is the same as the current user's email
    await postContact("contacts", name, email, phone, isItMe); 
    closeContactDialog();
    showAddContactSuccessMessage();
    await loadContactList(); 
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


function openContactDialog() {
    let overlayRef = document.getElementById("overlayContacts");
    let noScrolling = document.body;
    noScrolling.classList.add("stopScrolling");
    overlayRef.classList.remove("d_none");
    let overlayBackground = document.getElementById("add_contact_background");
    overlayBackground.addEventListener("click", (event) => {
        if (!event.target.closest('.add_contact_container')) {
            closeContactDialog();
        }
    });
}


function closeContactDialog() {
    let overlayRef = document.getElementById("overlayContacts");
    let noScrolling = document.body;
    noScrolling.classList.remove("stopScrolling");
    overlayRef.classList.add("d_none");
    document.getElementById("addContactName").value ='';
    document.getElementById("addContactEmail").value = '';
    document.getElementById("addContactPhone").value = '';
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
    console.log('enable contactbtn')
    let name = document.getElementById("addContactName");
    let email = document.getElementById("addContactEmail");
    let phone= document.getElementById("addContactPhone");
    let createContactBtn = document.getElementById("addContactBtn");
    disableCreateContactButton()
    if (name.value && email.value && phone.value) {
        createContactBtn.disabled = false; 
        createContactBtn.classList.add("addContactBtn_enabled"); 
    } 
}


function disableCreateContactButton() {
    let createContactBtn = document.getElementById("addContactBtn");
    createContactBtn.disabled = true; 
    createContactBtn.classList.remove("addContactBtn_enabled"); 
}