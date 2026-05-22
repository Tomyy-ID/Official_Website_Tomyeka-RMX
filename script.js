/* =========================
FILE : script.js
========================= */

// MOBILE MENU
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

menuToggle.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');

function revealOnScroll(){

  reveals.forEach(item => {

    const windowHeight = window.innerHeight;
    const revealTop = item.getBoundingClientRect().top;
    const revealPoint = 100;

    if(revealTop < windowHeight - revealPoint){
      item.classList.add('active');
    }

  });

}

window.addEventListener('scroll', revealOnScroll);

revealOnScroll();

// NAVBAR SHADOW
window.addEventListener('scroll', () => {

  const header = document.querySelector('.header');

  if(window.scrollY > 50){
    header.style.background = "rgba(10,10,20,.85)";
  } else {
    header.style.background = "rgba(10,10,20,.5)";
  }

});