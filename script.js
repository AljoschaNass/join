// Add an event listener to check the orientation on window resize
window.addEventListener("resize", checkOrientation);
// Initial check for orientation when the script loads
checkOrientation();


/**
 * Checks the current orientation of the window.
 * If the window is in landscape mode, a visual message is displayed,
 * otherwise it is hidden.
 * 
 * @returns {void}
 */
function checkOrientation() {
    let orientationMessage = document.getElementById("orientationMessage");
    if ((window.innerWidth < 1025 || window.innerHeight < 900) && window.innerHeight < window.innerWidth) {
        orientationMessage.style.display = "flex";
    } else {
        orientationMessage.style.display = "none";
    }
}


/**
 * Initializes the application by including HTML components and checking for non-null IDs.
 */
async function init() {
    await include();
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
    const includeElements = document.querySelectorAll('[w3-include-html]');
    
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("w3-include-html");

        if (!file) {
            console.warn('Kein gültiger Pfad im Attribut "w3-include-html"', element);
            continue; // gehe zum nächsten Element
        }

        try {
            const resp = await fetch(file);
            if (resp.ok) {
                element.innerHTML = await resp.text();
            } else {
                element.innerHTML = 'Seite nicht gefunden';
            }
        } catch (err) {
            console.error('Fehler beim Laden der Datei:', file, err);
            element.innerHTML = 'Fehler beim Laden';
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


/**
 * Checks if the user is logged in by verifying the presence of
 * the current user's email and name in local storage.
 * If both are not found, the user is redirected to the index page.
 *
 * @returns {void} This function does not return a value.
 */
function checkUserLogIn() {
    currentUserEmail = localStorage.getItem("currentUserEmail"); 
    currentUserName = localStorage.getItem("currentUserName"); 
    if(currentUserEmail === null && currentUserName === null) {
        window.location.href = "../index.html";
    }
}