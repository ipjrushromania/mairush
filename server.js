require("dotenv").config();

const express = require("express");
const session = require("express-session");
const crypto = require("crypto");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
    session({
        secret: process.env.SESSION_SECRET,

        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: true,
            sameSite: "lax",

            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);

app.use(express.static(path.join(__dirname, "public")));


/*
========================================
DISCORD LOGIN
========================================
*/

const oauthStates = new Map();


app.get("/auth/discord", (req, res) => {

    const state = crypto
        .randomBytes(32)
        .toString("hex");

    oauthStates.set(state, Date.now());

    const params = new URLSearchParams({

        client_id:
            process.env.DISCORD_CLIENT_ID,

        response_type:
            "code",

        redirect_uri:
            process.env.DISCORD_REDIRECT_URI,

        scope:
            "identify email",

        state:
            state
    });


    res.redirect(
        "https://discord.com/oauth2/authorize?client_id=1541759993437487134&response_type=code&redirect_uri=https%3A%2F%2Fipjrushromania.github.io%2Fmairush%2F%2Fauth%2Fdiscord%2Fcallback&scope=identify+email+guilds+guilds.members.read" +
        params.toString()
    );
});


/*
========================================
DISCORD CALLBACK
========================================
*/

app.get("/auth/discord/callback", async (req, res) => {

    const code = req.query.code;
    const state = req.query.state;


    if (!code || !state) {

        return res
            .status(400)
            .send("Autentificare Discord invalidă.");
    }


    if (!oauthStates.has(state)) {

        return res
            .status(400)
            .send("Sesiunea Discord a expirat.");
    }


    oauthStates.delete(state);


    try {

        /*
        Schimbăm CODE pentru ACCESS TOKEN
        */

        const tokenParams =
            new URLSearchParams({

                client_id:
                    process.env.DISCORD_CLIENT_ID,

                client_secret:
                    process.env.DISCORD_CLIENT_SECRET,

                grant_type:
                    "authorization_code",

                code:
                    code,

                redirect_uri:
                    process.env.DISCORD_REDIRECT_URI
            });


        const tokenResponse =
            await fetch(
                "https://discord.com/api/v10/oauth2/token",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: tokenParams
                }
            );


        if (!tokenResponse.ok) {

            console.error(
                await tokenResponse.text()
            );

            return res
                .status(500)
                .send("Discord token error.");
        }


        const token =
            await tokenResponse.json();


        /*
        Luăm contul Discord
        */

        const userResponse =
            await fetch(
                "https://discord.com/api/v10/users/@me",
                {
                    headers: {
                        Authorization:
                            `${token.token_type} ${token.access_token}`
                    }
                }
            );


        if (!userResponse.ok) {

            return res
                .status(500)
                .send("Nu am putut lua contul Discord.");
        }


        const user =
            await userResponse.json();


        /*
        Salvăm utilizatorul în sesiune
        */

        req.session.discordUser = user;


        /*
        Înapoi pe site
        */

        res.redirect("/");

    } catch (error) {

        console.error(error);

        res
            .status(500)
            .send("Eroare la conectarea Discord.");
    }
});


/*
========================================
VERIFICĂ USERUL CONECTAT
========================================
*/

app.get("/api/me", (req, res) => {

    if (!req.session.discordUser) {

        return res.json({
            authenticated: false
        });
    }


    res.json({

        authenticated: true,

        user:
            req.session.discordUser
    });
});


/*
========================================
LOGOUT
========================================
*/

app.get("/auth/logout", (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");
    });
});


/*
========================================
START
========================================
*/

app.listen(PORT, () => {

    console.log(
        `HUB MAI pornit pe portul ${PORT}`
    );
});
