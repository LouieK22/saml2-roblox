import express, { CookieOptions, Router } from "express";
import asyncWrapper from "util/asyncWrapper";

export const discordCallbackUrl = process.env.URL + "/auth/callback";

const router = Router();

const DISCORD_URL = "https://discord.com/api/oauth2";

const OAUTH2_CONFIG = {
	redirect_uri: new URL("/auth/callback", process.env.URL).href,
	scope: "identify email",
	id: process.env.DISCORD_CLIENT_ID,
	secret: process.env.DISCORD_CLIENT_SECRET,
};

const COOKIE_CONFIG: CookieOptions = {
	sameSite: "lax",
	httpOnly: true,
	maxAge: 30 * 60 * 1000, // 30 minutes
};

router.get(
	"/start",
	asyncWrapper(async (req: express.Request, res: express.Response) => {
		res.cookie("saml-context", req.query.SAMLRequest, COOKIE_CONFIG);
		if (req.query.RelayState) {
			res.cookie("saml-relay-state", req.query.RelayState, COOKIE_CONFIG);
		}

		return res.redirect(302, "/auth/redirect");
	}),
);

router.get(
	"/redirect",
	asyncWrapper(async (req: express.Request, res: express.Response) => {
		const target = `${DISCORD_URL}/authorize?client_id=${OAUTH2_CONFIG.id}&redirect_uri=${encodeURI(
			discordCallbackUrl,
		)}&response_type=code&scope=identify%20email`;

		return res.redirect(target);
	}),
);

router.get(
	"/callback",
	asyncWrapper(async (req: express.Request, res: express.Response) => {
		const code = req.query.code;
		if (!code || typeof code !== "string") {
			return res.sendStatus(400);
		}

		const SAMLRequest: string | undefined = req.cookies["saml-context"];
		if (!SAMLRequest) {
			return res.sendStatus(401);
		}

		const params = new URLSearchParams({ OAuthCode: code, SAMLRequest });

		const RelayState: string | undefined = req.cookies["saml-relay-state"];
		if (RelayState) {
			params.append("RelayState", RelayState);
		}

		return res.redirect(`/sso/http-post?${params.toString()}`);
	}),
);

export default router;
