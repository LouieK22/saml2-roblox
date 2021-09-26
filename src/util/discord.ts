import { discordCallbackUrl } from "routes/auth";
import fetch from "node-fetch";

export const exchangeCode = async (code: string): Promise<string> => {
	const data = {
		client_id: process.env.DISCORD_CLIENT_ID as unknown as string,
		client_secret: process.env.DISCORD_CLIENT_SECRET as unknown as string,
		grant_type: "authorization_code",
		code: code,
		redirect_uri: discordCallbackUrl,
	};

	const res = await fetch("https://discord.com/api/oauth2/token", {
		method: "POST",
		body: new URLSearchParams(data),
	});

	return (await res.json()).access_token;
};

interface Profile {
	id: string;
	username: string;
	avatar: string;
	discriminator: string;
	public_flags: number;
	flags: number;
	locale: string;
	mfa_enabled: boolean;
	premium_type: number;
	email: string;
	verified: boolean;
}

export const getProfile = async (token: string): Promise<Profile> => {
	const res = await fetch("https://discord.com/api/v8/users/@me", {
		headers: {
			authorization: `Bearer ${token}`,
		},
	});

	return await res.json();
};
