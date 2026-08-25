function loginWithDiscord() {
    const clientId = "1541759993437487134";

    const redirectUri =
        "http://localhost:3000/auth/discord/callback";

    const scope = "identify email guilds";

    const url =
        "https://discord.com/oauth2/authorize" +
        "?client_id=" + clientId +
        "&response_type=code" +
        "&redirect_uri=" + encodeURIComponent(redirectUri) +
        "&scope=" + encodeURIComponent(scope);

    window.location.href = url;
}