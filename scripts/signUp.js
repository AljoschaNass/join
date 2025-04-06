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
    let passwordCheck = document.getElementById("signUpConfirmPassword").value;
    if (password !== passwordCheck) {
        alert("Passwords do not match!");//Ändern zu : signUp_error anzeigen
        return;
    } else {
        let response = await postUser("user", name, email, password);
        console.log(response);
        if (response.name) {
            alert("User created successfully!");// Abändern zu You Signed Up successfully Message
            // Redirect to login page or home page vor 
            window.location.href = "../index.html";
        }
    }
}

/*function checkInputs() {
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            allFilled = false;
        }
    });
    submitButton.disabled = !allFilled;
}*/

