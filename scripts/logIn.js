/*Toggles Password Visibility*/
function togglePasswordVisibility(inputId) {
  var x = document.getElementById(inputId);
  if (x.type === "password") {
    x.type = "text";
    let img = document.getElementById(inputId + "Img");
    img.src = "./assets/img/icons/visibility.svg"; // Icon für Passwort sichtbar
    img.alt = "Password Visible";
  } else {
    x.type = "password";
    let img = document.getElementById(inputId + "Img");
    img.src = "./assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt
    img.alt = "Password Hidden";
  }
} 

/*Changes the color of the input field & field icon when focused */
function onFocus(inputId) {
  let x = document.getElementById(inputId);
  x.style.borderColor = "#29ABE2";
  let img = document.getElementById(inputId + "Img");
  img.src = "./assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt 
  img.alt = "Password Hidden";
}
   
/*Changes the color of the input field & field icon when not focused */
function onBlur(inputId) {
  let x = document.getElementById(inputId);
  x.style.borderColor = "#D9D9D9";
  let img = document.getElementById(inputId + "Img");
  img.src = "./assets/img/icons/lock.svg";// Icon für Passwort 
  img.alt = "Password";
  x.type = "password";
}

/*Allows the user to log in personal account*/
async function logIn() {
  let email = document.getElementById("logInEmail").value;
  let password = document.getElementById("logInPassword").value;
  let users = await getAllUsers();
  let user = Object.values(users).find(u => u.email === email && u.password === password);
  if (user) {
    saveCurrentUserToLocalStorage(user.email, user.name);
    window.location.href = "./html/summary.html";
  } else {
    document.getElementById("logIn_error").classList.remove("d_none");
  }
}

/*Log in for guest user*/
function logInGuest() {
  currentUserEmail = "";
  currentUserName = "Guest";
  saveCurrentUserToLocalStorage(currentUserEmail, currentUserName);
  window.location.href = "./html/summary.html";
}