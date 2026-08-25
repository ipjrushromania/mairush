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
