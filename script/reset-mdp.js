/* ==============================================================
   PROFIL – MEDIA MIAM
   Gestion du reset password, simu en localStorage pour éviter 
   de devoir utiliser une bdd... à voir plus tard !
   ============================================================== */

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

const resetForm    = document.getElementById("reset-form");
const emailReset   = document.getElementById("reset-email");
const passReset    = document.getElementById("reset-password");
const passReset2   = document.getElementById("reset-password-confirm");
const resetMsg     = document.getElementById("reset-message");

resetForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    resetMsg.textContent = "";
    resetMsg.style.color = "#C0C0C3";

    const email = emailReset.value.trim().toLowerCase();
    const pass1 = passReset.value;
    const pass2 = passReset2.value;

    if (!email || !pass1 || !pass2) {
        resetMsg.textContent = "Merci de remplir tous les champs.";
        resetMsg.style.color = "#E53935";
        return;
    }

    if (pass1.length < 6) {
        resetMsg.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
        resetMsg.style.color = "#E53935";
        return;
    }

    if (pass1 !== pass2) {
        resetMsg.textContent = "Les mots de passe ne correspondent pas.";
        resetMsg.style.color = "#E53935";
        return;
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        resetMsg.textContent = "Aucun compte trouvé avec cet e-mail.";
        resetMsg.style.color = "#E53935";
        return;
    }

    user.password = pass1;
    saveUsers(users);

    resetMsg.textContent = "Mot de passe mis à jour ! Vous pouvez maintenant vous connecter.";
    resetMsg.style.color = "#4CAF50";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1200);
});
