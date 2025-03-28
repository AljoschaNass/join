//Hover effect pencil
function changeImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_lightgrey.svg';
}

function resetImage(element) {
    var img = element.querySelector('img');
    img.src = '../assets/img/icons/pen_grey.svg';
}