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


class Person {
    #name; // privé
    #age; // private
    constructor(name, birthday, admin = "admin") {
      this.#name = name; // privée
      this.role = admin;
      this.birthday = new Date(birthday) // millisec
        this.setAge()
    }
    salutation = () => {
      console.log(getName());
    }

    getName() {
      // getter
      return this.#name;
    }
    setName(name) {
      if (typeof name === "string") {
        this.#name = name;
      } else {
        console.log("le name doit contenir une valeur ");
      }
    }
    // setter getter age 
    getAge () {
        return this.#age
    }
    setAge() {
      const currentDate =  new Date();
      const years = (currentDate - this.birthday) / (1000 * 60 * 60 * 24 * 365.25);
        if(years >= 18 ) {
            this.#age = Math.floor(years)
        } else {
            console.log('vous n\' avez l\'age requis')
        }
    }
}

// instance de l'objet
const p2 = new Person("Od", "1995-12-12", "super admin"); // age existe a ce niveau
const p1 = new Person("pppp", "2005-12-12"); // age existe a ce niveau
const p3 = new Person("pppp", "2005-12-12", "user"); // age existe a ce niveau
console.log(p2.getAge());