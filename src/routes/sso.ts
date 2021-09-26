import express, { Router } from "express";
import asyncWrapper from "util/asyncWrapper";
import idp from "saml/idp";
import templates from "util/templates";
import { SamlLib, Utility } from "samlify";
import { parseString } from "xml2js";
import { promisify } from "util";
import serviceProviders from "saml/serviceProviders";

// Only contains what we care about
interface SignInRequest {
	["samlp:AuthnRequest"]: {
		["saml:Issuer"]: string[];
	};
}

const promiseParseString = promisify(parseString);

const router = Router();

router.get("/metadata", (req, res) => {
	res.header("Content-Type", "text/xml").send(idp.getMetadata());
});

router.get(
	"/http-post",
	asyncWrapper(async (req: express.Request, res: express.Response) => {
		const url = new URL(req.protocol + "://" + req.get("host") + req.originalUrl);

		if (!req.user) {
			return res.redirect(`/auth/start${url.search}`);
		}

		if (req.user.group == "public") {
			// TODO: Actually show an error page and redirect to application

			return res.sendStatus(403);
		}

		const data = Utility.base64Decode(req.query.SAMLRequest as unknown as string, true) as unknown as string;
		const dataDecode = Utility.inflateString(data);

		try {
			await SamlLib.isValidXml(dataDecode);
		} catch (e) {
			throw e;
		}

		const entityId = ((await promiseParseString(dataDecode)) as SignInRequest)["samlp:AuthnRequest"][
			"saml:Issuer"
		][0];

		const sp = serviceProviders.get(entityId);
		if (!sp) {
			return res.status(400).type("text").send("bad entity id");
		}

		const parse = await idp.parseLoginRequest(sp, "redirect", {
			query: req.query,
		});

		const resp = await idp.createLoginResponse(sp, parse, "post", req.user);

		res.type("html");
		res.send(
			templates.form({
				type: "SAMLResponse",
				callback: resp.entityEndpoint,
				RelayState: req.query.RelayState,
				token: resp.context,
			}),
		);
	}),
);

export default router;
