const annonce = document.querySelector('.annonce')
const carousel = document.querySelector('.contentImgs')
const contentImg = document.querySelectorAll(".contentImg")
const images = document.querySelectorAll(".contentImg img")
const prev = document.querySelector(".prev")
const next = document.querySelector(".next")
const currentPage = document.querySelector(".currentPage")
const lastPage = document.querySelector(".lastPage")

let indexImg = 0
let nbrImg = []

if (images.length === 3) {
    carousel.style.width = "300%"
    nbrImg = [0, 33.333, 66.666]
    lastPage.textContent = "3"
} else if (images.length === 2) {
    carousel.style.width = "200%"
    nbrImg = [0, 50]
    lastPage.textContent = "2"
} else {
    carousel.style.width = "100%"
    prev.style.display = "none"
    next.style.display = "none"
    lastPage.textContent = "1"
}

prev.addEventListener('click', () => {
    if(indexImg === 0) {
        indexImg = images.length-1 
        currentPage.textContent = indexImg+1
        return carousel.style.transform = `translateX(-${nbrImg[indexImg]}%)`
    }
    indexImg--
    carousel.style.transform = `translateX(-${nbrImg[indexImg]}%)`
    currentPage.textContent = indexImg+1
})

next.addEventListener('click', () => {
    if(indexImg === images.length-1) {
        indexImg = 0
        currentPage.textContent = indexImg+1
        return carousel.style.transform = `translateX(0)`
    }
    indexImg++
    carousel.style.transform = `translateX(-${nbrImg[indexImg]}%)`      
    currentPage.textContent = indexImg+1

})