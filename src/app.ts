import * as validator from "@authenio/samlify-node-xmllint";
import cookieParser from "cookie-parser";
import express from "express";
import auth from "routes/auth";
import sso from "routes/sso";
import * as samlify from "samlify";
import asyncWrapper from "util/asyncWrapper";
import { exchangeCode, getProfile } from "util/discord";
import { getRobloxUserFromDiscordId, getUserName, getUserRankInGroup } from "util/roblox";

import roles from "./roles.json";

samlify.setSchemaValidator(validator);

const app = express();

app.use(cookieParser());

app.use(
	asyncWrapper(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		const code = req.query.OAuthCode;
		if (!code || typeof code !== "string") {
			return next();
		}

		const token = await exchangeCode(code);

		const discordProfile = await getProfile(token);
		const robloxUser = await getRobloxUserFromDiscordId(discordProfile.id);
		const robloxName = await getUserName(robloxUser.robloxId);

		const groupRank = await getUserRankInGroup(robloxUser.robloxId, process.env.GROUP_ID as unknown as number);

		let group = "public";

		for (const role of roles) {
			if (groupRank >= role.rank) {
				group = role.role;
			} else {
				break;
			}
		}

		req.user = {
			robloxId: robloxUser.robloxId,
			robloxName,
			email: discordProfile.email,
			group,
		};

		return next();
	}),
);

app.use("/auth", auth);
app.use("/sso", sso);

app.use((err: Error, req: express.Request, res: express.Response) => {
	if (err.stack) {
		console.error(err.stack);
	} else {
		console.error(err);
	}

	res.sendStatus(500);
});

export = app;
