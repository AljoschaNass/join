async function postUser(path="user", name, email, password){//erstellen neuer recoursen - nicht idempotent, dh mehrere ausführungen können mehrere einträge erzeugen
    let user = {
        'name': name, 
        'email': email,
        'password': password
    };
    let response = await fetch(BASE_URL + path + ".json", {
        method: "POST", headers: {'Content-Type': 'application/json', }, body: JSON.stringify(user)
    });
    let responseToJson = await response.json();
    return responseToJson;
}

async function signUp() { 
    let name = document.getElementById("signUpName").value;
    let email = document.getElementById("signUpEmail").value;
    let password = document.getElementById("signUpPassword").value;
    let passwordCheck = document.getElementById("signUpConfirmPassword").value;
    if (password === passwordCheck) {
        await postUser("user", name, email, password); 
        sessionStorage.setItem("signUpSuccess", "true");
        window.location.href = "../index.html";
    } else {
        document.getElementById("logIn_error").classList.remove("d_none");
    }
}

function enableSignUpButton() {
    let name = document.getElementById("signUpName");
    let email = document.getElementById("signUpEmail");
    let password = document.getElementById("signUpPassword");
    let passwordCheck = document.getElementById("signUpConfirmPassword");
    let signUpBtn = document.getElementById("signUpBtn");
    signUpBtn.disabled = true; 
    signUpBtn.classList.remove("signUpBtn_enabled"); 
    if (name.value && email.value && password.value && passwordCheck.value) {
        signUpBtn.disabled = false; 
        signUpBtn.classList.add("signUpBtn_enabled"); 
    } 
}