/*Toggles Password Visibility */
function togglePasswordVisibility(inputId) {
    var x = document.getElementById(inputId);
    if (x.type === "password") {
      x.type = "text";
      var img = document.getElementById(inputId + "Img");
      img.src = "../assets/img/icons/visibility.svg"; // Icon für Passwort sichtbar
    } else {
      x.type = "password";
      var img = document.getElementById(inputId + "Img");
      img.src = "../assets/img/icons/visibility_off.svg";// Icon für Passwort versteckt
    }
  } 