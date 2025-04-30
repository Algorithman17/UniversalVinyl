const carousel = document.querySelector('.content-imgs')
const images = document.querySelectorAll(".content-img img")
const previousArrow = document.querySelector(".previous-arrow")
const nextArrow = document.querySelector(".next-arrow")
const currentPage = document.querySelector(".current-page")
const lastPage = document.querySelector(".last-page")


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
    previousArrow.style.display = "none"
    nextArrow.style.display = "none"
    lastPage.textContent = "1"
}

previousArrow.addEventListener('click', () => {
    if(indexImg === 0) {
        indexImg = images.length-1 
        currentPage.textContent = indexImg+1
        return carousel.style.transform = `translateX(-${nbrImg[indexImg]}%)`
    }
    indexImg--
    carousel.style.transform = `translateX(-${nbrImg[indexImg]}%)`
    currentPage.textContent = indexImg+1
})

nextArrow.addEventListener('click', () => {
    if(indexImg === images.length-1) {
        indexImg = 0
        currentPage.textContent = indexImg+1
        return carousel.style.transform = `translateX(0)`
    }
    indexImg++
    carousel.style.transform = `translateX(-${nbrImg[indexImg]}%)`      
    currentPage.textContent = indexImg+1
})