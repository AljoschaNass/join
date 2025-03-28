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

    /*document.getElementById('signUpTogglePassword').addEventListener('click', function () {
      const passwordInput = document.getElementById('password');
      const toggleIcon = this;
  
      if (passwordInput.type === 'password') {
          passwordInput.type = 'text';
          toggleIcon.src = '../assets/img/icons/visibility.svg'; // Icon für Passwort sichtbar
          toggleIcon.alt = 'visibility'; // Alternativtext ändern
      } else {
          passwordInput.type = 'password';
          toggleIcon.src = '../assets/img/icons/visibility_off.svg'; // Icon für Passwort versteckt
          toggleIcon.alt = 'visibility off'; // Alternativtext ändern
      }
  }); */