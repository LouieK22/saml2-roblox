import fetch from "node-fetch";

interface RobloxUser {
	robloxId: number;
	robloxUsername: string;
}

export const getRobloxUserFromDiscordId = async (discordId: string): Promise<RobloxUser> => {
	const res = await fetch(`https://verify.eryn.io/api/user/${discordId}`);

	const data = await res.json();

	if (data.status === "ok") {
		return data;
	} else {
		throw new Error("rover api failed");
	}
};

interface RobloxUserGroup {
	group: {
		id: number;
	};
	role: {
		rank: number;
	};
}

interface RobloxUserRolesData {
	data: Array<RobloxUserGroup>;
}

export const getUserRankInGroup = async (robloxId: number, groupId: number): Promise<number> => {
	const res = await fetch(`https://groups.roblox.com/v1/users/${robloxId}/groups/roles`);

	const data: RobloxUserRolesData = await res.json();

	for (const userGroup of data.data) {
		if (userGroup.group.id == groupId) {
			return userGroup.role.rank;
		}
	}

	return 0;
};

export const getUserName = async (userId: number): Promise<string> => {
	const userRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);

	const contentType = userRes.headers.get("content-type") || "";
	if (!contentType.includes("application/json")) {
		return "<API Error>";
	}

	const data = await userRes.json();

	return data.name;
};
