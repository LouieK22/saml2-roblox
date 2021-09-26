import ejs from "ejs";
import fs from "fs";
import path from "path";

const loadTemplate = (file: string) => {
	const content = fs.readFileSync(file);
	const template = ejs.compile(content.toString());

	return template;
};

export = {
	form: loadTemplate("./views/form.ejs"),
};
