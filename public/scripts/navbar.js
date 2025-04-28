const btnNav = document.querySelector('.btn-nav');
const navbar = document.querySelector('nav');

btnNav.classList.remove('btn-nav-active')
btnNav.classList.add('btn-nav-inactive')

navbar.classList.add('inactive')

btnNav.addEventListener('click', function() {
    if (navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        navbar.classList.add('inactive');
        btnNav.classList.remove('btn-nav-active');
        btnNav.classList.add('btn-nav-inactive');
    } else {
        navbar.classList.add('active');
        navbar.classList.remove('inactive');
        btnNav.classList.add('btn-nav-active');
        btnNav.classList.remove('btn-nav-inactive');
    }
});

