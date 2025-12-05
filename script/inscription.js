/* ==============================================================
   INSCRIPTION – MEDIA MIAM
   Gestion de la création de compte en localStorage
   ============================================================== */

const signupForm   = document.getElementById("signup-form");
const emailInput   = document.getElementById("signup-email");
const pseudoInput  = document.getElementById("signup-pseudo");
const passInput    = document.getElementById("signup-password");
const passConfInput= document.getElementById("signup-password-confirm");
const cguCheckbox  = document.getElementById("signup-cgu");
const msgBox       = document.getElementById("signup-message");

function loadUsers() {
    try {
        const raw = localStorage.getItem("mm_users");
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error("Erreur de lecture des utilisateurs :", e);
        return [];
    }
}

function saveUsers(users) {
    localStorage.setItem("mm_users", JSON.stringify(users));
}

signupForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    msgBox.textContent = "";
    msgBox.style.color = "#C0C0C3";

    const email  = emailInput.value.trim().toLowerCase();
    const pseudo = pseudoInput.value.trim();
    const pass   = passInput.value;
    const pass2  = passConfInput.value;

    // Vérifications basiques
    if (!email || !pass || !pass2) {
        msgBox.textContent = "Merci de remplir tous les champs obligatoires.";
        msgBox.style.color = "#E53935";
        return;
    }

    if (pass.length < 6) {
        msgBox.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
        msgBox.style.color = "#E53935";
        return;
    }

    if (pass !== pass2) {
        msgBox.textContent = "Les mots de passe ne correspondent pas.";
        msgBox.style.color = "#E53935";
        return;
    }

    if (!cguCheckbox.checked) {
        msgBox.textContent = "Vous devez accepter les CGU et la politique de confidentialité.";
        msgBox.style.color = "#E53935";
        return;
    }

    // Chargement des utilisateurs existants
    const users = loadUsers();

    // Vérifier si l'email existe déjà
    const already = users.find(u => u.email === email);
    if (already) {
        msgBox.textContent = "Un compte existe déjà avec cette adresse e-mail.";
        msgBox.style.color = "#E53935";
        return;
    }

    // Création du nouvel utilisateur
    const newUser = {
        email: email,
        pseudo: pseudo || null,
        password: pass,          // Pour un vrai site : JAMAIS en clair
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    // Connexion auto
    localStorage.setItem("mm_isLoggedIn", "true");
    localStorage.setItem("mm_currentUserEmail", email);

    msgBox.textContent = "Compte créé avec succès ! Redirection en cours...";
    msgBox.style.color = "#4CAF50";

    // Petite pause pour que l’utilisateur voit le message
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1000);
});
