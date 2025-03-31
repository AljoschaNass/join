async function postUser(path="user", name, email, password){//erstellen neuer recoursen - nicht idempotent, dh mehrere ausführungen können mehrere einträge erzeugen
    let user = {
        'name': name,
        'email': email,
        'password': password
    };
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    });
    let responseToJson = await response.json();
    console.log('post: ' + responseToJson);
    return responseToJson;
}

async function signUp() {
    let name = document.getElementById("signUpName").value;
    let email = document.getElementById("signUpEmail").value;
    let password = document.getElementById("signUpPassword").value;

    let response = await postUser("user", name, email, password);
    console.log(response);

    if (response.name) {
        alert("User created successfully!");
        window.location.href = "../index.html";
    } else {
        alert("Error creating user: " + response.error);
    }
}

