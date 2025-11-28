/* ==============================================================
   HOMEPAGE JS – MEDIAMIAM (FULL VERSION)
  Pour l'instant on le conserve mais voir pour le supprimer plus tard en fonction des consignes
   ============================================================== */

/* ==============================================================
   1. VARIABLES DE BASE
   ============================================================== */

const loginBtn = document.querySelector('a[href="login.html"]');
const logoutBtn = document.querySelector('a[href="logout.html"]');
const profileBtn = document.querySelector('a[href="profil.html"]');

let isLoggedIn = false;

const searchInput = document.querySelector("#search");
const suggestionsBox = document.querySelector("#suggestions");

const carouselTrack = document.querySelector(".carousel-track");
const carouselLeft = document.querySelector(".carousel-btn.left");
const carouselRight = document.querySelector(".carousel-btn.right");

let carouselIndex = 0;
let carouselItemWidth = 220; // largeur estimée d'une carte

/* ============================================================== 
   2. NAVBAR – LOGIN/LOGOUT
   ============================================================== */

function updateNavbar() {
    if (isLoggedIn) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        profileBtn.style.display = "inline-block";
    } else {
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        profileBtn.style.display = "none";
    }
}

updateNavbar();

loginBtn?.addEventListener("click", () => {
    isLoggedIn = true;
    updateNavbar();
});

logoutBtn?.addEventListener("click", () => {
    isLoggedIn = false;
    updateNavbar();
});

/* ============================================================== 
   3. HEADER SHRINK (style Netflix)
   ============================================================== */

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.classList.add("shrink");
    } else {
        header.classList.remove("shrink");
    }
});

/* ============================================================== 
   4. ANIMATIONS D’APPARITION
   ============================================================== */

const fadeElements = document.querySelectorAll(".homepage-content section");

fadeElements.forEach(el => el.classList.add("fade-slide"));

function revealOnScroll() {
    fadeElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* ============================================================== 
   5. CARROUSEL
   ============================================================== */

const sampleMedia = [
    { title: "Film Rouge", img: "https://via.placeholder.com/220x330/E53935/FFFFFF?text=Rouge" },
    { title: "Série", img: "https://via.placeholder.com/220x330/2A2A2C/FFFFFF?text=Serie" },
    { title: "Documentaire", img: "https://via.placeholder.com/220x330/B71C1C/FFFFFF?text=Docu" },
    { title: "Film Action", img: "https://via.placeholder.com/220x330/3A3A3C/FFFFFF?text=Action" },
    { title: "Musique", img: "https://via.placeholder.com/220x330/121212/FFFFFF?text=Musique" },
    { title: "Podcast", img: "https://via.placeholder.com/220x330/EF5350/FFFFFF?text=Podcast" }
];

/* Remplissage auto du carrousel */

sampleMedia.forEach(item => {
    const card = document.createElement("div");
    card.style.minWidth = "220px";
    card.style.height = "330px";
    card.style.borderRadius = "12px";
    card.style.backgroundImage = `url(${item.img})`;
    card.style.backgroundSize = "cover";
    card.style.backgroundPosition = "center";
    card.style.cursor = "pointer";
    card.title = item.title;

    carouselTrack.appendChild(card);
});

/* Navigation du carrousel */
carouselRight.addEventListener("click", () => {
    carouselIndex++;
    if (carouselIndex > sampleMedia.length - 4) {
        carouselIndex = sampleMedia.length - 4;
    }
    carouselTrack.style.transform = `translateX(-${carouselIndex * carouselItemWidth}px)`;
});

carouselLeft.addEventListener("click", () => {
    carouselIndex--;
    if (carouselIndex < 0) carouselIndex = 0;
    carouselTrack.style.transform = `translateX(-${carouselIndex * carouselItemWidth}px)`;
});

/* ============================================================== 
   6. RECHERCHE INSTANTANÉE (suggestions dynamiques)
   ============================================================== */

searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length < 1) {
        suggestionsBox.style.display = "none";
        return;
    }

    const results = sampleMedia
        .filter(item => item.title.toLowerCase().includes(query))
        .slice(0, 5);

    if (results.length === 0) {
        suggestionsBox.style.display = "none";
        return;
    }

    suggestionsBox.innerHTML = results
        .map(item => `<li>${item.title}</li>`)
        .join("");

    suggestionsBox.style.display = "block";
});

/* Choix d'une suggestion */
suggestionsBox.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        searchInput.value = e.target.textContent;
        suggestionsBox.style.display = "none";
    }
});

/* ============================================================== 
   7. DEBUG
   ============================================================== */
console.log("Homepage JS complet chargé !");
