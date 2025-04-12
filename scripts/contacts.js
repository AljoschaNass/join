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


async function addContact() { 
    let name = document.getElementById("").value;
    let email = document.getElementById("").value;
    let phone = document.getElementById("").value;	
    let isItMe = (email === currentUserEmail) ? true : false; // Check if the email is the same as the current user's email
    await postContact("contacts", name, email, phone, isItMe); 
}