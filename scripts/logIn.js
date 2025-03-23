/*Toggles Password Visibility - onclick of the eye icon; Problem: currently included as background-img*/
/*Still missing: toggle background-image*/
function togglePasswordVisibility() {
    var x = document.getElementById("logInPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    //document.getElementById("myImg").style.backgroundImage = "url(visibility.svg)";
  } 