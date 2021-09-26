import * as express from "express";

type inputFn = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<unknown>;

const asyncWrapper = (callback: inputFn) => {
	return (req: express.Request, res: express.Response, next: express.NextFunction): void => {
		callback(req, res, next).catch(next);
	};
};

export default asyncWrapper;
