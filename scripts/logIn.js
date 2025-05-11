/**
 * Toggles the visibility of the password input field.
 * @param {string} inputId - The ID of the input field whose visibility is toggled.
 * @returns {void}
 */
function togglePasswordVisibility(inputId) {
  var x = document.getElementById(inputId);
    let img = document.getElementById(inputId + "Img");
    if (x.type === "password") {
        x.type = "text";
        img.src = "./assets/img/icons/visibility.svg"; 
        img.alt = "Password Visible";
    } else {
        x.type = "password";
        img.src = "./assets/img/icons/visibility_off.svg";
        img.alt = "Password Hidden";
    }
}


/**
 * Changes the color of the input field and field icon when focused.
 * @param {string} inputId - The ID of the input field that is changed.
 * @returns {void}
 */
function onFocus(inputId) {
  let x = document.getElementById(inputId);
  x.style.borderColor = "#29ABE2";
  let img = document.getElementById(inputId + "Img");
  img.src = "./assets/img/icons/visibility_off.svg";
  img.alt = "Password Hidden";
}


/**
 * Changes the color of the input field and field icon when no longer focused.
 * @param {string} inputId - The ID of the input field that is changed.
 * @returns {void}
 */
function onBlur(inputId) {
  let x = document.getElementById(inputId);
  x.style.borderColor = "#D9D9D9";
  x.type = "password";
  let img = document.getElementById(inputId + "Img");
  img.src = x.value === "" ? "./assets/img/icons/lock.svg" : "./assets/img/icons/visibility_off.svg";
  img.alt = x.value === "" ? "Password" : "Password Hidden";
}


/**
 * Handles the click event on the password visibility toggle image.
 * This function manually triggers the onblur event of the input field
 * and toggles the visibility of the password.
 *
 * @param {string} inputId - The ID of the input field whose password visibility is to be toggled.
 * @returns {void}
 */
function handleImageClick(inputId) {
  let input = document.getElementById(inputId);
  input.focus(); 
  togglePasswordVisibility(inputId); 
}


/**
 * Allows the user to log in to their personal account.
 * @returns {Promise<void>} - A promise that resolves when the login process is complete.
 */
async function logIn() {
  let thisEmail = document.getElementById("logInEmail").value;
  let thisPassword = document.getElementById("logInPassword").value;
  let users = await getAllUsers();
  let user = Object.values(users).find(u => u.email === thisEmail && u.password === thisPassword);
  checkUser(user);
}


/**
 * Checks whether the user is registered and saves the current user to local storage or displays an error message.
 * @param {Object} user - The user object to check.
 * @returns {void}
 */
function checkUser(user) {
  if (user) {
    saveCurrentUserToLocalStorage(user.email, user.name);
    window.location.href = "./html/summary.html";
  } else {
    logInError();
  } 
}


/**
 * Displays an error message for failed login attempts.
 * @returns {void}
 */
function logInError() {
  document.getElementById("logIn_error").classList.remove("d_none");
  document.getElementById("logInPassword").style.borderColor = "#ff001f";
  document.getElementById("logInEmail").style.borderColor = "#ff001f";
  document.getElementById("logInPassword").value = "";
}


/**
 * Logs in as a guest user.
 * @returns {void}
 */
function logInGuest() {
  currentUserEmail = "";
  currentUserName = "Guest";
  saveCurrentUserToLocalStorage(currentUserEmail, currentUserName);
  window.location.href = "./html/summary.html";
}