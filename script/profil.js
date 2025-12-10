/* ==============================================================
   PROFIL – MEDIA MIAM
   Gestion du profil, simu en localStorage pour éviter 
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

// Historique des films par utilisateur
function loadRecentFilmsByUser(email) {
    try {
        const all = JSON.parse(localStorage.getItem("mm_recentFilmsByUser") || "{}");
        return all[email] || [];
    } catch {
        return [];
    }
}

const currentEmail = localStorage.getItem("mm_currentUserEmail");
const isLoggedIn   = localStorage.getItem("mm_isLoggedIn") === "true";

if (!isLoggedIn || !currentEmail) {
    localStorage.setItem("mm_redirectAfterLogin", "profil.html");
    window.location.href = "login.html";
}

const users = loadUsers();
const user  = users.find(u => u.email === currentEmail);

// Sélecteurs
const emailBox    = document.getElementById("profil-email");
const pseudoBox   = document.getElementById("profil-pseudo");
const birthBox    = document.getElementById("profil-birthdate");
const createdBox  = document.getElementById("profil-created");
const avatarImg   = document.getElementById("profil-avatar");
const fileInput   = document.getElementById("profil-photo-input");

const pseudoInput = document.getElementById("profil-pseudo-input");
const passInput   = document.getElementById("profil-password-input");
const passConf    = document.getElementById("profil-password-confirm");
const editForm    = document.getElementById("profil-edit-form");
const msgBox      = document.getElementById("profil-message");

const recentList  = document.getElementById("profil-recent-list");

if (!user) {
    if (emailBox) emailBox.textContent = "Erreur : compte introuvable.";
} else {
    // Affichage des infos
    if (emailBox)  emailBox.textContent  = "Email : " + user.email;

    const pseudo = user.pseudo && user.pseudo.trim() !== "" ? user.pseudo : "(non renseigné)";
    if (pseudoBox) pseudoBox.textContent = "Pseudo : " + pseudo;

    if (birthBox) {
        birthBox.textContent = "Date de naissance : " + (user.birthdate || "non renseignée");
    }

    if (createdBox) {
        const dateTxt = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("fr-FR")
            : "date inconnue";
        createdBox.textContent = "Compte créé le : " + dateTxt;
    }

    // Pré-remplir le champ d'édition pseudo
    if (pseudoInput) {
        pseudoInput.value = user.pseudo || "";
    }

    // Avatar
    if (user.avatarBase64) {
        avatarImg.src = user.avatarBase64;
    }

    fileInput?.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            user.avatarBase64 = e.target.result;
            avatarImg.src = user.avatarBase64;
            saveUsers(users);
        };
        reader.readAsDataURL(file);
    });

    // Edition pseudo + mdp
    editForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        msgBox.textContent = "";
        msgBox.style.color = "#C0C0C3";

        const newPseudo = pseudoInput.value.trim();
        const newPass   = passInput.value;
        const newPass2  = passConf.value;

        if (newPass || newPass2) {
            if (newPass.length < 6) {
                msgBox.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
                msgBox.style.color = "#E53935";
                return;
            }
            if (newPass !== newPass2) {
                msgBox.textContent = "Les mots de passe ne correspondent pas.";
                msgBox.style.color = "#E53935";
                return;
            }
            user.password = newPass;
        }

        user.pseudo = newPseudo || user.pseudo;
        saveUsers(users);

        // MAJ affichage
        if (pseudoBox) pseudoBox.textContent = "Pseudo : " + (user.pseudo || "(non renseigné)");
        msgBox.textContent = "Profil mis à jour.";
        msgBox.style.color = "#4CAF50";

        // on vide les champs mdp
        passInput.value = "";
        passConf.value = "";
    });

    // Derniers films consultés
    const recent = loadRecentFilmsByUser(currentEmail);
    if (!recent || recent.length === 0) {
        recentList.innerHTML = "<li>Aucun film consulté récemment.</li>";
    } else {
        recentList.innerHTML = "";
        recent.forEach(item => {
            const li = document.createElement("li");
            const a  = document.createElement("a");
            a.href        = item.url;
            a.textContent = item.title;
            li.appendChild(a);
            recentList.appendChild(li);
        });
    }
}
