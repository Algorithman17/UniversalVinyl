const annonce = document.querySelector('.annonce')
const carousel = document.querySelector('.contentImgs')
const contentImg = document.querySelectorAll(".contentImg")
const images = document.querySelectorAll(".contentImg img")
const prev = document.querySelector(".prev")
const next = document.querySelector(".next")

let indexImg = 0
let nbrImg = []

if (images.length === 3) {
    carousel.style.width = "300%"
    nbrImg = [0, 33.333, 66.666]
} else if (images.length === 2) {
    carousel.style.width = "200%"
    nbrImg = [0, 50]
} else {
    carousel.style.width = "100%"
    prev.style.display = "none"
    next.style.display = "none"
}

prev.addEventListener('click', () => {
    if(indexImg === 0) {
        indexImg = images.length-1 
        return carousel.style.transform = `translate(-${nbrImg[indexImg]}%, 0)`
    }
    indexImg--
    carousel.style.transform = `translate(-${nbrImg[indexImg]}%, 0)`
})

next.addEventListener('click', () => {
    if(indexImg === images.length-1) {
        indexImg = 0
        return carousel.style.transform = `translate(0, 0)`
    }
    indexImg++
    carousel.style.transform = `translate(-${nbrImg[indexImg]}%, 0)`      
})

