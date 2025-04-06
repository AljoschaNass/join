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

/*loads user data from remote storage
async function loadUser(path=""){
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    return responseToJson;
}
    */