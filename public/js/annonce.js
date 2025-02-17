document.querySelectorAll(".annonce").forEach(container => {
    const carousel = container.querySelector('.contentImgs')
    const images = container.querySelectorAll(".contentImg img")
    const arrowLeft = container.querySelector(".arrowImgLeft")
    const arrowRight = container.querySelector(".arrowImgRight")
    let index = 0;


    function updateCarousel() {
        const offset = -index * 100;
        carousel.style.transform = `translateX(${offset}%)`;
        arrowLeft.style.zIndex = "2"
        arrowRight.style.zIndex = "2"
    }

    arrowLeft.addEventListener('click', () => {
            index = (index - 1 + images.length) % images.length;
            updateCarousel();
    })


    arrowRight.addEventListener('click', () => {
            index = (index + 1) % images.length;
            updateCarousel();
    })
});