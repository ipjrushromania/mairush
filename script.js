function loginWithDiscord() {
    const clientId = "1541759993437487134";

    const redirectUri =
        "https://discord.com/oauth2/authorize?client_id=1541759993437487134&response_type=code&redirect_uri=https%3A%2F%2Fipjrushromania.github.io%2Fmairush%2F%2Fauth%2Fdiscord%2Fcallback&scope=identify+email+guilds+guilds.members.read";

    const scope = "identify email guilds";

    const url =
        "https://discord.com/oauth2/authorize" +
        "?client_id=" + clientId +
        "&response_type=code" +
        "&redirect_uri=" + encodeURIComponent(redirectUri) +
        "&scope=" + encodeURIComponent(scope);

    window.location.href = url;
}

function loginWithDiscord() {
    window.location.href = "URL_BACKEND/auth/discord";
}
/*
    CONFIGURAȚIE
*/

// ADRESA CLOUDFLARE WORKER-ULUI
const AUTH_SERVER = "https://PUNE-AICI-URL-UL-WORKER-ULUI";

// CENTRUL DE COMANDĂ
const COMMAND_CENTER =
    "https://ipjrushromania.github.io/centrudecomanda/";


/*
    LOGIN DISCORD
*/

function loginWithDiscord() {

    window.location.href =
        AUTH_SERVER + "/auth/discord";

}


/*
    CENTRU DE COMANDĂ
*/

function goToCommandCenter() {

    window.location.href = COMMAND_CENTER;

}


/*
    MESAJ
*/

function showMessage(message) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


/*
    VERIFICĂ DACĂ UTILIZATORUL ESTE DEJA LOGAT
*/

async function checkLogin() {

    try {

        const response = await fetch(
            AUTH_SERVER + "/auth/me",
            {
                credentials: "include"
            }
        );

        if (!response.ok) return;

        const user = await response.json();

        if (!user || !user.id) return;

        const loginButton =
            document.getElementById("discordLogin");

        if (loginButton) {

            loginButton.innerHTML = `
                <span class="discord-icon">●</span>
                <span>${escapeHTML(user.username)}</span>
            `;

        }

    } catch (error) {

        console.log(
            "Utilizatorul nu este autentificat."
        );

    }

}


/*
    PROTECȚIE HTML
*/

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;

}


document.addEventListener(
    "DOMContentLoaded",
    checkLogin
);
