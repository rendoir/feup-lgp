'use strict'

$(document).ready(function () {

    $('.first-button').on('click', function () {

        $('.animated-icon1').toggleClass('open');
    });

    $('.second-button').on('click', function () {

        $('.animated-icon2').toggleClass('open');
    });

});


let dropDown = document.querySelector('#dropdownCategories-btn');
let dropDownItems = document.querySelectorAll('.dropdown-menu a');

for(let item of dropDownItems) {
    item.addEventListener('click',updateText)
}

function updateText (caller) {
    dropDown.innerHTML = caller.target.innerHTML;
}
