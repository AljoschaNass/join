/**
 * Toggles the visibility of the password input field.
 * @param {string} inputId - The ID of the input field whose visibility is toggled.
 * @returns {void}
 */ 
function toggleSignUpPasswordVisibility(inputId) {
    var x = document.getElementById(inputId);
    let img = document.getElementById(inputId + "Img");
    if (x.type === "password") {
        x.type = "text";
        img.src = "../assets/img/icons/visibility.svg"; 
        img.alt = "Password Visible";
    } else {
        x.type = "password";
        img.src = "../assets/img/icons/visibility_off.svg";
        img.alt = "Password Hidden";
    }
}


/**
 * Changes the color of the input field and field icon when focused.
 * @param {string} inputId - The ID of the input field that is changed.
 * @returns {void}
 */
function onFocusSignUp(inputId) {
    let x = document.getElementById(inputId);
    x.style.borderColor = "#29ABE2";
    let img = document.getElementById(inputId + "Img");
    img.src = "../assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt 
    img.alt = "Password Hidden";
}


/**
 * Changes the color of the input field and field icon when no longer focused.
 * @param {string} inputId - The ID of the input field that is changed.
 * @returns {void}
 */
function onBlurSignUp(inputId) {
    let x = document.getElementById(inputId);
    x.style.borderColor = "#D9D9D9";
    x.type = "password";
    let img = document.getElementById(inputId + "Img");
    img.src = x.value === "" ? "../assets/img/icons/lock.svg" : "../assets/img/icons/visibility_off.svg";
    img.alt = x.value === "" ? "Password" : "Password Hidden";
}
    
function handleSignUpImageClick(inputId) {
    // Manuelles Auslösen des onblur-Ereignisses des Eingabefelds
    let input = document.getElementById(inputId);
    input.focus(); // Dies löst das onblur-Ereignis aus
    toggleSignUpPasswordVisibility(inputId); // Sichtbarkeit des Passworts umschalten
}

/**
 * Sends a POST request to create a new user.
 * @async
 * @param {string} [path="user"] - The endpoint path to send the request to. Defaults to "user".
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user account.
 * @returns {Promise<Object>} A promise that resolves to the response JSON object from the server.
 * @throws {Error} Throws an error if the fetch operation fails or if the response is not valid JSON.
 */
async function postUser(path="user", name, email, password){
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


/**
 * Handles the user sign-up process.
 *
 * Retrieves user input from the sign-up form, validates the password confirmation,
 * and sends the user data to the server. If the sign-up is successful, it displays a success message
 * and redirects the user to the index page after a short delay. If the passwords do not match,
 * it triggers an error handling function.
 * @async
 * @returns {Promise<void>} A promise that resolves when the sign-up process is complete.
 * @throws {Error} Throws an error if the postUser or postContact operations fail.
 */
async function signUp() { 
    let name = document.getElementById("signUpName").value;
    let email = document.getElementById("signUpEmail").value;
    let password = document.getElementById("signUpPassword").value;
    let passwordCheck = document.getElementById("signUpConfirmPassword").value;
    if (password === passwordCheck) {
        document.getElementById("signUpSuccess").classList.remove("d_none");
        saveNewUser(name, email, password);
        delayedRedirectToLogIn();
    } else {
        signUpError();
    }
}


/**
 * Saves a new user by posting user and contact information (user's name, email and password) to the server.
 * It ensures that both operations are completed before returning.
 * @async
 * @param {string} name - The name of the new user.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user account.
 * @returns {Promise<void>} A promise that resolves when both the user and contact information have been successfully saved.
 * @throws {Error} Throws an error if either postUser or postContact operations fail.
 */
async function saveNewUser(name, email, password) {
    await postUser("user", name, email, password); 
    await postContact(path="contacts", name, email, phone='', setBackgroundcolor());
}


/**
 * Delays the redirection to the login page by 1 second.
 */
function delayedRedirectToLogIn() {
    setTimeout(() => {
        goToLogIn();
    }, 1000);
}


/**
 * Redirects the user to the login page.
 * @returns {void} 
 */
function goToLogIn() {
    window.location.href = "../index.html";
}


/**
 * Displays an error message for the sign-up process.
 * @returns {void} 
 */
function signUpError() {
    document.getElementById("signUp_error").classList.remove("d_none");
    document.getElementById("signUpConfirmPassword").style.borderColor = "#ff001f";
}


/**
 * Enables the sign-up button if all required fields are filled and the checkbox is checked.
 * @returns {void} 
 */
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


/**
 * Disables the sign-up button and removes the enabled class.
 * @returns {void} 
 */
function disableSignUpButton() {
    let signUpBtn = document.getElementById("signUpBtn");
    signUpBtn.disabled = true; 
    signUpBtn.classList.remove("signUpBtn_enabled"); 
}