/*Toggles Password Visibility - onclick of the eye icon; Problem: currently included as background-img*/
function togglePasswordVisibility() {
    var x = document.getElementById("logInPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  } 