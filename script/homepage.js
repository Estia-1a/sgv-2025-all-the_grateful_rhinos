/* ==============================================================
   HOMEPAGE JS – MEDIAMIAM
   ============================================================== */

/* ==============================================================
    GESTION ÉTAT CONNECTÉ / DÉCONNECTÉ
   ============================================================== */

const loginLink   = document.querySelector('[data-role="login-link"]');
const logoutLink  = null; // ajouter un lien logout plus tard 
const signupLink  = document.querySelector('[data-role="signup-link"]');
const profileLink = document.querySelector('[data-role="profile-link"]');
const cartLink    = document.querySelector('[data-role="cart-link"]');

// on lit l'état dans le localStorage pour "simuler" une vraie session
let isLoggedIn = localStorage.getItem("mm_isLoggedIn") === "true";

function updateNavbar() {
    if (!loginLink || !signupLink || !profileLink || !cartLink) return;

    if (isLoggedIn) {
        // connecté : on affiche profil + panier
        profileLink.style.display = "inline-block";
        cartLink.style.display    = "inline-block";

        // on masque se connecter / s'inscrire
        loginLink.style.display   = "none";
        signupLink.style.display  = "none";
    } else {
        // pas connecté : on affiche se connecter / s'inscrire
        loginLink.style.display   = "inline-block";
        signupLink.style.display  = "inline-block";

        // on masque profil + panier
        profileLink.style.display = "none";
        cartLink.style.display    = "none";
    }
}

updateNavbar();

/*
   Pour l'instant, on simule la connexion : si tu veux tester
   sans coder toute la page de login, tu peux intercepter le clic ici.

   Si tu préfères que "Se connecter" aille directement sur login.html
   sans simulation, tu laisses tel quel (pas de e.preventDefault()).
*/

loginLink?.addEventListener("click", () => { //Ajouter login link ici
});

/* ==============================================================
   2. HEADER SHRINK + ANIMATIONS D’APPARITION
   ============================================================== 

const header = document.querySelector("header");

if (header) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("shrink");
        } else {
            header.classList.remove("shrink");
        }
    });
}

const fadeSections = document.querySelectorAll(".homepage-content section");

fadeSections.forEach((section) => {
    section.classList.add("fade-slide");
});

function revealOnScroll() {
    fadeSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) {
            section.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); */ // A voir si j'ai le temps ppour le mettre en place

/* ==============================================================
   3. FILTRAGE & TRI DES MÉDIAS
   ============================================================== */

const searchInput = document.querySelector("#search");
const typeSelect  = document.querySelector("#type-media");
const sortSelect  = document.querySelector("#tri");
const mediaGrid   = document.querySelector(".media-grid");
const mediaCards  = mediaGrid ? Array.from(mediaGrid.querySelectorAll(".media-card")) : [];

function normalize(str) {
    return (str || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function applyFiltersAndSort() {
    if (!mediaGrid || mediaCards.length === 0) return;

    const text = normalize(searchInput?.value || "");
    const type = typeSelect?.value || "tous";
    const tri  = sortSelect?.value || "popularite";

    // 1) filtrage
    let filtered = mediaCards.filter((card) => {
        const titleEl = card.querySelector("h4");
        const title = normalize(titleEl ? titleEl.textContent : "");

        let cardType = card.dataset.type || "tous";
        if (cardType === "tous" || !card.dataset.type) {
            if (card.classList.contains("film"))    cardType = "films";
            if (card.classList.contains("serie"))   cardType = "series";
            if (card.classList.contains("musique")) cardType = "musique";
            if (card.classList.contains("podcast")) cardType = "podcasts";
        }

        const matchText = text === "" || title.includes(text);
        const matchType = type === "tous" || cardType === type;

        return matchText && matchType;
    });

    // 2) tri
    filtered.sort((a, b) => {
        const aPop  = parseFloat(a.dataset.popularity || "0");
        const bPop  = parseFloat(b.dataset.popularity || "0");
        const aYear = parseInt(a.dataset.year || "0", 10);
        const bYear = parseInt(b.dataset.year || "0", 10);
        const aNote = parseFloat(a.dataset.note || "0");
        const bNote = parseFloat(b.dataset.note || "0");

        switch (tri) {
            case "popularite":
                return bPop - aPop;      // plus populaire en premier
            case "recent":
                return bYear - aYear;    // plus récent en premier
            case "note":
                return bNote - aNote;    // meilleure note en premier
            default:
                return 0;
        }
    });

    // 3) réinjection dans le DOM (ordre visuel)
    mediaGrid.innerHTML = "";
    filtered.forEach((card) => {
        mediaGrid.appendChild(card);
        card.style.display = "block";
    });
}

// A voir pour ajoute un bouton appliquer la recherche plus tard, pour l'instant c'est en live

searchInput?.addEventListener("input", applyFiltersAndSort);
typeSelect?.addEventListener("change", applyFiltersAndSort);
sortSelect?.addEventListener("change", applyFiltersAndSort);

applyFiltersAndSort();

/* ==============================================================
   4. REDIRECTION VERS LES PAGES FILMS AVEC CONNECTION OBLIGATOIRE
   ============================================================== */

mediaCards.forEach((card) => {
    card.style.cursor = "pointer";

    card.addEventListener("click", (e) => {
        const targetUrl = card.dataset.href;

        if (!targetUrl) return;

        // si pas connecté -> on redirige vers la page de login
        if (!isLoggedIn) {
            e.preventDefault();
            // plus tard tu pourras ajouter ?redirect=...
            window.location.href = "login.html";
        } else {
            window.location.href = targetUrl;
        }
    });
});

/* ==============================================================
   5. REDIRECTION VERS PANIER (SEULEMENT SI CONNECTÉ)
   ============================================================== */

cartLink?.addEventListener("click", (e) => {
    if (!isLoggedIn) {
        e.preventDefault();
        window.location.href = "login.html";
    }
});

/* ==============================================================
   6. FORMULAIRE DE SUPPORT – OUVERTURE OUTLOOK (MAILTO)
   ============================================================== */

const supportForm = document.querySelector(".support-form");

if (supportForm) {
    supportForm.addEventListener("submit", function (e) {
        e.preventDefault(); // empêche l'envoi classique du formulaire

        // Récupération des champs
        const type       = document.querySelector("#support-type")?.value || "";
        const media      = document.querySelector("#media-ref")?.value || "";
        const subject    = document.querySelector("#support-subject")?.value || "";
        const message    = document.querySelector("#support-message")?.value || "";
        const email      = document.querySelector("#support-email")?.value || "";
        const priorityEl = document.querySelector('input[name="support-priority"]:checked');
        const priority   = priorityEl ? priorityEl.value : "normale";

        // Adresse à laquelle tu veux recevoir les demandes
        const to = "baptiste.aminot@etu.estia.fr"; 

        // Sujet du mail
        const mailSubject = `[MediaMiam] Demande de support - ${subject}`;

        // Corps du mail
        const mailBody = 
`Type de demande : ${type}
Priorité : ${priority}
Média concerné : ${media || "Non précisé"}

Message :
${message}

E-mail de contact : ${email}`;

        // Construction du lien mailto avec encodage
        const mailtoLink = `mailto:${encodeURIComponent(to)}`
            + `?subject=${encodeURIComponent(mailSubject)}`
            + `&body=${encodeURIComponent(mailBody)}`;

        // Ouverture de la fenêtre de mail (Outlook / client par défaut)
        window.location.href = mailtoLink;

        // Optionnel : reset du formulaire après ouverture
        // supportForm.reset();
    });
}


/* ==============================================================
   DEBUG
   ============================================================== */

console.log("Homepage JS MediaMiam chargé (navigation + filtres + tri + protections).");
