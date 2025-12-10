/* ==============================================================
   INSCRIPTION – MEDIA MIAM
   Gestion de la création de compte en localStorage pour éviter 
   de devoir utiliser une bdd... à voir plus tard !
   ============================================================== */


// Utilitaires de stockage
function loadUsers() {
    try {
        return JSON.parse(localStorage.getItem("mm_users") || "[]");
    } catch {
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("mm_users", JSON.stringify(users));
}

const birthInput   = document.getElementById("signup-birthdate");
const signupForm    = document.getElementById("signup-form");
const emailInput    = document.getElementById("signup-email");
const pseudoInput   = document.getElementById("signup-pseudo");
const passInput     = document.getElementById("signup-password");
const passConfInput = document.getElementById("signup-password-confirm");
const msgBox        = document.getElementById("signup-message");

signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    msgBox.textContent = "";
    msgBox.style.color = "#C0C0C3";

    const email  = emailInput.value.trim().toLowerCase();
    const pseudo = pseudoInput.value.trim();
    const pass   = passInput.value;
    const pass2  = passConfInput.value;
    const birthdate = birthInput.value;


    if (!email || !pass || !pass2) {
        msgBox.textContent = "Merci de remplir tous les champs obligatoires.";
        msgBox.style.color = "#ff0400ff";
        return;
    }

    if (pass.length < 6) {
        msgBox.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
        msgBox.style.color = "#ff0400ff";
        return;
    }

    if (pass !== pass2) {
        msgBox.textContent = "Les mots de passe ne correspondent pas.";
        msgBox.style.color = "#ff0400ff";
        return;
    }

    const users = loadUsers();

    if (users.find(u => u.email === email)) {
        msgBox.textContent = "Un compte existe déjà avec cet e-mail.";
        msgBox.style.color = "#ff0400ff";
        return;
    }

    const newUser = {
        email,
        pseudo: pseudo || null,
        password: pass,
        birthdate: birthdate || null,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // connexion auto après inscription
    localStorage.setItem("mm_isLoggedIn", "true");
    localStorage.setItem("mm_currentUserEmail", email);

    msgBox.textContent = "Compte créé avec succès ! Redirection...";
    msgBox.style.color = "#00ff08ff";

    setTimeout(() => {
        window.location.href = "profil.html";
    }, 1000);
});
