import { readFileSync } from "fs";
import * as samlify from "samlify";

const URL = process.env.URL || "http://localhost:3000";

const idp = samlify.IdentityProvider({
	entityID: `${URL}/sso/metadata`,
	signingCert: readFileSync("./assets/encryptionCert.cer"),
	privateKey: readFileSync("./assets/encryptKey.pem"),
	privateKeyPass: process.env.PRIVATE_KEY_PASSWORD,
	singleSignOnService: [
		{
			Binding: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect",
			Location: `${URL}/sso/http-post`,
		},
	],
	nameIDFormat: ["urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"],
	loginResponseTemplate: {
		context: samlify.SamlLib.defaultLoginResponseTemplate.context,
		attributes: [
			{
				name: "email",
				valueTag: "email",
				nameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
				valueXsiType: "xs:string",
			},
			{
				name: "username",
				valueTag: "robloxName",
				nameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
				valueXsiType: "xs:string",
			},
			{
				name: "uid",
				valueTag: "robloxId",
				nameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
				valueXsiType: "xs:integer",
			},
			{
				name: "groups",
				valueTag: "group",
				nameFormat: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
				valueXsiType: "xs:string",
			},
		],
	},
});

export default idp;
