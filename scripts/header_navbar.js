
let oldQuickLink = "summary";
let newQuickLink = "summary";

function toggleRespMenu() {    
    document.getElementById("resp_menu").classList.toggle("resp_menu_closed");
    document.getElementById("header_user_profile").classList.toggle("bg_grey");
}


function highlightSelectedQuickLinks(id){
    sessionStorage.setItem("oldQuickLink", sessionStorage.getItem("newQuickLink"));
    sessionStorage.setItem("newQuickLink", id);
}


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


function setOldLinkToSummaryIfNull(savedOldQuickLink) {
    if (!savedOldQuickLink) {
        sessionStorage.setItem("oldQuickLink", "summary");
    } 
}


function setBgQuickLinksNavbar(savedNewQuickLink) {
    if(savedNewQuickLink != "help") {
        document.getElementById("quick_link_" + savedNewQuickLink).classList.add("bg_dark_blue");
        document.getElementById("quick_link_" + savedNewQuickLink).removeAttribute("href");
    }
}


function ifQuickLinkSameOrHelp(savedOldQuickLink, savedNewQuickLink) {
    if (savedOldQuickLink != savedNewQuickLink || savedOldQuickLink == "help") {                    
        document.getElementById("quick_link_" + savedOldQuickLink).classList.remove("bg_dark_blue");
    }
}


function hideHeaderRight(savedNewQuickLink) {
    if(savedNewQuickLink == "privacy_police" || savedNewQuickLink == "legal_notice") {
        document.getElementById("quick_link_" + savedNewQuickLink).classList.remove("footer_link_hover");
        document.getElementById("header_right").classList.add("d_none");
    }
}


function hideHelpIconHeader(savedNewQuickLink) {
    if(savedNewQuickLink == "help") {
        document.getElementById("quick_link_help").classList.add("d_none");
    }
}


function checkIdNotNull() {
    let ref = document.getElementById("quick_link_summary");
    if(ref != null) {
        setHighlight();
    }
}


function logOut() {
    localStorage.removeItem("currentUserName");
    localStorage.removeItem("currentUserEmail");
    window.location.href = "../index.html";
    currentUserEmail = "";
    currentUserName = ""; 
}


function showNavbarIfLoggedIn(){
    getCurrentUserFromLocalStorage();
    if (currentUserName == null) {
        document.getElementById("navbar_logout").classList.remove("d_none");
        document.getElementById("navbar_login").classList.add("d_none");
    }
}


function setUserProfileInitials() {
    let userNameRef = JSON.parse(localStorage.getItem(`currentUserName`)).toUpperCase();
    let userNamesRef = userNameRef.split(" ");
    let userNameInitial = [];
    for (let index = 0; index < userNamesRef.length; index++) {
        userNameInitial += userNamesRef[index].at(0);
    }    
    document.getElementById("header_user_profile").innerText = userNameInitial;
}