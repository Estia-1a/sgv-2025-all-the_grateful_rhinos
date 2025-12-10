function addFilmToHistory() {
    const body = document.body;
    const title = body.dataset.filmTitle;
    const url   = body.dataset.filmUrl || window.location.pathname;
    const email = localStorage.getItem("mm_currentUserEmail");
    const isLoggedIn = localStorage.getItem("mm_isLoggedIn") === "true";

    if (!isLoggedIn || !email || !title) return;

    let all;
    try {
        all = JSON.parse(localStorage.getItem("mm_recentFilmsByUser") || "{}");
    } catch {
        all = {};
    }

    const list = all[email] || [];

    // on enlève si déjà présent
    const filtered = list.filter(item => item.url !== url);

    // on ajoute en tête
    filtered.unshift({ title, url });

    // on limite à 5 films
    all[email] = filtered.slice(0, 5);

    localStorage.setItem("mm_recentFilmsByUser", JSON.stringify(all));
}

addFilmToHistory();
