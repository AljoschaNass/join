
let selectedQuickLink = "summary";
let currentQuickLink;

function toggleRespMenu() {    
    document.getElementById("resp_menu").classList.toggle("resp_menu_closed");
}

function toogleBgRespMenu(){
    document.getElementById("header_user_profile").classList.toggle("bg_grey");
}

function highlightSelectedQuickLinks(id){
    currentQuickLink = id;
    console.log('selectedQuickLink' + selectedQuickLink);
    console.log('currentQuickLink' + currentQuickLink);
    
    if (id != selectedQuickLink) {
        document.getElementById("quick_link_" + currentQuickLink).classList.toggle("bg_dark_blue");
        document.getElementById("quick_link_" + currentQuickLink).disabled = true;
        document.getElementById("quick_link_" + selectedQuickLink).classList.toggle("bg_dark_blue");
        document.getElementById("quick_link_" + selectedQuickLink).disabled = false;
    }
    selectedQuickLink = currentQuickLink;
}