export default function initNavigation() {

   const bodyTag = document.querySelector('body');

    // navigation toggle open close
    const navToggle = () => {
        if(bodyTag.classList.contains('menu-open')){
            bodyTag.classList.add('menu-closing');
            bodyTag.classList.remove('menu-open');
            setTimeout( function(){ bodyTag.classList.remove('menu-closing'); }, 250);
        } else {
            bodyTag.classList.add('menu-open');
        }
    }
    document.querySelector('.menu-toggle-btn').addEventListener('click', navToggle);

    // change background colour of nav bar on scroll
    var nav = document.querySelector('.navbar');
    // manually set the offset from top
    var navTop = '20';

    function navFixed(e) {
        if(window.scrollY >= navTop) {
            nav.classList.add('is-fixed');
        } else {
            nav.classList.remove('is-fixed');
        }
    }

    // Event Listener
    window.addEventListener('scroll', navFixed);

}