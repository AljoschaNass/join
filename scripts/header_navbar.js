
let oldQuickLink = "summary";
let newQuickLink;

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
    if (savedOldQuickLink && savedNewQuickLink) {
        if (savedOldQuickLink != savedNewQuickLink) {                    
            document.getElementById("quick_link_" + savedNewQuickLink).classList.add("bg_dark_blue");
            document.getElementById("quick_link_" + savedNewQuickLink).removeAttribute("href");
            document.getElementById("quick_link_" + savedNewQuickLink).removeAttribute("onclick");
            document.getElementById("quick_link_" + savedOldQuickLink).classList.remove("bg_dark_blue");
        }
    }
}