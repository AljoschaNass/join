/*Toggles Password Visibility */
function togglePasswordVisibility(inputId) {
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
function onFocus(inputId) {
  let x = document.getElementById(inputId);
  x.style.borderColor = "#29ABE2";
  let img = document.getElementById(inputId + "Img");
  img.src = "../assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt 
  img.alt = "Password Hidden";
}
   
/*Changes the color of the input field & field icon when not focused */
function onBlur(inputId) {
  let x = document.getElementById(inputId);
  x.style.borderColor = "#D9D9D9";
  let img = document.getElementById(inputId + "Img");
  img.src = "../assets/img/icons/lock.svg";// Icon für Passwort 
  img.alt = "Password";
  x.type = "password";
}

async function getAllUsers(){
  let path = "user"; // Pfad zu den Benutzerdaten
  let response = await fetch(BASE_URL + path + ".json");
  return responseToJson = await response.json();
}

async function logIn() {
  let email = document.getElementById("logInEmail").value;
  let password = document.getElementById("logInPassword").value;

  let users = await getAllUsers();  // ein Objekt kein Array -> fixen
  console.log(users);

    let user = users.find (u => u.email === email && u.password === password);
    console.log(user);

    if (user) {
      currentUserEmail = email;
      currentUserName = user.name;
      window.location.href = "../html/summary.html";
    } else {
      alert("Invalid email or password!"); // Abändern zu logIn_error anzeigen
    }
  }
