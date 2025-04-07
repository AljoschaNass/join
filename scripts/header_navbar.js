
let oldQuickLink = "summary";
let newQuickLink = "summary";

function toggleRespMenu() {    
    document.getElementById("resp_menu").classList.toggle("resp_menu_closed");
}

function toogleBgRespMenu(){
    document.getElementById("header_user_profile").classList.toggle("bg_grey");
}

function highlightSelectedQuickLinks(id){
    sessionStorage.setItem("oldQuickLink", sessionStorage.getItem("newQuickLink"));
    sessionStorage.setItem("newQuickLink", id);
}

function setHighlight() {  
    let savedOldQuickLink = sessionStorage.getItem("oldQuickLink");
    let savedNewQuickLink = sessionStorage.getItem("newQuickLink");
    if (!savedOldQuickLink) {
        sessionStorage.setItem("oldQuickLink", "summary");
    }
    if(savedNewQuickLink != "help") {
        document.getElementById("quick_link_" + savedNewQuickLink).classList.add("bg_dark_blue");
        document.getElementById("quick_link_" + savedNewQuickLink).removeAttribute("href");
    }
    if(savedNewQuickLink == "privacy_police" || savedNewQuickLink == "legal_notice") {
        document.getElementById("quick_link_" + savedNewQuickLink).classList.remove("footer_link_hover");
        document.getElementById("header_right").classList.add("d_none");
    }
    if (savedOldQuickLink != savedNewQuickLink || savedOldQuickLink == "help") {                    
        document.getElementById("quick_link_" + savedOldQuickLink).classList.remove("bg_dark_blue");
    }
    if(savedNewQuickLink == "help") {
        document.getElementById("addTask_help_link").classList.add("d_none");
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
function goToLogInOrPage(page){
    getCurrentUserFromLocalStorage();
    if (currentUserName == null) {
        ref = "../index.html";
        window.location.href = ref;
    } else {
        ref = "./" + page + ".html";
        window.location.href = ref;
    }
}