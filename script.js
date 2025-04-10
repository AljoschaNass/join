function init() {
    includeHTML();
    checkIdNotNull();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); 
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();            
        } else {
            element.innerHTML = 'Page not found';            
        }
    }
    setHighlight();
}

/*Checks if user has just signed up and is redirected to the login page*/
function justSignedUp() {
    if (sessionStorage.getItem("signUpSuccess") === "true") {
        document.getElementById("signUpSuccess").classList.remove("d_none");
        sessionStorage.removeItem("signUpSuccess");
    }
}

/*gets data of all useres from the database */
async function getAllUsers(){
    let path = "user";
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
  }
  
  /*save currentUser to local storage*/
  function saveCurrentUserToLocalStorage(email, name) {
    localStorage.setItem(`currentUserName`, JSON.stringify(name));
    localStorage.setItem(`currentUserEmail`, JSON.stringify(email));
  }
  
  /*get current user from local storage*/ 
  function getCurrentUserFromLocalStorage() {
    currentUserName = JSON.parse(localStorage.getItem(`currentUserName`));
    currentUserEmail = JSON.parse(localStorage.getItem(`currentUserEmail`));
  }