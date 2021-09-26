import * as samlify from "samlify";
import { readdirSync, readFileSync } from "fs";

const serviceProviders = new Map<string, samlify.ServiceProviderInstance>();

const files = readdirSync("./assets/sp/");
files.forEach((file) => {
	const sp = samlify.ServiceProvider({
		metadata: readFileSync(`./assets/sp/${file}`),
	});

	serviceProviders.set(sp.entityMeta.getEntityID(), sp);
});

export = serviceProviders;
