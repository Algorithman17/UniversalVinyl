const btnNav = document.querySelector('.btn-nav');
const navbar = document.querySelector('nav');
const links = document.querySelectorAll('nav a');

// navbar.classList.add('active');
// navbar.classList.remove('inactive');

// let countLoad = 0;

// document.addEventListener("DOMContentLoaded", () => {
//     countLoad++;
//     console.log("page is fully loaded", countLoad);
//     setTimeout(() => {
//         navbar.classList.remove('active');
//         // navbar.classList.add('active');
//         navbar.classList.add('inactive');
//     }, 2000);
    
// });

// navbar.classList.add('inactive');
// btnNav.classList.add('inactive');

// Exécuter l'événement une seule fois
const eventExecuted = localStorage.getItem('eventExecuted');

document.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('eventExecuted', 'false');
    if (!eventExecuted) {
        console.log('Événement exécuté pour la première fois');
        navbar.classList.add('active');
        btnNav.classList.add('active');
        
        // Marquer l'événement comme exécuté
        
    } else {
        console.log('Événement déjà exécuté');
    }
});

btnNav.addEventListener('click', function() {
    if (navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        navbar.classList.add('inactive');
        btnNav.classList.remove('active');
        btnNav.classList.add('inactive');
    } else {
        navbar.classList.add('active');
        navbar.classList.remove('inactive');
        btnNav.classList.add('active');
        btnNav.classList.remove('inactive');
    }
});

links.forEach(link => {
    link.addEventListener('click', function() {
        localStorage.setItem('eventExecuted', 'true');
        setTimeout(() => {
            if (navbar.classList.contains('inactive')) {
                navbar.classList.remove('inactive');
                navbar.classList.add('active');
            } else {
                navbar.classList.remove('active');
                navbar.classList.add('inactive');
            }
        }
        , 2000);
    });
});