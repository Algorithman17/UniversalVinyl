document.querySelectorAll(".annonceCard").forEach(container => {
    const carousel = container.querySelector('.contentImgs')
    const images = container.querySelectorAll(".contentImg img")
    const arrowLeft = container.querySelector(".arrowImgLeft")
    const arrowRight = container.querySelector(".arrowImgRight")

    let indexImg = 0

    arrowLeft.addEventListener('click', () => {
        if(indexImg === 0) {
            indexImg = images.length-1 
            return carousel.style.transform = `translate(-${indexImg}00%, 0)`
        }

        indexImg--
        carousel.style.transform = `translate(-${indexImg}00%, 0)`
    })

    arrowRight.addEventListener('click', () => {
        if(indexImg === images.length-1) {
            indexImg = 0
            return carousel.style.transform = `translate(0, 0)`
        }

        indexImg++
        carousel.style.transform = `translate(-${indexImg}00%, 0)`      
    })
});