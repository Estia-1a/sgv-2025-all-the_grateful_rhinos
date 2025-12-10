/* ==============================================================
   CONNEXION – MEDIA MIAM
   Gestion de la connexion, simu en localStorage pour éviter 
   de devoir utiliser une bdd... à voir plus tard !
   ============================================================== */

function loadUsers() {
    try {
        return JSON.parse(localStorage.getItem("mm_users") || "[]");
    } catch {
        return [];
    }
}

const loginForm  = document.getElementById("login-form");
const emailField = document.getElementById("login-email");
const passField  = document.getElementById("login-password");
const loginMsg   = document.getElementById("login-message");

loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    loginMsg.textContent = "";
    loginMsg.style.color = "#C0C0C3";

    const email = emailField.value.trim().toLowerCase();
    const pass  = passField.value;

    const users = loadUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        loginMsg.textContent = "Aucun compte trouvé avec cet e-mail.";
        loginMsg.style.color = "#E53935";
        return;
    }

    if (user.password !== pass) {
        loginMsg.textContent = "Mot de passe incorrect.";
        loginMsg.style.color = "#E53935";
        return;
    }

    // OK : on connecte
    localStorage.setItem("mm_isLoggedIn", "true");
    localStorage.setItem("mm_currentUserEmail", email);

    loginMsg.textContent = "Connexion réussie ! Redirection...";
    loginMsg.style.color = "#4CAF50";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 800);
});
