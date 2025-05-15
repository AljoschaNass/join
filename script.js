/**
 * Initializes the application by including HTML components and checking for non-null IDs.
 */
function init() {
    include();
    checkIdNotNull();
}


/**
 * This function ensures that the HTML is loaded before proceeding to apply highlights and set user
 * profile initials.
 *
 * The following functions are called in sequence:
 * - `includeHTML()`: Loads and includes HTML content dynamically.
 * - `setHighlight()`: Applies highlighting to specific elements in the UI.
 * - `setUserProfileInitials()`: Sets the initials for the user profile display.
 *
 * @async
 * @returns {Promise<void>} A promise that resolves when the HTML is included
 * and the UI elements are set up.
 */
async function include() {
    await includeHTML();
    setHighlight();
    setUserProfileInitials();
}


/**
 * Includes HTML content from external files into elements with the attribute `w3-include-html`.
 * It fetches the content and inserts it into the respective elements.
 * If the file is not found, it displays a "Page not found" message.
 *
 * @async
 */
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
    setUserProfileInitials();
}


/**
 * Fetches data of all users from the database.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to the JSON response containing user data.
 */
async function getAllUsers(){
    let path = "user";
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}
  

/**
 * Saves the current user's email and name to local storage.
 *
 * @param {string} email - The email of the current user.
 * @param {string} name - The name of the current user.
 */
function saveCurrentUserToLocalStorage(email, name) {
    localStorage.setItem(`currentUserName`, JSON.stringify(name));
    localStorage.setItem(`currentUserEmail`, JSON.stringify(email));
}

  
 /**
 * Retrieves the current user's name and email from local storage.
 *
 * @returns {Object} An object containing the current user's name and email.
 */ 
function getCurrentUserFromLocalStorage() {
    currentUserName = JSON.parse(localStorage.getItem(`currentUserName`));
    currentUserEmail = JSON.parse(localStorage.getItem(`currentUserEmail`));
}


/**
 * Navigates back to the previous page in the browser's history.
 */
function backToPreviousPage() {
    history.back();
}
