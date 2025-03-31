//Hover effect pencil
function changeImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_lightgrey.svg';
}

function resetImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_grey.svg';
}

function switchToBoard() {
    window.location.href = '../html/board.html';
}

//greeting 
function greeting() {
    let d = new Date();
    let hour = d.getHours();
    let greetingMessage = "Good " + (hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening");
    document.getElementById("summary_greeting_text").innerHTML = greetingMessage;
/*if user is logged in: 
document.getElementById("summary_greeting_text").innerHTML +=",";
document.getElementById("summary_greeting_name").innerHTML = user.name;  */
}