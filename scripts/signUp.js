/*Toggles Password Visibility*/
function toggleSignUpPasswordVisibility(inputId) {
    var x = document.getElementById(inputId);
    if (x.type === "password") {
      x.type = "text";
      let img = document.getElementById(inputId + "Img");
      img.src = "../assets/img/icons/visibility.svg"; // Icon für Passwort sichtbar
      img.alt = "Password Visible";
    } else {
      x.type = "password";
      let img = document.getElementById(inputId + "Img");
      img.src = "../assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt
      img.alt = "Password Hidden";
    }
}


/*Changes the color of the input field & field icon when focused */
function onFocusSignUp(inputId) {
    let x = document.getElementById(inputId);
    x.style.borderColor = "#29ABE2";
    let img = document.getElementById(inputId + "Img");
    img.src = "../assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt 
    img.alt = "Password Hidden";
}


/*Changes the color of the input field & field icon when not focused */
function onBlurSignUp(inputId) {
    let x = document.getElementById(inputId);
    x.style.borderColor = "#D9D9D9";
    x.type = "password";
    if (x.value == "") {
        let img = document.getElementById(inputId + "Img");
        img.src = "../assets/img/icons/lock.svg";// Icon für Passwort 
        img.alt = "Password";
    } else {
        let img = document.getElementById(inputId + "Img");
        img.src = "../assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt 
        img.alt = "Password Hidden";
    }
}
     
  
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
        document.getElementById("signUpSuccess").classList.remove("d_none");
        await postUser("user", name, email, password); 
        await postContact(path="contacts", name, email, phone='');
        setTimeout(() => {
            window.location.href = "../index.html";
        }, 1000);
    } else {
        signUpError();
    }
}


function goToLogIn() {
    window.location.href = "../index.html";
}


function signUpError() {
    document.getElementById("signUp_error").classList.remove("d_none");
    document.getElementById("signUpConfirmPassword").style.borderColor = "#ff001f";
}


function enableSignUpButton() {
    let name = document.getElementById("signUpName");
    let email = document.getElementById("signUpEmail");
    let password = document.getElementById("signUpPassword");
    let passwordCheck = document.getElementById("signUpConfirmPassword");
    let checkbox = document.getElementById("signUpCheckbox");
    let signUpBtn = document.getElementById("signUpBtn");
    disableSignUpButton();
    if (name.value && email.value && password.value && passwordCheck.value && checkbox.checked) {
        signUpBtn.disabled = false; 
        signUpBtn.classList.add("signUpBtn_enabled"); 
    } 
}


function disableSignUpButton() {
    let signUpBtn = document.getElementById("signUpBtn");
    signUpBtn.disabled = true; 
    signUpBtn.classList.remove("signUpBtn_enabled"); 
}


/*Changes the color of the input field & field icon when not focused */
function onBlurSignUp(inputId) {
    let x = document.getElementById(inputId);
    x.style.borderColor = "#D9D9D9";
    x.type = "password";
    if (x.value == "") {
        let img = document.getElementById(inputId + "Img");
        img.src = "./assets/img/icons/lock.svg";// Icon für Passwort 
        img.alt = "Password";
    } else {
        let img = document.getElementById(inputId + "Img");
        img.src = "./assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt 
        img.alt = "Password Hidden";
    }
  }