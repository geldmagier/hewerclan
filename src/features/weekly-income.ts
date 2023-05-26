import { Client } from "discord.js";
import SWAG from "swagcommands";
import User from "../util/database/User";

export default async (instance: SWAG, client: Client) => {
	// alle member suchen
	const weeklyIncome = async () => {
		// wenn es montag ist, dann weekly income hinzufügen (1 = montag)
		const today = new Date();
		if (today.getDay() === 1) {
			// alle user des servers suchen
			const us = await client.guilds.cache
				.get(process.env.SERVER_ID!)
				?.members.fetch({ force: true });

			us?.forEach(async (u) => {
				const user = new User(u.id);

				// wenn der user kein hewerbox holder ist, dann nichts machen
				if (!u.roles.cache.has(process.env.HEWERBOX_HOLDER_ROLE!)) return;

				const userData = await user.create();

				// weekly income hinzufügen
				if (u.roles.cache.has(process.env.CORPORAL_ROLE!)) {
					user
						.add(parseInt(process.env.CORPORAL_WEEKLY_INCOME!))
						.catch((e) => {});
				} else if (u.roles.cache.has(process.env.SKILLED_ROLE!)) {
					user
						.add(parseInt(process.env.SKILLED_WEEKLY_INCOME!))
						.catch((e) => {});
				} else if (u.roles.cache.has(process.env.EXPERT_ROLE!)) {
					user
						.add(parseInt(process.env.EXPERT_WEEKLY_INCOME!))
						.catch((e) => {});
				} else if (u.roles.cache.has(process.env.MASTERFUL_ROLE!)) {
					user
						.add(parseInt(process.env.MASTERFUL_WEEKLY_INCOME!))
						.catch((e) => {});
				} else if (u.roles.cache.has(process.env.SAGE_ROLE!)) {
					user.add(parseInt(process.env.SAGE_WEEKLY_INCOME!)).catch((e) => {});
				}
			});

			setTimeout(weeklyIncome, 1000 * 60 * 60 * 24);
		}

		setTimeout(weeklyIncome, 1000 * 60 * 60);
	};

	weeklyIncome();
};
