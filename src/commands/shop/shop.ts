import { PermissionFlagsBits } from "discord.js";
import { CommandObject, CommandType } from "swagcommands";
import Shop from "../../util/database/Shop";

export default {
	description: "Display the shop",
	type: CommandType.SLASH,
	testOnly: true,
	guildOnly: true,

	permissions: [PermissionFlagsBits.Administrator],

	options: [],

	callback: async ({ interaction, args, client }) => {
		const shop = new Shop(client);
		const embed = await shop.getEmbed();

		return embed;
	},
} as CommandObject;
