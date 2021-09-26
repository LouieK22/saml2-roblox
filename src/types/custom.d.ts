declare namespace Express {
	export interface Request {
		user?: {
			robloxId: number;
			robloxName: string;
			email: string;
			group: string;
		};
	}
}
