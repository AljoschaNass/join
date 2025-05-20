/**
 * Stores the ID of the previously selected quick link in the navigation.
 * Defaults to "summary".
 * @type {string}
 */
let oldQuickLink = "summary";


/**
 * Stores the ID of the currently selected quick link in the navigation.
 * Defaults to "summary".
 * @type {string}
 */
let newQuickLink = "summary";


/**
 * Toggles the responsive menu visibility by
 * adding/removing the 'resp_menu_closed' class,
 * and toggles the background color of the user profile header.
 */
function toggleRespMenu() {    
    document.getElementById("resp_menu").classList.toggle("resp_menu_closed");
    document.getElementById("header_user_profile").classList.toggle("bg_grey");
}


/**
 * Updates sessionStorage to track the currently
 * and previously selected quick link by their IDs.
 * @param {string} id - The ID of the newly selected quick link.
 */
function highlightSelectedQuickLinks(id){
    sessionStorage.setItem("oldQuickLink", sessionStorage.getItem("newQuickLink"));
    sessionStorage.setItem("newQuickLink", id);
}


/**
 * Sets the highlight state of the navigation bar based on
 * saved sessionStorage values for quick link selections.
 * Performs UI adjustments including showing the navbar if logged in,
 * setting background highlights, and hiding/showing header elements.
 */
function setHighlight() {  
    showNavbarIfLoggedIn();
    let savedOldQuickLink = sessionStorage.getItem("oldQuickLink");
    let savedNewQuickLink = sessionStorage.getItem("newQuickLink");
    setOldLinkToSummaryIfNull(savedOldQuickLink)
    setBgQuickLinksNavbar(savedNewQuickLink);
    ifQuickLinkSameOrHelp(savedOldQuickLink, savedNewQuickLink);
    hideHeaderRight(savedNewQuickLink);
    hideHelpIconHeader(savedNewQuickLink);
}


/**
 * Sets the "oldQuickLink" sessionStorage value to "summary"
 * if it is currently null or undefined.
 * @param {string|null} savedOldQuickLink - The current value of "oldQuickLink" from sessionStorage.
 */
function setOldLinkToSummaryIfNull(savedOldQuickLink) {
    if (!savedOldQuickLink) {
        sessionStorage.setItem("oldQuickLink", "summary");
    } 
}


/**
 * Adds a background highlight and removes the href attribute
 * from the quick link element, unless the link is "help".
 * @param {string} savedNewQuickLink - The ID of the newly selected quick link.
 */
function setBgQuickLinksNavbar(savedNewQuickLink) {
    if(savedNewQuickLink != "help") {
        document.getElementById("quick_link_" + savedNewQuickLink).classList.add("bg_dark_blue");
        document.getElementById("quick_link_" + savedNewQuickLink).removeAttribute("href");
    }
}


/**
 * Removes the background highlight from the old quick link element
 * if the old and new quick links are different or the old quick link is "help".
 * @param {string|null} savedOldQuickLink - The ID of the previously selected quick link.
 * @param {string} savedNewQuickLink - The ID of the newly selected quick link.
 */
function ifQuickLinkSameOrHelp(savedOldQuickLink, savedNewQuickLink) {
    if (savedOldQuickLink != savedNewQuickLink || savedOldQuickLink == "help") {                    
        document.getElementById("quick_link_" + savedOldQuickLink).classList.remove("bg_dark_blue");
    }
}


/**
 * Hides the right section of the header on large screens when navigating to specific pages.
 * 
 * If the screen width is at least 1024 pixels and the selected quick link is 
 * either "privacy_police" or "legal_notice", the function removes the hover effect
 * from the quick link and hides the header's right section.
 * 
 * @param {string} savedNewQuickLink - The ID of the currently selected quick link.
 */
function hideHeaderRight(savedNewQuickLink) {
    if (window.innerWidth >= 1024) {
        if (savedNewQuickLink === "privacy_police" || savedNewQuickLink === "legal_notice") {
            document.getElementById("quick_link_" + savedNewQuickLink)?.classList.remove("footer_link_hover");
            document.getElementById("header_right")?.classList.add("d_none");
        }
    }
}


/**
 * Hides the help icon in the header when the help quick link is active.
 * @param {string} savedNewQuickLink - The ID of the newly selected quick link.
 */
function hideHelpIconHeader(savedNewQuickLink) {
    if(savedNewQuickLink == "help") {
        document.getElementById("quick_link_help").classList.add("d_none");
    }
}


/**
 * Checks if the element with ID "quick_link_summary" exists in the DOM.
 * If it exists, calls the setHighlight function to update UI highlights.
 */
function checkIdNotNull() {
    let ref = document.getElementById("quick_link_summary");
    if(ref != null) {
        setHighlight();
    }
}


/**
 * Logs out the current user by removing user data from localStorage,
 * clearing related variables, and redirecting to the login page.
 */
function logOut() {
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("currentUserEmail");
    window.location.href = "../index.html";
    currentUserEmail = "";
    currentUserName = ""; 
}


/**
 * Displays the logout navbar option and hides the login option
 * if the current user is logged in (i.e., currentUserName is not null).
 */
function showNavbarIfLoggedIn(){
    getCurrentUserFromLocalStorage();
    if (currentUserName == null) {
        document.getElementById("navbar_logout").classList.remove("d_none");
        document.getElementById("navbar_login").classList.add("d_none");
    }
}

/**
 * Sets the user profile initials in the header based on the current user's name
 * stored in localStorage. Extracts the first letter of each name part and displays them in uppercase.
 */
function setUserProfileInitials() {
    let userNameRef = JSON.parse(localStorage.getItem(`currentUserName`)).toUpperCase();
    let userNamesRef = userNameRef.split(" ");
    let userNameInitial = [];
    for (let index = 0; index < userNamesRef.length; index++) {
        userNameInitial += userNamesRef[index].at(0);
    }    
    document.getElementById("header_user_profile").innerText = userNameInitial;
}